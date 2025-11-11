import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import app from "./app.js";
import { connectPostgres } from "./db/postgres.db.js";
import { connectRedis } from "./db/redis.db.js";

await connectPostgres();
await connectRedis();

const PORT = process.env.PORT;

console.log(process.env.DATABASE_URL);
console.log(process.env.PORT);

app.listen(PORT, () => {
  console.log(`App is running on post ${PORT}`);
});