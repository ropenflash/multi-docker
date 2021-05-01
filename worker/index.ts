import fib from "./fib";
import * as redis from "redis";
import * as dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import keys from "./keys";

const redisOptions = {
  port: parseInt(keys.redisPort),
  host: keys.redisHost,
  retry_startegy: () => 1000,
};
const client = redis.createClient(redisOptions);

const sub = client.duplicate();

sub.on("message", (channel, message) => {
  client.hset("values", message, fib(parseInt(message)).toString());
});

sub.subscribe("insert");
