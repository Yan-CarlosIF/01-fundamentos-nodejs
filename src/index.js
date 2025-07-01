import express, { response } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

const custumers = [];

/**
 * id - uuid
 * cpf - string
 * name - string
 * statement - Array<{}>
 */
app.post("/account", (req, res) => {
  try {
    const { cpf, name } = req.body;

    const custumerAlreadyExists = custumers.some(
      (custumer) => custumer.cpf === cpf
    );

    if (custumerAlreadyExists) {
      return res.status(400).json({ error: "Custumer already exists!" });
    }

    custumers.push({
      id: uuidv4(),
      cpf,
      name,
      statement: [],
    });

    return res.status(201).send();
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get("/statement", (req, res) => {
  const { cpf } = req.headers;

  const custumer = custumers.find((custumer) => custumer.cpf === cpf);

  if (!custumer) {
    return res.status(404).json({ error: "Custumer not found!" });
  }

  return res.status(200).json(custumer.statement);
});

app.listen(3333, () => {
  console.log("app running at http://localhost:3333");
});
