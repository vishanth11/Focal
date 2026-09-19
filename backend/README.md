# OMEN Backend

OMEN is a blockchain-backed trust API for verifying companies, issuing soulbound NFT badges, and helping students check whether job opportunities are genuine.

## Tech Stack

- Node.js and Express
- MongoDB Atlas with Mongoose
- ethers.js v6 for Polygon Mumbai contract calls
- JWT admin authentication
- express-validator request validation
- Morgan request logging

## Setup

```bash
cd backend
npm install
copy .env.example .env
npm run seed
npm run dev
```

Fill `.env` before running:

- `MONGODB_URI`: local MongoDB URI or a real MongoDB Atlas connection string
- `JWT_SECRET`: random secret for admin tokens
- `ADMIN_EMAIL` and `ADMIN_PASSWORD`: demo admin login
- `RPC_URL`, `CONTRACT_ADDRESS`, `ADMIN_PRIVATE_KEY`: blockchain integration
- `ML_API_URL`: scam detection service endpoint

For a local demo, install/start MongoDB and keep:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/omen
```

For Atlas, do not use the placeholder `cluster.mongodb.net`. Paste the exact URI from Atlas, which looks like:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.<cluster-id>.mongodb.net/omen?retryWrites=true&w=majority
```

## API

Base URL in development: `http://localhost:5000`

### Health

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | Server health check |

### Companies

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/companies/register` | Register a company for verification |
| GET | `/api/companies` | List companies |
| GET | `/api/companies/:id` | Get company details |
| GET | `/api/companies/check?domain=technova.com` | Check company by domain |
| GET | `/api/companies/status/:walletAddress` | Check company by wallet address |

### Admin

Use `Authorization: Bearer <token>` for protected admin routes.

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/admin/login` | Admin login |
| GET | `/api/admin/companies?status=pending` | List admin company queue |
| POST | `/api/admin/companies/:id/approve` | Run verification and mint NFT badge |
| POST | `/api/admin/companies/:id/reject` | Reject an application |
| POST | `/api/admin/companies/:id/revoke` | Revoke a badge |
| GET | `/api/admin/reports` | View reports |
| POST | `/api/admin/reports/:id/review` | Review report |
| GET | `/api/admin/stats` | Dashboard stats |

### Reports

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/reports` | Submit scam report |
| GET | `/api/reports/company/:companyId` | Get reports for a company |

### Checks

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/check` | Analyze a URL, email, or company name |
| GET | `/api/check/history` | Demo check history |

## Data Models

`Company` stores identity, domain, wallet, verification status, NFT token details, verification hash, and admin decision metadata.

`Report` stores student scam reports with reporter details, evidence, moderation status, and admin notes.

`Check` stores opportunity checks with input type, matched company, risk score, red flags, and final result.

## Blockchain Integration

The backend expects the deployed badge contract to expose:

```solidity
mintBadge(address companyAddress, string tokenURI) returns (uint256)
revokeBadge(uint256 tokenId)
updateBadgeURI(uint256 tokenId, string newURI)
hasValidBadge(address companyAddress) view returns (bool)
getBadgeId(address companyAddress) view returns (uint256)
tokenURI(uint256 tokenId) view returns (string)
```

Set `RPC_URL`, `CONTRACT_ADDRESS`, and `ADMIN_PRIVATE_KEY` in `.env`. Startup will warn, not crash, if blockchain config is incomplete, but admin approve/revoke actions require a working contract.

## ML Integration

`POST /api/check` calls `ML_API_URL` with:

```json
{
  "input": "https://example.com/job",
  "inputType": "url"
}
```

Expected response:

```json
{
  "riskScore": 72,
  "redFlags": ["Asks for registration fee"],
  "confidence": 0.89
}
```

If the ML API is offline, the backend uses a small local fallback so demos still work.

## Deployment

### Railway

1. Create a Railway service from the repository.
2. Set the service root to `backend`.
3. Add all `.env` variables in Railway.
4. Use `npm start` as the start command.

### Render

1. Create a Web Service.
2. Set root directory to `backend`.
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables.

## Frontend Notes

- Public routes return `{ success, data }`.
- Admin login returns `data.token`.
- Send admin token as `Authorization: Bearer <token>`.
- Company approval/revocation can fail if blockchain env or contract methods are not connected.

## Hackathon Demo Flow

1. `npm install`
2. Copy `.env.example` to `.env` and fill values.
3. `npm run seed` to load demo data.
4. `npm run dev` to start the server.
5. Login at `/api/admin/login`.
6. Test company checks from the React frontend or Postman.
