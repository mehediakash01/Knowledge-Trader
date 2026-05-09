# 🎓 Knowledge Trader

> **A reputation-backed, AI-powered skill marketplace where experts teach and learners thrive.**

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933)
![Next.js](https://img.shields.io/badge/Next.js-16.x-000000)
![License](https://img.shields.io/badge/License-ISC-blue)

---

## 🚀 Project Mission

Knowledge Trader reimagines skill exchange through:

- **🎯 AI-Powered Discovery**: Multi-model AI gateway (Gemini → Groq → OpenRouter) for intelligent matchmaking
- **🔐 Atomic Transactions**: Redis-backed cache + Prisma transactions ensure zero token loss
- **⚡ Real-Time Experience**: Socket.io notifications, live reviews, and instant reputation updates
- **🏆 Reputation Economy**: Tokenized knowledge exchange with verified reviews and creator ratings
- **🛡️ Enterprise Security**: RBAC, XSS sanitization, JWT tokens, and comprehensive error boundaries

---

## 📊 The Stack

### Frontend (Next.js + React)
```
├── Next.js 16 (Turbopack)
├── Redux Toolkit + RTK Query (State & APIs)
├── Socket.io Client (Real-time notifications)
├── Framer Motion (Smooth animations)
├── Shadcn/UI + Tailwind CSS (Design system)
├── Recharts (Analytics dashboards)
└── Zod (Validation)
```

### Backend (Express + TypeScript)
```
├── Express 5
├── Prisma ORM (Type-safe DB)
├── PostgreSQL (Primary data store)
├── Redis (Caching + Rate limiting + Pub/Sub)
├── Socket.io (Real-time events)
├── Winston (Logging)
├── Helmet (Security headers)
└── Multi-Model AI Gateway (Gemini/Groq/OpenRouter)
```

### AI Brain
```
1. AI Matchmaker: Context-aware skill recommendations
2. AI Course Architect: Auto-generate syllabi from topics
3. AI Smart Reviewer: Synthesize reviews into pros/cons summaries
4. AI Safety System: Content moderation & guardrails
```

---

## 🎨 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   CLIENT LAYER (Next.js)                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Bazaar Page  │  │ Dashboard    │  │ AI Features  │  │
│  │ (Search/UX)  │  │ (Admin/User) │  │ (Matchmaker) │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │
│         └──────────────────┼──────────────────┘         │
│                   Redux + Socket.io                      │
└─────────────────┬──────────────────────────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
   HTTP/REST          WebSocket
        │                   │
┌─────────────────────────────────────────────────────────┐
│              SERVER LAYER (Express)                     │
│                                                          │
│  ┌──────────────────┐  ┌──────────────────┐            │
│  │ API Routes       │  │ Socket Gateway   │            │
│  │ • Auth           │  │ • Notifications  │            │
│  │ • Skill Posts    │  │ • Live Updates   │            │
│  │ • Trades         │  │ • Presence       │            │
│  │ • Reviews        │  │                  │            │
│  │ • Analytics      │  │                  │            │
│  └────────┬─────────┘  └────────┬─────────┘            │
│           └──────────┬──────────┘                       │
│                      │                                  │
│          ┌───────────┼───────────┐                      │
│          │           │           │                      │
│   ┌──────▼─────┐ ┌──▼──────┐ ┌──▼─────────┐           │
│   │ PostgreSQL │ │ Redis   │ │ AI Gateway │           │
│   │            │ │ Cache   │ │ (Multi)    │           │
│   │ • Users    │ │ • Rate  │ │            │           │
│   │ • Posts    │ │  Limit  │ │ Gemini     │           │
│   │ • Trades   │ │ • Feed  │ │ ↓ Groq     │           │
│   │ • Reviews  │ │ • Pub   │ │ ↓ Router   │           │
│   │            │ │  Sub    │ │            │           │
│   └────────────┘ └────────┘ └────────────┘           │
└─────────────────────────────────────────────────────────┘
```

---

## ✨ Key Features

### 1. Immersive Bazaar
- **URL-Synced Filters**: Share curated views via link
- **Real-Time Availability**: See total sales, live review counts
- **Rich Search**: Full-text search + category + price range filters
- **Skeleton Loading**: Prevents layout shift during data fetching

### 2. Dashboard Suite
- **User Dashboard**: Token balance, purchased skills, learning progress
- **Teacher Dashboard**: My listings, sales analytics, earnings
- **Admin Dashboard**: Platform stats, user management, transaction volume charts
- **Error Boundaries**: Graceful fallback for unavailable services

### 3. AI Intelligence Suite
- **AI Matchmaker**: "Find my match" recommends skills based on profile
- **AI Course Architect**: Generate course outlines from a skill title
- **AI Smart Reviewer**: Auto-synthesize reviews into pros/cons
- **Thinking UI**: Animated loading states (e.g., "Analyzing market trends...")

### 4. Trade Engine
- **Atomic Transactions**: Token debit + credit + content gating in one transaction
- **Duplicate Prevention**: Can't buy the same skill twice
- **Review System**: Leave ratings after purchase with AI summarization
- **Notification Webhook**: Sellers get real-time alerts

### 5. Reputation System
- **Star Ratings**: 5-star reviews with creator feedback
- **Creator Badges**: "Trusted Instructor" based on review average
- **Reputation Score**: Dynamically updated from review aggregate
- **Activity Feed**: Social proof of transactions and reviews

### 6. Real-Time Pulse
- **Socket.io Notifications**: Bell icon with unread count
- **Live Updates**: Reflect new reviews, trades, and system events
- **Mark as Read**: Batch notification management
- **Toast Alerts**: Subtle, non-intrusive notifications

---

## 📥 Installation & Setup

### Prerequisites
- Node.js 20+
- PostgreSQL 14+
- Redis 6+ (local or managed)
- Git

### Step 1: Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/mehediakash01/Knowledge-Trader.git
cd Knowledge-Trader

# Install backend dependencies
cd Knowledge-Trader-Backend
npm install
npm run build

# Install frontend dependencies (in a new terminal)
cd Knowledge-Trader-Frontend
npm install
```

### Step 2: Environment Setup

```bash
# Backend configuration
cd Knowledge-Trader-Backend
cp .env.example .env

# Edit .env with your values:
# - DATABASE_URL: PostgreSQL connection string
# - REDIS_URL: Redis connection string
# - GEMINI_API_KEY, GROQ_API_KEY, OPENROUTER_API_KEY
# - JWT secrets

# Frontend configuration
cd ../Knowledge-Trader-Frontend
cp .env.example .env.local

# Edit .env.local with:
# - NEXT_PUBLIC_API_URL: Backend URL (default: http://localhost:5000)
# - NEXT_PUBLIC_SOCKET_URL: Socket server URL (default: http://localhost:5001)
```

### Step 3: Database Setup

```bash
cd Knowledge-Trader-Backend

# Run migrations
npx prisma migrate dev

# Seed production data (18 high-quality skill posts, 20+ reviews)
npx prisma db seed
```

### Step 4: Start Development Servers

```bash
# Terminal 1: Backend
cd Knowledge-Trader-Backend
npm run dev
# Server runs on http://localhost:5000

# Terminal 2: Frontend
cd Knowledge-Trader-Frontend
npm run dev
# Application runs on http://localhost:3000
```

### Step 5: Verify Installation

Visit `http://localhost:3000` and:
- ✅ See the Bazaar with 18 seed posts
- ✅ Login with demo credentials (check seed file)
- ✅ Test purchasing a skill
- ✅ Leave a review and see AI insights update

---

## 🔑 Demo Credentials

After seeding, use these accounts:

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@knowledgetrader.com` | `admin123` |
| Teacher | `mentor@example.com` | `mentor123` |
| Learner | `john@example.com` | `secret123` |

---

## 🎬 Showcase Routes (30-Second Demo)

### Route 1: The Bazaar (60 seconds)
**URL**: `http://localhost:3000/bazaar`

1. Click "Filters" → Select "Backend Development"
2. Search "Go" → See 2 posts
3. Click a post → See AI Insights generating
4. Back to Bazaar → Change price range

**Shows**: URL sync, real-time filtering, responsive design

### Route 2: The Skill Vault (45 seconds)
**URL**: `http://localhost:3000/bazaar/{any-post-id}`

1. Scroll to "Locked Content" section → Shows detailed course outline
2. Scroll to "Leave a Review" → Star rating + AI-driven pros/cons summary
3. Check "AI Insights" block → See synthesized reviews

**Shows**: Content gating, review aggregation, AI brain working

### Route 3: AI Matchmaker (40 seconds)
**URL**: `http://localhost:3000/dashboard/matchmaker`

1. Click "Find My Matches" button
2. See rotating loading states ("Analyzing interests...", "Scanning market trends...")
3. View 4-5 skill recommendations with match scores
4. Click "View Vault" on any match

**Shows**: AI API integration, beautiful "thinking" UX, dynamic recommendations

### Bonus: Admin Dashboard (50 seconds)
**URL**: `http://localhost:3000/dashboard/admin` (login as admin first)

1. See Platform Overview stats (Total Users, Active Posts, Total Trades, KT in Circulation)
2. Scroll to "Transaction Volume" chart
3. Hover over data points → See tooltip with exact volume

**Shows**: Dynamic data visualization, responsive design, error boundaries

---

## 🏗️ System Design Highlights

### 1. Multi-Model AI Gateway (Resilient Architecture)
```typescript
Flow: Gemini (preferred) → Groq (fallback) → OpenRouter (fallback) → Mock (safe default)
Strategy: Timeout-based execution (30s), Structured output validation (Zod), JSON repair
Rate Limit: 20 requests/hour/user (Redis + in-memory fallback)
```

### 2. Atomic Trade Execution
```typescript
Single Prisma Transaction:
1. Debit learner tokens
2. Credit teacher tokens
3. Create Trade record
4. Create Transaction record
5. Update content access
6. Create notification
// All succeed or all rollback
```

### 3. Redis Caching Strategy
```
Cache Layers:
- Category feed (invalidated on post update)
- Home recommendations (invalidated on review/trade)
- AI rate limit counters (rolling window)
- Notification queue (pub/sub)

Fallback: In-memory Map if Redis unavailable
```

### 4. Security Layers
```
1. XSS Sanitizer Middleware: Recursively sanitizes POST/PATCH payloads
2. Helmet: HTTP security headers
3. JWT: Access + refresh token pattern
4. RBAC: USER, MANAGER, ADMIN roles
5. Content Gating: Only owner + buyer can see locked content
```

---

## 📊 Seed Data Quality

The production seed includes:

- **18 Skill Posts** across 6 categories:
  - Backend Development (5): Go, Rust, PostgreSQL, Kubernetes, Redis
  - AI & Machine Learning (4): Automation, Fine-tuning, RAG, Safety
  - Product & Design (4): Strategy, Design Systems, Research, CRO
  - Cloud & DevOps (3): Terraform, GitHub Actions, Observability
  - Blockchain & Web3 (2): Solidity, DeFi

- **20+ High-Quality Reviews** with:
  - Star ratings (4-5 stars weighted toward quality)
  - Authentic testimonials mentioning specific learnings
  - Triggers for AI Insights summarization
  - Spread across multiple posts for engagement

- **Pre-configured Users**:
  - 1 Admin account (dashboard access)
  - 3 Teacher accounts (course creators)
  - 2 Learner accounts (demo purchases)

---

## 🚀 Production Deployment

### Pre-Deployment Checklist

```bash
# 1. Build verification
npm run build  # Frontend
npm run build  # Backend

# 2. Environment secrets (never commit .env)
cat Knowledge-Trader-Backend/.env.example
cat Knowledge-Trader-Frontend/.env.example

# 3. Database backup
pg_dump knowledge_trader_prod > backup.sql

# 4. Redis persistence verification
redis-cli BGSAVE

# 5. Test AI endpoints with real keys
curl -X POST http://localhost:5000/api/v1/ai/generate-content \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Teach me about microservices"}'
```

### Deployment Recommendations

- **Frontend**: Vercel, Netlify (Next.js optimized)
- **Backend**: Railway, Render, AWS ECS
- **Database**: AWS RDS PostgreSQL, managed PostgreSQL
- **Redis**: Redis Cloud, AWS ElastiCache
- **Monitoring**: Sentry (errors), Datadog (logs)
- **CI/CD**: GitHub Actions (included)

---

## 📖 API Documentation

Full OpenAPI spec available at `/api/v1/docs` after starting backend.

### Key Endpoints

```
Authentication
  POST   /api/v1/auth/register
  POST   /api/v1/auth/login
  POST   /api/v1/auth/refresh

Skills
  GET    /api/v1/skill-posts              (filtered, paginated)
  POST   /api/v1/skill-posts              (create, requires auth)
  GET    /api/v1/skill-posts/{id}         (detail with AI insights)
  PATCH  /api/v1/skill-posts/{id}         (update, owner only)

Trades (Purchase Flow)
  POST   /api/v1/trades                   (initiate purchase)
  GET    /api/v1/trades/my-trades         (user's purchases/sales)
  GET    /api/v1/trades/{id}              (trade details)

Reviews
  POST   /api/v1/reviews                  (create review after purchase)
  GET    /api/v1/skill-posts/{id}/reviews (list reviews)

AI Features
  POST   /api/v1/ai/match                 (recommendations)
  POST   /api/v1/ai/generate-content      (course outline)
  POST   /api/v1/ai/summarize-reviews/{id} (pros/cons summary)

Analytics
  GET    /api/v1/analytics/admin-stats    (platform overview)
  GET    /api/v1/analytics/trades         (trade volume over time)

Notifications
  GET    /api/v1/notifications            (fetch unread)
  PATCH  /api/v1/notifications/mark-as-read (mark read)
```

---

## 🛠️ Development

### Local Development Tips

```bash
# Watch frontend changes
npm run dev

# Watch backend changes (auto-restart)
npm run dev

# Run backend tests
npm test

# Lint + format
npm run lint
npm run format

# Check TypeScript
npm run type-check
```

### Adding a New Feature

1. **Backend**: Create route → service → database migration
2. **Frontend**: Create component → wire Redux query → add to page
3. **Types**: Ensure alignment between backend types and frontend types
4. **Testing**: Write integration tests for APIs
5. **Seed**: Add sample data if applicable

---

## 🔒 Security Considerations

- Never commit `.env` files (use `.env.example`)
- Rotate JWT secrets in production
- Enable HTTPS in production
- Use strong database passwords
- Rate-limit public endpoints
- Keep dependencies updated (`npm audit fix`)
- Review AI prompts for injection risks
- Monitor for unusual trade patterns (fraud)

---

## 📈 Performance

- **Frontend Bundle**: ~450KB gzipped (optimized with dynamic imports)
- **API Response Time**: <200ms (cached queries)
- **AI Response Time**: <10s (with provider fallback)
- **Database Queries**: Indexed on high-cardinality fields (category, tokenPrice)

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| `REDIS_URL not connecting` | Verify Redis running: `redis-cli ping` |
| `DATABASE_URL error` | Check PostgreSQL connection string syntax |
| `AI endpoints timeout` | Verify API keys in .env, check network |
| `Socket.io not connecting` | Ensure backend Socket server running on port 5001 |
| `Build fails on Tailwind` | Run `npm install @tailwindcss/postcss@next` |
| `Seed script fails` | Drop database: `npx prisma migrate reset` |

---

## 📚 Learning Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Socket.io Docs](https://socket.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [Redis Patterns](https://redis.io/docs/manual/client-side-caching/)
- [OpenAPI Spec](https://swagger.io/specification/)

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License - see [LICENSE](LICENSE) file for details.

---

## 🎯 Roadmap

- [ ] Mobile app (React Native)
- [ ] Video course hosting
- [ ] Livestream teaching sessions
- [ ] Advanced analytics dashboard
- [ ] Blockchain-backed skill certificates
- [ ] Affiliate marketplace
- [ ] Content creation tools (MDX editor)
- [ ] Internationalization (i18n)

---

## 📞 Support

- 📧 Email: mehedi.akash.dev@gmail.com
- 💬 Discord: [Join Community](https://discord.gg/knowledgetrader)
- 🐛 Issues: [GitHub Issues](https://github.com/mehediakash01/Knowledge-Trader/issues)

---

## ✨ Special Thanks

Built with ❤️ by the Knowledge Trader team.

Inspired by the vision of democratizing expert knowledge through trustworthy, tokenized exchange.

---

**Ready to join the revolution?** 🚀

[Visit the Live App](https://knowledge-trader.com) | [View Documentation](https://docs.knowledge-trader.com) | [GitHub](https://github.com/mehediakash01/Knowledge-Trader)
