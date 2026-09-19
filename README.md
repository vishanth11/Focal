# FOCAL. — Complete Frontend & UI/UX

> **Trust Before You Connect.**  
> *A trusted digital layer between businesses.*

FOCAL. is a 24-hour hackathon project providing company verification, risk detection, typosquatting analysis, and trusted business connection mediation.

---

## 🎨 Visual Identity & Design System

Inspired by Canva editorial design elegance combined with modern trust & cybersecurity platform functionality.

- **Primary Colors**:
  - **Dusty Rose**: `#C9A3A6`
  - **Soft Blush**: `#E8D4D5`
  - **Warm Off-White**: `#F8F5F1`
  - **Light Blush**: `#F3E8E8`
  - **Charcoal**: `#242222`
  - **Deep Black**: `#151515`
  - **Muted Lavender**: `#DCD8E5`
- **Status Accents**:
  - **Verified**: `#3F8F68`
  - **Suspicious / Typosquatting**: `#C38A35`
  - **High Risk / Revoked**: `#B84C4C`
- **Typography**: DM Sans / Plus Jakarta Sans editorial hierarchy with large headlines, visible period in brand **FOCAL.**, rounded cards (`rounded-2xl`), thin borders, and soft editorial shadows.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Ensure the following keys are present:
```env
VITE_API_URL=http://localhost:5000/api
VITE_CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
VITE_RPC_URL=https://rpc-mumbai.maticvigil.com
```

### 3. Launch Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## 🛠️ Key Hackathon Demonstration Flows

### Flow 1: Company Search & Verification Scanner
1. Go to Home (`/`) or Search bar.
2. Enter `technova.com` or click the preset button.
3. Observe the `VerificationScanner` step-by-step progress animation.
4. View the **Digital Trust Report** with animated Trust Score Meter (94/100) and verified identity signals.

### Flow 2: Typosquatting & Lookalike Domain Detection
1. Search `micros0ft-support.com` or click the Typosquatting preset button.
2. Observe the **Typosquatting Risk Alert** module showing side-by-side comparison:
   - **Authentic Brand**: `microsoft.com`
   - **Deceptive Lookalike**: `micros0ft-support.com` (Character substitution `o` → `0`)
3. Click **Report This Fraudulent Domain** to auto-fill the scam report form.

### Flow 3: Trusted B2B Connection Protocol (`/connections`)
1. Navigate to **Connections** in top bar.
2. Inspect the **FOCAL. Intermediary Diagram** (`Company A ↓ FOCAL. Trust Layer ↓ Company B`).
3. Click **Request Trusted Connection** to establish a new verified business link.

### Flow 4: Blockchain Soulbound NFT Badge Audit
1. Open any verified profile (e.g. `/company/focal-c01`).
2. Click **Verify On Blockchain**.
3. View contract address, Polygon Mumbai testnet status, and token ID `#1042`.

### Flow 5: Governance Admin Panel (`/admin`)
1. Navigate to `/admin/login`.
2. Use demo credentials:
   - **Email**: `admin@focal.trust`
   - **Password**: `admin123`
3. Manage pending approvals, mint Soulbound badges, revoke flagged companies, and review user scam reports.

---

## 📁 Directory Structure

```
c:/Users/saira/Desktop/FOCAL/
├── src/
│   ├── main.jsx              # Entrypoint
│   ├── App.jsx               # Main Routing & Layout
│   ├── index.css             # Tailwind Directives & Custom Scrollbar
│   ├── components/
│   │   ├── Navbar.jsx        # Sticky Editorial Navigation
│   │   ├── Footer.jsx        # Footer
│   │   ├── SearchBar.jsx     # Search input with demo presets
│   │   ├── TrustScoreMeter.jsx # SVG Circular Trust Gauge
│   │   ├── VerificationBadge.jsx # Status Badges
│   │   ├── CompanyCard.jsx   # Company summary card
│   │   ├── DomainComparison.jsx # Typosquatting side-by-side detection
│   │   ├── NetworkVisual.jsx # Editorial B2B mediator diagram
│   │   ├── VerificationScanner.jsx # Scanner animation screen
│   │   ├── VerifyOnChainModal.jsx # Ethers.js Polygon NFT modal
│   │   ├── ConnectionCard.jsx # Trusted B2B connection card
│   │   └── LoadingSpinner.jsx # Loader
│   ├── pages/
│   │   ├── LandingPage.jsx   # Hero, stats, how it works, spotlight
│   │   ├── CheckResultPage.jsx # Digital Trust Report
│   │   ├── CompanySearchPage.jsx # Explore registry with filters
│   │   ├── CompanyProfilePage.jsx # Full corporate details & signals
│   │   ├── ConnectionPage.jsx # Trusted business connections
│   │   ├── ReportPage.jsx    # Scam reporting form
│   │   ├── AdminLoginPage.jsx # Governance desk authentication
│   │   ├── AdminDashboard.jsx # Pending approvals & report desk
│   │   └── NotFoundPage.jsx  # 404 handler
│   ├── context/
│   │   └── AppContext.jsx    # Global State
│   ├── services/
│   │   ├── api.js            # Axios client with JWT interceptor & demo fallback
│   │   └── blockchain.js     # Ethers v6 contract reader
│   ├── utils/
│   │   └── helpers.js        # Address truncation, domain similarity, score styling
│   └── data/
│       └── demoData.js       # Rich fictional enterprise dataset
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── package.json
```
