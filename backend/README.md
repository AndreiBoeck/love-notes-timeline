# Love Notes Timeline Backend

Serverless backend for the Love Notes Timeline frontend. It provides authenticated APIs for creating, listing, retrieving, and deleting memories, plus S3 presigned uploads. Cognito JWTs are expected in the `Authorization: Bearer <token>` header.

## API Overview

- `POST /files/presign` – Generate a presigned S3 URL for uploads. Body: `{ "filename": string, "contentType": string }`. Returns `{ uploadUrl, fileKey }`.
- `POST /memories` – Persist a memory after uploading the file. Body: `{ fileKey, memoryDate, title, description?, contentType? }`. Returns the created memory with `memoryDate` preserved and `fileUrl` for display.
- `GET /memories` – List all memories for the authenticated user, sorted by `memoryDate` (desc). Returns an array of memory objects with `fileUrl`.
- `GET /memories/{id}` – Fetch a single memory for the user.
- `DELETE /memories/{id}` – Remove a memory and its file from S3.

## Data Model

Memories are stored in DynamoDB with partition key `userId` and sort key `id` and include:
`id`, `userId`, `fileKey`, `createdAt`, `memoryDate` (the user-selected date), `title`, optional `description` and `contentType`.

## Deploying

1. Set environment variables for Cognito JWT authorizer:
   - `COGNITO_ISSUER` – Cognito User Pool issuer URL (e.g. `https://cognito-idp.<region>.amazonaws.com/<poolId>`)
   - `COGNITO_AUDIENCE` – User Pool client ID expected in the token `aud` claim
   - Optional overrides: `BUCKET_NAME`, `MEMORIES_TABLE`, `AWS_REGION`, `STAGE`
2. Install dependencies and deploy:

```bash
cd backend
npm install
npm run deploy
```

Serverless will create the DynamoDB table, S3 bucket (with CORS for PUT/GET/HEAD), and HTTP API routes secured by the configured JWT authorizer.
