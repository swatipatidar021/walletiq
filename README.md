# WalletIQ 💰

WalletIQ is a simple, smart personal finance tracker that helps you manage your income, expenses, and monthly budget — all in one clean dashboard.

## Features
- **Income & Expense Tracking** — log your earnings and spending by category (Food, Rent, Water, Electricity, Clothing, Entertainment)
- **Budget Goals** — set a monthly budget and track how much of it you've used
- **Visual Breakdown** — see your expenses as a chart (powered by Chart.js)
- **Authentication** — sign up and sign in to keep your data tied to your account

## Tech Stack
**Frontend**
- HTML, CSS, JavaScript (vanilla)
- Chart.js for data visualization

**Backend**
- Node.js + Express
- MongoDB with Mongoose

## Project Structure
```
proj2-main/
├── frontend/       # HTML pages, styles, scripts, svg icons
├── backend/        # Express API, MongoDB models & routes
└── design/         # Design references and icons
```

## Getting Started

### 1. Clone the repository
```bash
git clone <repo-url>
cd proj2-main
```

### 2. Install dependencies
```bash
cd backend
npm install
```

### 3. Set up environment variables
Create a `.env` file inside the `backend/` folder with your MongoDB connection string:
```
DATABASE_CONNECT=your_mongodb_connection_string
```

### 4. Run the backend
```bash
npm start
```
The server will run at `http://localhost:5000`.

### 5. Run the frontend
Open `frontend/src/home.html` with a live server (e.g. VS Code's "Live Server" extension) to view the app in your browser.

## License
This project is licensed under the **MIT License**.
