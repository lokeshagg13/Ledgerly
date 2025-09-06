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

## 🌍 Production Setup

On **Render** (or any cloud hosting):

1. Create a **Web Service** for the backend (`server.js`).

   - Set `Build Command`: `npm install`
   - Set `Start Command`: `node server.js`
   - Add environment variables from `.env`.

2. Create a **Static Site** for the frontend (`frontend`).

   - Set `Build Command`: `npm run build`
   - Publish directory: `build/`
   - Set `REACT_APP_API_URL=https://your-backend.onrender.com/api` in Render environment variables.
   - Update `axios.js` in frontend to use:

     ```js
     const BASE_URL =
       process.env.REACT_APP_API_URL || "http://localhost:9000/api";
     ```

3. Remove or adjust `"proxy"` in `frontend/package.json` for production.

4. Commit and push changes. Render will auto-deploy.

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