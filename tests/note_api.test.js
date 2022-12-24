const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Note = require('../models/note');
const { initialNotes, nonExistingId, notesInDb } = require('./test_helper');
const User = require('../models/user');

const api = supertest(app);

let token;
let id;

beforeAll(async () => {
  const loginResponse = await api
    .post('/api/login')
    .send({ username: 'tester', password: 'tester' });
  const user = await User.findOne({ username: 'tester' });
  token = loginResponse.body.token;
  id = user._id;
});

beforeEach(async () => {
  await Note.deleteMany({});
  await Note.insertMany(initialNotes);
});

describe('when there is initially some notes saved', () => {
  test('notes are returned as json', async () => {
    await api
      .get('/api/notes')
      .expect(200)
      .expect('Content-Type', /application\/json/);
  });

  test('all notes are returned', async () => {
    const response = await api.get('/api/notes');

    expect(response.body).toHaveLength(initialNotes.length);
  });

  test('a specific note is within the returned notes', async () => {
    const response = await api.get('/api/notes');
    const contents = response.body.map((r) => r.content);

    expect(contents).toContain('Browser can execute only Javascript');
  });
});

describe('addition of a new note', () => {
  test('a valid note can be added', async () => {
    const newNote = {
      content: 'async/await simplifies making async calls',
      important: true,
      userId: id,
    };

    await api
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(newNote)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const notesAtEnd = await notesInDb();
    expect(notesAtEnd).toHaveLength(initialNotes.length + 1);

    const contents = notesAtEnd.map((r) => r.content);

    expect(contents).toContain('async/await simplifies making async calls');
  });

  test('note without content is not added', async () => {
    const newNote = {
      important: true,
    };

    await api
      .post('/api/notes')
      .set('Authorization', `Bearer ${token}`)
      .send(newNote)
      .expect(400);

    const notesAtEnd = await notesInDb();
    expect(notesAtEnd).toHaveLength(initialNotes.length);
  });
});

describe('viewing a specific note', () => {
  test('a specific note can be viewed', async () => {
    const notesAtStart = await notesInDb();
    const noteToView = notesAtStart[0];

    const resultNote = await api
      .get(`/api/notes/${noteToView.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const processedNote = JSON.parse(JSON.stringify(noteToView));
    expect(resultNote.body).toEqual(processedNote);
  });

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await nonExistingId();
    await api.get(`/api/notes/${validNonexistingId}`).expect(404);
  });
});

describe('update of a note', () => {
  test('a note with a valid id can be updated', async () => {
    const notesAtStart = await notesInDb();
    const noteToUpdate = notesAtStart[0];
    const newContent = 'Browser can execute only Javascript';

    await api
      .put(`/api/notes/${noteToUpdate.id}`)
      .send({ content: newContent, important: true })
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const notesAtEnd = await notesInDb();
    expect(notesAtEnd).toHaveLength(initialNotes.length);

    const contents = notesAtEnd.map((r) => r.content);
    expect(contents).toContain(newContent);
  });
});

describe('deletion of a note', () => {
  test('a note with a valid id can be deleted', async () => {
    const notesAtStart = await notesInDb();
    const noteToDelete = notesAtStart[0];

    await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

    const notesAtEnd = await notesInDb();
    expect(notesAtEnd).toHaveLength(initialNotes.length - 1);

    const contents = notesAtEnd.map((r) => r.content);
    expect(contents).not.toContain(noteToDelete.content);
  });

  test('fails with statuscode 404 if note does not exist', async () => {
    const validNonexistingId = await nonExistingId();
    await api.delete(`/api/notes/${validNonexistingId}`).expect(404);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
