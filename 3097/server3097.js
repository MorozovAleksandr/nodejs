import express from "express";
import { query, validationResult } from "express-validator";

const app = express();
const port = 3097;

const errorMsg = "Ошибка валидации";
const successMsg = (login, age) => `login=${login} age=${age}`;

const printForm = (login = "", age = "", err = "") => `${err}
<form method="get" action="http://207.154.246.133:3097/service3097">
  ваш логин: <input type="text" name="login" value="${login}" /><br />
  ваш возраст: <input type="number" name="age" value="${age}" /><br />
  <input type="submit" value="Отправить" />
</form>`;

app.get(
  "/service3097",
  query("login").notEmpty(),
  query("age").notEmpty().isNumeric(),
  (req, res) => {
    const {
      query,
      query: { login, age },
    } = req;

    const err = validationResult(req);

    if (!Object.keys(query).length) {
      return res.send(printForm());
    }

    return res.send(
      !err.isEmpty() ? printForm(login, age, errorMsg) : successMsg(login, age)
    );
  }
);

app.listen(port, () => console.log("web server running on port " + port));
