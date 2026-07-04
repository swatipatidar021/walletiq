# WalletIQ 💰

WalletIQ is a simple, smart personal finance tracker that helps you manage your income, expenses, and monthly budget — all in one clean dashboard.

## Features
- **Secure Authentication** — sign up and sign in with hashed passwords (bcrypt); no plain-text passwords ever stored or exposed
- **Income & Expense Tracking** — log your earnings and spending by category (Food, Rent, Water, Electricity, Clothing, Entertainment)
- **Delete Entries** — remove any income or expense entry with a single click (with confirmation)
- **Budget Goals** — set a monthly budget and track how much of it you've used
- **Visual Breakdown** — see your expenses as a chart (powered by Chart.js)
- **Last Expense & Recent Activity** — sidebar widgets showing your most recent expense and latest transactions (visible on wider screens)
- **Toast Notifications** — clean in-app success/error messages instead of browser alerts
- **Responsive Dark UI** — mobile-first design that expands into a two-column layout on larger screens

## Tech Stack
**Frontend**
- HTML, CSS, JavaScript (vanilla)
- Chart.js for data visualization
- `live-server` for local development (no editor extension needed)

**Backend**
- Node.js + Express
- MongoDB with Mongoose
- bcryptjs for password hashing

## Project Structure
```
proj2-main/
├── package.json     # Root script to run backend + frontend together
├── frontend/         # HTML pages, styles, scripts, svg icons
│   └── src/           # home.html, info.html, signin.html, signup.html
├── backend/          # Express API, MongoDB models & routes
│   └── .env           # MongoDB connection string (not committed)
└── design/           # Design references and icons
```

## Getting Started

### 1. Clone the repository
```bash
git clone <repo-url>
cd proj2-main
```

### 2. Set up environment variables
Create a `.env` file inside the `backend/` folder with your MongoDB connection string:
```
DATABASE_CONNECT=your_mongodb_connection_string
```

### 3. Install dependencies
From the **root** `proj2-main` folder:
```bash
npm install
npm run install:all
```
This installs the root tooling (`concurrently`) and the dependencies for both `backend` and `frontend`.

### 4. Run the app
From the root `proj2-main` folder:
```bash
npm start
```
This runs the backend and frontend **together** in one command:
- Backend API → `http://localhost:5000`
- Frontend (auto-opens in your browser) → `http://localhost:5500/frontend/src/home.html`

No need for VS Code's Live Server extension — everything runs via npm.

### Running them separately (optional)
```bash
npm run start:backend   # backend only, on port 5000
npm run start:frontend  # frontend only, on port 5500
```

## Security Notes
- Passwords are hashed with `bcryptjs` before being stored — never saved or returned in plain text
- Login is verified entirely on the server; the client never receives other users' data
- Duplicate email signups are blocked

## License
This project is licensed under the **MIT License**.
