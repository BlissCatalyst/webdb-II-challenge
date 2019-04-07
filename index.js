const express = require("express");
const helmet = require("helmet");

const knex = require("knex");
const knexConfig = require("./knexfile.js");
const db = knex(knexConfig.development);

const server = express();

server.use(express.json());
server.use(helmet());

// endpoints here
// ********** POST **********
server.post("/api/zoos", async (req, res) => {
  const zooName = req.body;
  try {
    if (zooName && zooName.name) {
      const [id] = await db("zoos").insert(zooName);

      const newId = await db("zoos")
        .select("id", "name")
        .where({ id })
        .first();

      res.status(201).json({
        message: "You've just created a new zoo!",
        id: newId.id,
        name: newId.name
      });
    } else {
      res
        .status(400)
        .json({ message: "You must include a name for the new zoo!" });
    }
  } catch (err) {
    res.status(500).json({
      message: "The server is incabable of making a new zoo right now."
    });
  }
});

// ********** GET **********
server.get("/api/zoos", async (req, res) => {
  try {
    const zoos = await db("zoos");
    res.status(200).json(zoos);
  } catch (err) {
    res.status(500).json({
      message: "server cannot get any of them right now, soo...sorry"
    });
  }
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
