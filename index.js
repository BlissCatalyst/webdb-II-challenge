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

// ********** GET ALL ZOOS **********
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

// ********** GET ZOO BY ID **********
server.get("/api/zoos/:id", async (req, res) => {
  try {
    const [id] = req.params.id;
    const zoo = await db("zoos")
      .where({ id })
      .first();
    if (zoo) {
      res.status(200).json({ zoo, message: "Here is the zoo you selected!" });
    } else {
      res.status(400).json({ message: "The zoo at this id doesn't exist." });
    }
  } catch (err) {
    res.status(500).json({
      message: "Our server will not deliver that up for you right now..."
    });
  }
});

// ********** DELETE **********
server.delete("/api/zoos/:id", async (req, res) => {
  try {
    const [id] = req.params.id;
    const deleted = await db("zoos")
      .where({ id })
      .del();
    if (deleted) {
      res.status(200).json({ message: `${deleted} zoo record was deleted.` });
    } else {
      res
        .status(400)
        .json({ message: "The zoo you are trying to delete doesn't exist." });
    }
  } catch (err) {
    res.status(500).json({
      message: "This server wants that one to stay forever, it will not delete"
    });
  }
});

// ********** PUT **********
server.put("/api/zoos/:id", async (req, res) => {
  try {
    const update = req.body;
    const [id] = req.params.id;
    if (update && update.name) {
      const changed = await db("zoos")
        .where({ id })
        .update(update);
      if (changed) {
        const newZoo = await db("zoos")
          .where({ id })
          .first();
        res.status(200).json({ newZoo, message: "Here is the updated zoo!" });
      } else {
        res.status(400).json({ message: "That zoo record doesn't exist." });
      }
    } else {
      res
        .status(400)
        .json({ message: "You must include a name for updating." });
    }
  } catch (err) {
    res.status(500).json({ message: "The server will not update right now." });
  }
});

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
