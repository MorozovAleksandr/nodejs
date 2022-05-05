import express from "express";
import path from "path";
import fs from "fs";

const webserver = express();
const __dirname = path.resolve();
const port = 3095;

webserver.use(express.json());

const voitingVariants = [
  { code: 1, name: "JS" },
  { code: 2, name: "Assembler" },
  { code: 3, name: "C++" },
];

webserver.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/index.html"))
);

webserver.get("/variants", (req, res) => {
  fs.readFile("stat.json", (err, data) => {
    const variants = JSON.parse(data).stat.map((i) => ({
      name: i.name,
      code: i.code,
    }));
    res.json(variants);
  });
});

webserver.post("/stat", (req, res) => {
  fs.readFile("stat.json", (err, data) => {
    res.json(JSON.parse(data));
  });
});

webserver.post("/vote", (req, res) => {
  const rawdata = fs.readFileSync("stat.json");
  const fileJson = JSON.parse(rawdata);

  fileJson.stat.forEach((i) => {
    i.code === +req.body.code && i.votes++;
  });

  fs.writeFileSync("stat.json", JSON.stringify(fileJson));

  res.send({ error: false });
});

webserver.listen(port, () => {
  console.log("running on port: " + port);
});
