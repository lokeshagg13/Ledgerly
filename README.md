# Ledgerly

Ledgerly is a full-stack accounting and transaction management application built with **Node.js + Express + MongoDB** (backend) and **React.js** (frontend).

It provides **two modes of login**:

- **Individual Mode** 🧑

  - Setup opening balance.
  - Track transactions of your bank account.
  - Categorize and subcategorize transactions.
  - Upload and extract transactions.
  - View detailed and customizable dashboards with charts and analysis.

- **Firm Mode** 🏢

  - Setup opening balance for the firm.
  - Manage **Heads** (like categories).
  - Add **Entry Sets** to group transactions made with heads in a day.
  - Manage balance summary of all heads.
  - Get business-level dashboards and analysis.

---

## 🚀 Features

- User authentication with JWT-based sessions.
- Separate workflows for Individuals and Firms.
- Transaction and head/category management.
- Upload bulk transactions and heads via CSV/PDF parsing.
- Advanced dashboards (charts, summaries, customizable filters).
- Export and print transaction reports.
- Mobile-responsive React frontend.

---

## 🛠 Tech Stack

- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Frontend**: React.js, React Router DOM, Bootstrap, MUI, Recharts, Axios
- **Authentication**: JWT, Cookies
- **File Uploads**: Multer
- **Other Utilities**: PDFReader, XLSX, jsPDF

---

## 📂 Project Structure

```
LEDGERLY/
│── config/                # CORS, token, allowed origins setup
│── controllers/           # Route controllers
│── dbScripts/             # DB migration scripts
│── middlewares/           # Custom middlewares (auth, logger, error handling)
│── models/                # Mongoose models
│── routes/                # Express routes
│── uploads/               # Uploaded files (gitignored)
│── frontend/              # React frontend app
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page-level components
│   │   ├── store/         # Context API + hooks
│   │   ├── utils/         # Utility functions
│   │   ├── images/        # Static images
│   │   └── index.jsx
│   └── package.json
│── server.js              # Express entry point
│── package.json           # Backend package.json
│── .env                   # Environment variables (not committed)
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the project root (`/LEDGERLY`).

Example:

```env
# General
NODE_ENV=development
PORT=9000

# Database
MONGO_URI=mongodb+srv://<user>:<password>@cluster-url/ledgerly

# JWT
ACCESS_TOKEN_SECRET=your_access_token_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret

# CORS
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

---

## 🖥 Development Setup

### Backend

```bash
cd LEDGERLY
npm install
npm run dev   # starts backend with nodemon
```

### Frontend

```bash
cd LEDGERLY/frontend
npm install
npm start     # runs React frontend on http://localhost:3000
```

The frontend **proxy** is set in `frontend/package.json` to forward API requests to backend (`http://localhost:9000`).

---

## 🚀 Deployment Instructions

### 🔹 Backend (Render)

- Backend is deployed on **Render** under the account: `lokesh.ujjawalfc@gmail.com`.
- The Render service is already connected to the GitHub repo of the backend.
- To deploy changes:

  1. Commit and push your code to GitHub.
  2. Go to the Render dashboard → your backend service.
  3. Click **Manual Deploy → Deploy latest commit**.

- Render will pull the latest code from GitHub and redeploy the backend automatically.

---

### 🔹 Frontend (Render)

- Frontend is also deployed on **Render** under the same web service as backend in the account: `lokesh.ujjawalfc@gmail.com`.
- To deploy changes:

  1. Commit and push your code to GitHub.
  2. In `frontend/` directory, run:

     ```bash
     npm run build
     ```

  3. Commit and push your code to GitHub.
  4. Go to the Render dashboard → your backend service.
  5. Click **Manual Deploy → Deploy latest commit**.

---

✅ With this setup:

- **Backend changes** → push to GitHub + manual deploy on Render.
- **Frontend changes** → push to GitHub + run `npm run build` + manual deploy on Render.

---

## 📸 Assets

All static images are stored in:
`/frontend/src/images/`

React will handle them automatically when importing (e.g., `import logo from './images/logo.png'`).

No path changes are needed unless you directly reference `/public/`.

---

## 🧪 Running Modes

- **Development**:

  ```
  NODE_ENV=development
  ```

  Uses `localhost` URLs and proxy.

- **Production**:

  ```
  NODE_ENV=production
  ```

  Uses Render deployment URLs and env variables.

Switching environments only requires changing `NODE_ENV` and relevant `.env` vars.

---

## 📊 Dashboards

- **Individual Dashboard**:

  - Daily balance chart
  - Monthly spending analysis
  - Spending categories pie chart
  - Overall balance card

- **Firm Dashboard**:

  - Head-wise balance summary
  - Entry set tracking
  - Overall financial analysis

---

## ✅ Future Improvements

- Multi-user firms with role-based access.
- Bank API integration for auto-sync transactions.
- Mobile app version (React Native).
