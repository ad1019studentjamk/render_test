const express = require('express');
const morgan = require('morgan');
const app = express();
const cors = require('cors');

// morganin tiny formaatti
app.use(morgan('tiny'));

// morganin custom formaatti
morgan.token('body', (req) => {
  // loggaa vain post-method requestit
  return req.method === 'POST' ? JSON.stringify(req.body) : '-';
});

// custom formaatti, loggaa muodossa
// POST /persons/ 200 53 - 20.449 ms {"name":"John Doe","number":"123-456-789"}
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);

// app.use(express.json());
app.use(cors());

app.get('/', (request, response) => {
  response.send('<p>hello world</p>');
});

app.get('/info', (request, response) => {
  const date = new Date();
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${date}</p>
  `);
});

app.get('/persons', (request, response) => {
  response.json(persons);
});

app.get('/persons/:id', (request, response) => {
  const id = request.params.id;
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// POST
app.post('/persons', (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing',
    });
  }

  // tarkistetaan onko nimi jo listalla
  const nameExists = persons.some((person) => person.name === body.name);

  if (nameExists) {
    return response.status(400).json({
      error: 'name must be unique',
    });
  }

  // generoidaan id 0 ja 1000 väliltä
  const randomNumberString = (Math.floor(Math.random() * 1000) + 1).toString();

  const person = {
    id: randomNumberString,
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

// DELETE
app.delete('/persons/:id', (request, response) => {
  const id = request.params.id;
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
