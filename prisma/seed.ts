import { prisma } from "../lib/prisma";

async function main() {
  const creator = await prisma.user.upsert({
    where: { email: "mentor@example.com" },
    update: {},
    create: {
      name: "Seed Mentor",
      email: "mentor@example.com",
      password: "seed-password",
      role: "USER",
      tokenBalance: 100,
      reputationScore: 4.8,
      expertise: ["Go", "Microservices", "gRPC"],
      interests: ["Distributed systems", "Backend architecture"],
    },
  });

  await prisma.skillPost.upsert({
    where: { slug: "advanced-go-microservices" },
    update: {},
    create: {
      title: "Advanced Microservices with Go",
      slug: "advanced-go-microservices",
      shortDescription: "Learn to build scalable, distributed systems using Go and gRPC.",
      longDescription: "### What you will learn\n- Service discovery\n- Circuit breakers\n- Distributed tracing with Jaeger...",
      tokenPrice: 15,
      images: ["https://example.com/go-course.jpg"],
      previewContent: { intro: "Go is built for concurrency..." },
      lockedContent: { videoUrl: "https://secure-stream.com/v/123", sourceCode: "github.com/repo" },
      creatorId: creator.id,
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
