import "dotenv/config";
import app from "./app";
import { prisma } from "../lib/prisma";

const port = 5000;

async function main() {
  await prisma.$connect();

  app.listen(port, () => {
    console.log(`Knowledge Trader server is running on port ${port}`);
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
