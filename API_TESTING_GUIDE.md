# Knowledge Trader Postman Testing Guide

Use this guide to test the API in Postman after you have already verified registration, login, skill post creation, list, single fetch, and update.

## Base URL

`http://localhost:5000/api/v1`

## Postman Setup

Create a Postman environment with these variables:

- `baseUrl` = `http://localhost:5000`
- `apiVersion` = `/api/v1`
- `accessToken` = your login token
- `skillPostId` = the id returned from create or single-get
- `buyerToken` = token of the user who will buy the post
- `creatorToken` = token of the user who created the post

## What Is New

The new public API features are:

- `POST /trades/token-trade` to purchase a skill post with tokens
- `GET /trades/my-trades` to inspect your trade history

There is also an internal notification created automatically after a successful trade, but there is no public notification endpoint yet.

---

## Existing Endpoints You Already Tested

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/users/register` | No | Register user |
| POST | `/auth/login` | No | Login user |
| GET | `/skill-posts` | No | Get all skill posts |
| GET | `/skill-posts/:id` | Optional | Get single skill post |
| POST | `/skill-posts` | Yes | Create skill post |
| PATCH | `/skill-posts/:id` | Yes | Update skill post |

---

## New Endpoint 1: Buy Skill Post With Tokens

### Endpoint
- **Method:** `POST`
- **URL:** `/trades/token-trade`
- **Auth:** Required
- **Role:** `USER`

### Purpose
This endpoint lets a learner buy a skill post. When the purchase succeeds, the API:

- creates a trade record
- debits the learner token balance
- credits the creator token balance
- creates a transaction record
- creates a notification for the creator

### Important Rules
- You cannot buy your own skill post
- You cannot buy the same skill post twice after a completed trade
- The buyer must have enough tokens
- The skill post must exist

### Headers
```http
Content-Type: application/json
Authorization: Bearer <buyer_access_token>
```

### Request Body
```json
{
  "postId": "skill-post-id"
}
```

### Validation
- `postId` must be a UUID

### Example Body
```json
{
  "postId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### cURL Example
```bash
curl -X POST http://localhost:5000/api/v1/trades/token-trade \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <buyer_access_token>" \
  -d '{
    "postId": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

### Expected Success Response
- **Status:** `201 Created`
- The response includes the created trade, transaction, and notification objects.

Example shape:
```json
{
  "success": true,
  "statusCode": 201,
  "message": "Token trade completed successfully",
  "data": {
    "trade": {
      "id": "trade-id",
      "postId": "skill-post-id",
      "learnerId": "buyer-id",
      "teacherId": "creator-id",
      "status": "COMPLETED"
    },
    "transaction": {
      "id": "transaction-id",
      "userId": "buyer-id",
      "tradeId": "trade-id",
      "amount": 10,
      "type": "DEBIT"
    },
    "notification": {
      "id": "notification-id",
      "userId": "creator-id",
      "title": "New token trade completed",
      "message": "Buyer Name purchased \"Skill Title\" for 10 tokens.",
      "isRead": false
    }
  }
}
```

### Common Error Cases
- `400 Bad Request` if you try to buy your own post
- `400 Bad Request` if token balance is too low
- `404 Not Found` if the post does not exist
- `409 Conflict` if the post was already purchased by that learner
- `401 Unauthorized` if token is missing or invalid

### Important Testing Note
The default user token balance is `10`. If your post price is higher than `10`, the purchase will fail unless you manually increase the buyer balance in the database or use a lower token price for testing.

---

## New Endpoint 2: My Trades

### Endpoint
- **Method:** `GET`
- **URL:** `/trades/my-trades`
- **Auth:** Required
- **Role:** `USER`

### Purpose
This endpoint returns:

- trades where you are the learner
- trades where you are the teacher

### Headers
```http
Authorization: Bearer <user_access_token>
```

### cURL Example
```bash
curl http://localhost:5000/api/v1/trades/my-trades \
  -H "Authorization: Bearer <user_access_token>"
```

### Expected Success Response
- **Status:** `200 OK`
- The response contains two arrays: `learningTrades` and `teachingTrades`.

Example shape:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "My trades retrieved successfully",
  "data": {
    "learningTrades": [
      {
        "id": "trade-id",
        "status": "COMPLETED",
        "post": {
          "id": "skill-post-id",
          "title": "Advanced TypeScript",
          "slug": "advanced-typescript",
          "tokenPrice": 10
        },
        "teacher": {
          "id": "creator-id",
          "name": "Creator Name",
          "email": "creator@example.com"
        },
        "transaction": {
          "id": "transaction-id",
          "amount": 10,
          "type": "DEBIT"
        }
      }
    ],
    "teachingTrades": [
      {
        "id": "trade-id",
        "status": "COMPLETED",
        "post": {
          "id": "skill-post-id",
          "title": "Advanced TypeScript",
          "slug": "advanced-typescript",
          "tokenPrice": 10
        },
        "learner": {
          "id": "buyer-id",
          "name": "Buyer Name",
          "email": "buyer@example.com"
        },
        "transaction": {
          "id": "transaction-id",
          "amount": 10,
          "type": "DEBIT"
        }
      }
    ]
  }
}
```

### Common Error Cases
- `401 Unauthorized` if token is missing or invalid
- `403 Forbidden` if the token is not a `USER` role

---

## Notification Testing

There is no public notification endpoint yet.

Notifications are created automatically when a trade succeeds. To verify them, check the database after a successful token trade.

### What to Expect
- A new `Notification` row is created for the skill post creator
- `isRead` defaults to `false`
- The message includes the buyer name, skill post title, and token amount

### How to Verify
1. Complete a token trade.
2. Open Prisma Studio or inspect the `Notification` table directly.
3. Confirm a new record exists for the creator.

### Prisma Studio
If you use Prisma Studio, open your project database and check the `Notification` model after the trade.

---

## Recommended Postman Test Order

1. Register two users: one creator and one buyer.
2. Login both users and save both tokens.
3. Login as the creator and create a skill post with a low price for testing, such as `10`.
4. Login as the buyer and call `POST /trades/token-trade` with the `postId`.
5. Call `GET /trades/my-trades` with the buyer token.
6. Call `GET /trades/my-trades` with the creator token.
7. Check the `Notification` table in the database.

---

## Postman Body Examples

### Register User
```json
{
  "name": "Buyer One",
  "email": "buyer1@example.com",
  "password": "password123"
}
```

### Login User
```json
{
  "email": "buyer1@example.com",
  "password": "password123"
}
```

### Create Skill Post
```json
{
  "title": "Advanced TypeScript",
  "slug": "advanced-typescript",
  "category": "Web Development",
  "tags": ["typescript", "advanced"],
  "shortDescription": "Master advanced TS concepts",
  "longDescription": "This guide covers advanced TypeScript topics.",
  "previewContent": {
    "section1": "Intro"
  },
  "lockedContent": {
    "premium": "Locked premium content"
  },
  "tokenPrice": 10,
  "images": []
}
```

### Buy Skill Post
```json
{
  "postId": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## Postman Headers Checklist

- Use `Content-Type: application/json` for POST and PATCH requests
- Add `Authorization: Bearer <token>` for protected routes
- Use the buyer token for `POST /trades/token-trade`
- Use either user token for `GET /trades/my-trades`

---

## Quick Troubleshooting

- If trade fails with insufficient balance, lower the post price or increase the buyer balance in the database.
- If trade fails with forbidden, you may be using the creator token to buy your own post.
- If notification does not appear, confirm the trade completed successfully first.
- If `postId` is invalid, make sure you copied the skill post UUID exactly.
