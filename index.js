const express = require("express");
const cors = require("cors");

//3.7
const morgan = require("morgan");
const app = express();
app.use(cors());
app.use(express.static("dist"));

//3.8
morgan.token("body", function logBody(req) {
  return JSON.stringify(req.body);
});

const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(requestLogger);

const http = require("http");

const phonebook = [
  { id: "1", name: "Arto Hellas", number: "040-123456" },
  { id: "2", name: "Ada Lovelace", number: "39-44-5323523" },
  { id: "3", name: "Dan Abramov", number: "12-43-234345" },
  { id: "4", name: "Mary Poppendieck", number: "39-23-6423122" },
];

//etusivu
app.get("/", (request, response) => {
  response.send("<h1>Phonebook frontpage</h1><p>Tämä on etusivu</p>");
});

//3.2
app.get("/info", (req, res) => {
  const timeDate = new Date();
  let n = phonebook.length;
  res.send(`<p>Phonebook has info for ${n} people</p><p>${timeDate}</p>`);
});

//3.1
//Kaikki henkilöt
app.get("/api/persons", (request, response) => {
  response.end(JSON.stringify(phonebook));
});

//3.5 tehtävä
//Lisääminen
app.post("/api/persons", (req, res) => {
  const contact = req.body;
  const createId = Math.floor(Math.random() * 901) + 4;
  contact.id = createId.toString(); //Muutetaan merkkijonoksi, koska aiemmat IDt on myös string muodossa.

  //3.6 tehtävä
  //Jos nimi tai numero puuttuu, niin...
  if (!contact.name || !contact.number) {
    console.log("missing name or number");
    return res.status(400).json({ error: "missing name or number" });
  }

  const nameExists = phonebook.find((x) => x.name === contact.name);
  if (nameExists) {
    console.log("Name already in the list");
    return res.status(400).json({ error: "Name already in the list" });
  }

  console.log(contact, "successfully added");
  phonebook.push(contact);
  res.status(201).json(contact);
});

//löytäminen
app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const contact = phonebook.find((contact) => contact.id === id);

  contact ? res.json(contact) : res.status(404).end(); //404 status koodi, jos ID ei löydy
});

//3.4 tehtävä
//Poistaminen
app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const index = phonebook.findIndex((contact) => contact.id === id);
  //phonebook = phonebook.filter((contact) => contact.id !== id); //Vaihtoehtoinen mentelmä, mutta phonebook on oltava "let"
  phonebook.splice(index, 1);
  console.log("delete successful");
  res.status(204).end();
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
