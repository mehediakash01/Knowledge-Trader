import "dotenv/config";
import app from "./app";
import config from "./config";
import { prisma } from "../lib/prisma";

async function main() {
  await prisma.$connect();

  app.listen(config.port, () => {
    console.log(`Knowledge Trader server is running on port ${config.port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
