import express, { response } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";

const app = express();
app.use(cors());
app.use(express.json());

/** Type
 * id - uuid
 * cpf - string
 * name - string
 * statement - Array<{
 *                     description - string,
 *                     amount - number,
 *                     created_at - Date,
 *                     type - "credit" | "debit"
 *                   }>
 */
const custumers = [];

// Middleware
function verifyIfExistsAccountCPF(req, res, next) {
  const { cpf } = req.headers;

  const custumer = custumers.find((custumer) => custumer.cpf === cpf);

  if (!custumer) {
    return res.status(400).json({ error: "Custumer not found!" });
  }

  req.custumer = custumer;

  return next();
}

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

app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
  const { custumer } = req;

  return res.status(200).json(custumer.statement);
});

app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
  const { description, amount } = req.body;

  const { custumer } = req;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit",
  };

  custumer.statement.push(statementOperation);

  return res.status(201).send();
});

app.listen(3333, () => {
  console.log("app running at http://localhost:3333");
});
