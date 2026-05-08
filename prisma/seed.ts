import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";

async function upsertUser(data: {
  name: string;
  email: string;
  password: string;
  role?: "USER" | "ADMIN" | "MANAGER";
  tokenBalance?: number;
  reputationScore?: number;
  expertise?: string[];
  interests?: string[];
}) {
  const hashedPassword = await bcrypt.hash(data.password, 12);

  return prisma.user.upsert({
    where: { email: data.email },
    update: {
      name: data.name,
      role: data.role || "USER",
      tokenBalance: data.tokenBalance ?? 10,
      reputationScore: data.reputationScore ?? 0,
      expertise: data.expertise || [],
      interests: data.interests || [],
    },
    create: {
      ...data,
      password: hashedPassword,
      role: data.role || "USER",
      tokenBalance: data.tokenBalance ?? 10,
      reputationScore: data.reputationScore ?? 0,
      expertise: data.expertise || [],
      interests: data.interests || [],
    },
  });
}

async function main() {
  const admin = await upsertUser({
    name: "Admin Lead",
    email: "admin@knowledgetrader.com",
    password: "admin123",
    role: "ADMIN",
    tokenBalance: 500,
    expertise: ["Platform operations", "Analytics"],
    interests: ["Marketplace quality", "Creator growth"],
  });

  const manager = await upsertUser({
    name: "Marketplace Manager",
    email: "manager@knowledgetrader.com",
    password: "manager123",
    role: "MANAGER",
    tokenBalance: 250,
    expertise: ["Community", "Skill curation"],
    interests: ["Mentorship", "AI learning"],
  });

  const mentor = await upsertUser({
    name: "Seed Mentor",
    email: "mentor@example.com",
    password: "mentor123",
    tokenBalance: 160,
    reputationScore: 4.8,
    expertise: ["Go", "Microservices", "gRPC"],
    interests: ["Distributed systems", "Backend architecture"],
  });

  const aiMentor = await upsertUser({
    name: "Aisha Rahman",
    email: "aisha@example.com",
    password: "user123",
    tokenBalance: 130,
    reputationScore: 4.6,
    expertise: ["Prompt engineering", "AI workflows", "Automation"],
    interests: ["Teaching AI", "Creator tooling"],
  });

  const learner = await upsertUser({
    name: "John Doe",
    email: "john@example.com",
    password: "secret123",
    tokenBalance: 90,
    expertise: ["JavaScript", "React"],
    interests: ["Backend Development", "AI automation", "Cloud deployment"],
  });

  const designer = await upsertUser({
    name: "Nadia Karim",
    email: "nadia@example.com",
    password: "user123",
    tokenBalance: 75,
    expertise: ["UI design", "Research"],
    interests: ["Product strategy", "No-code automation"],
  });

  const posts = await Promise.all([
    prisma.skillPost.upsert({
      where: { slug: "advanced-go-microservices" },
      update: {},
      create: {
        title: "Advanced Microservices with Go",
        slug: "advanced-go-microservices",
        category: "Backend Development",
        tags: ["go", "microservices", "grpc"],
        shortDescription:
          "Learn to build scalable, distributed systems using Go and gRPC.",
        longDescription:
          "A production-focused path covering service discovery, circuit breakers, tracing, deployment, and reliability patterns.",
        tokenPrice: 15,
        images: ["https://example.com/go-course.jpg"],
        previewContent: { intro: "Go is built for concurrency." },
        lockedContent: {
          videoUrl: "https://secure-stream.com/v/go-microservices",
          sourceCode: "github.com/knowledge-trader/go-microservices",
        },
        creatorId: mentor.id,
      },
    }),
    prisma.skillPost.upsert({
      where: { slug: "ai-automation-playbook" },
      update: {},
      create: {
        title: "AI Automation Playbook",
        slug: "ai-automation-playbook",
        category: "AI Automation",
        tags: ["ai", "automation", "workflows"],
        shortDescription:
          "Design reliable AI workflows for operations, content, and support.",
        longDescription:
          "Build prompt chains, human review loops, fallback flows, and measurable automation systems.",
        tokenPrice: 12,
        images: ["https://example.com/ai-automation.jpg"],
        previewContent: { intro: "Automation starts with clear decisions." },
        lockedContent: {
          templates: ["support-triage", "content-brief", "ops-audit"],
          workbook: "https://secure-stream.com/files/ai-playbook",
        },
        creatorId: aiMentor.id,
      },
    }),
    prisma.skillPost.upsert({
      where: { slug: "product-strategy-sprint" },
      update: {},
      create: {
        title: "Product Strategy Sprint",
        slug: "product-strategy-sprint",
        category: "Product",
        tags: ["strategy", "research", "roadmap"],
        shortDescription:
          "Turn fuzzy ideas into validated product bets and roadmaps.",
        longDescription:
          "A compact operating system for discovery interviews, opportunity scoring, positioning, and roadmap decisions.",
        tokenPrice: 10,
        images: ["https://example.com/product-strategy.jpg"],
        previewContent: { intro: "Strategy is choosing what not to build." },
        lockedContent: {
          worksheet: "https://secure-stream.com/files/strategy-sprint",
          examples: ["B2B SaaS", "marketplace", "creator tool"],
        },
        creatorId: designer.id,
      },
    }),
  ]);

  const tradeSpecs = [
    { post: posts[0], learner, teacher: mentor },
    { post: posts[1], learner, teacher: aiMentor },
    { post: posts[2], learner: mentor, teacher: designer },
    { post: posts[1], learner: designer, teacher: aiMentor },
  ];

  for (const spec of tradeSpecs) {
    const existingTrade = await prisma.trade.findFirst({
      where: {
        postId: spec.post.id,
        learnerId: spec.learner.id,
        status: "COMPLETED",
      },
    });

    if (!existingTrade) {
      const trade = await prisma.trade.create({
        data: {
          postId: spec.post.id,
          learnerId: spec.learner.id,
          teacherId: spec.teacher.id,
          status: "COMPLETED",
        },
      });

      await prisma.transaction.create({
        data: {
          userId: spec.learner.id,
          tradeId: trade.id,
          amount: spec.post.tokenPrice,
          type: "DEBIT",
        },
      });
    }
  }

  const reviews = [
    {
      postId: posts[0].id,
      userId: learner.id,
      rating: 5,
      comment:
        "Clear, practical, and full of production details I could apply immediately.",
    },
    {
      postId: posts[1].id,
      userId: learner.id,
      rating: 4,
      comment:
        "Great workflow examples and useful guardrails for real business automations.",
    },
    {
      postId: posts[1].id,
      userId: designer.id,
      rating: 5,
      comment:
        "The templates made it easy to convert manual tasks into repeatable AI systems.",
    },
    {
      postId: posts[2].id,
      userId: mentor.id,
      rating: 4,
      comment:
        "Strong strategy framework with practical exercises for prioritization.",
    },
  ];

  for (const review of reviews) {
    const exists = await prisma.review.findFirst({
      where: {
        postId: review.postId,
        userId: review.userId,
        comment: review.comment,
      },
    });

    if (!exists) {
      await prisma.review.create({ data: review });
    }
  }

  await Promise.all([
    prisma.notification.create({
      data: {
        userId: admin.id,
        title: "Seed data ready",
        message: "Knowledge Trader demo data has been populated.",
      },
    }),
    prisma.notification.create({
      data: {
        userId: manager.id,
        title: "Marketplace activity",
        message: "New trades and reviews are available for dashboard review.",
      },
    }),
    prisma.notification.create({
      data: {
        userId: mentor.id,
        title: "New learner review",
        message: "Your Go microservices course received a 5-star review.",
      },
    }),
  ]);

  const creators = [mentor, aiMentor, designer];
  for (const creator of creators) {
    const aggregate = await prisma.review.aggregate({
      where: {
        post: {
          creatorId: creator.id,
        },
      },
      _avg: {
        rating: true,
      },
    });

    await prisma.user.update({
      where: {
        id: creator.id,
      },
      data: {
        reputationScore: aggregate._avg.rating || creator.reputationScore,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
