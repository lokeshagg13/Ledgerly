# 🔁 Switching Between DEV and PROD for Cookie, Proxy, and CORS Handling

This guide documents the **exact changes** needed to switch your setup **back and forth** between **Development (local)** and **Production (deployed)** environments.

---

## ✅ Client-Side Configuration (React - Create React App)

### 📦 `package.json`

#### ✅ DEV Mode

```json
"proxy": "http://localhost:9000"
```

> This allows API requests like `/api/user/login` to be proxied to `localhost:9000` in development.

#### 🚫 PROD Mode

- ❌ **Remove** or comment the `proxy` field.
- ✅ Use **full backend URL** (e.g. `https://api.myapp.com`) in API calls.

---

### 📁 `axios.js` or API base URL setup

#### ✅ DEV Mode

```js
const backend = "/api";
```

#### ✅ PROD Mode

```js
const backend = "https://api.myapp.com"; // Replace with actual domain
```

> Make this switch dynamic using `.env` files:

```js
const backend = process.env.REACT_APP_API_URL;
```

---

### 📁 `.env` Files

#### ✅ `.env.development`

```env
REACT_APP_API_URL=/api
REACT_APP_ENV=DEV
```

#### ✅ `.env.production`

```env
REACT_APP_API_URL=https://api.myapp.com
REACT_APP_ENV=PROD
```

---

## ✅ Server-Side Configuration (Express Backend)

### ⚙️ `res.cookie` Setup (in authController, logoutController, etc.)

#### ✅ DEV Mode (local HTTP, no HTTPS)

```js
res.cookie("refreshToken", token, {
  httpOnly: true,
  secure: false,
  sameSite: "Lax",
});
```

#### ✅ PROD Mode (HTTPS with custom domain)

```js
res.cookie("refreshToken", token, {
  httpOnly: true,
  secure: true,
  sameSite: "None",
});
```

> 🔐 Safari blocks `SameSite=None` cookies without `Secure: true`.

---

### ⚙️ CORS Configuration

#### ✅ Example (inside Express app):

```js
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:9000",
  "http://192.168.1.11:3000",
  "http://192.168.1.11:9000",
  "https://your-production-domain.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
```

---

## 🔄 Switching Checklist

| Config Area     | DEV                                | PROD                                      |
| --------------- | ---------------------------------- | ----------------------------------------- |
| `proxy`         | `http://localhost:9000`            | ❌ Remove it                              |
| API base URL    | `/api`                             | Full URL (e.g. `https://api.example.com`) |
| Cookie settings | `secure: false`, `sameSite: "Lax"` | `secure: true`, `sameSite: "None"`        |
| Allowed origins | `localhost`, `192.168.x.x`         | Your production domain only               |
| HTTPS           | ❌ Not needed                      | ✅ Required for secure cookies            |

---

## 🧪 Testing Tips

- Always test from **mobile browser (Safari/Chrome)** using your **laptop's IP**.
- Check cookies in Safari Dev Tools: `Develop > [iPhone] > Inspect`
- Use `console.log(document.cookie)` in browser dev tools to confirm storage.
