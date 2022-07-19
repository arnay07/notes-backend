import express from 'express';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

let notes = [
  {
    id: 1,
    content: 'HTML is easy',
    date: '2022-1-17T17:30:31.098Z',
    important: false,
  },
  {
    id: 2,
    content: 'Browser can execute only JavaScript',
    date: '2022-1-17T18:39:34.091Z',
    important: true,
  },
  {
    id: 3,
    content: 'GET and POST are the most important methods of HTTP protocol',
    date: '2022-1-17T19:20:14.298Z',
    important: false,
  },
  {
    content: "let's try this",
    date: '2022-06-30T20:55:20.408Z',
    important: false,
    id: 4,
  },
  {
    content: 'there is something else to see',
    date: '2022-06-30T20:57:16.804Z',
    important: false,
    id: 5,
  },
  {
    content: 'bring me the big checks',
    date: '2022-06-30T21:17:47.019Z',
    important: true,
    id: 6,
  },
  {
    content: 'bonjour comment allez vous ',
    date: '2022-07-14T13:13:09.461Z',
    important: false,
    id: 7,
  },
  {
    content: 'salut tout le monde',
    date: '2022-07-16T17:46:17.275Z',
    important: true,
    id: 8,
  },
];

app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>');
});

app.get('/api/notes', (req, res) => {
  res.json(notes);
});

app.get('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.put('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  const note = notes.find((note) => note.id === id);
  if (note) {
    note.important = req.body.important;
    res.json(note);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/notes/:id', (req, res) => {
  const id = Number(req.params.id);
  notes = notes.filter((note) => note.id !== id);
  res.status(204).end();
});

const generateId = () => {
  const maxId =
    notes.length > 0 ? Math.max(...notes.map((note) => note.id)) : 0;
  return maxId + 1;
};

app.post('/api/notes', (req, res) => {
  const body = req.body;
  if (!body.content) {
    return res.status(400).json({ error: 'content missing' });
  }
  const note = {
    content: body.content,
    important: body.important || false,
    date: new Date(),
    id: generateId(),
  };
  notes = notes.concat(note);
  res.json(note);
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
