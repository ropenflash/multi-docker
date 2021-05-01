import * as redis from "redis";
import * as dotenv from "dotenv";
import * as cors from "cors";
import * as pg from "pg";
import * as express from "express";
dotenv.config({ path: "./.env" });
import { keys } from "./keys";

// Express Setup
const app = express();
app.use(cors());
app.use(express.json());

console.log(keys);

// Postgres client setup
const pgClient = new pg.Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: parseInt(keys.pgPort),
});

pgClient.on("error", () => {
  console.log("Lost PG connection");
});

pgClient
  .query("CREATE TABLE IF NOT EXISTS values (number INT)")
  .catch((err) => console.log(err));

// Redis Client setup
const redisOptions = {
  host: keys.redisHost,
  port: parseInt(keys.redisPort),
  retry_strategy: () => 1000,
};
const redisClient = redis.createClient(redisOptions);
const redisPublisher = redisClient.duplicate();

// Express Route Handlers
app.get("/", (req, res) => {
  res.send("I am changed");
});

app.get("/values", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");
  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;
  if (parseInt(index) > 40) {
    return res.status(422).send("Index too high");
  }
  redisClient.hset("values", index, "Nothing yet");
  redisPublisher.publish("insert", index);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);
  res.send({ working: true });
});

app.listen(keys.port, () => {
  console.log(`listening on port ${keys.port}`);
});
