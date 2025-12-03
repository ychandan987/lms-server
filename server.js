import dotenv from "dotenv";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";



dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;

// increase limit to handle Base64 + JSON
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Allow requests from your React app
app.use(cors({
  origin: "http://localhost:5173", // Replace with your React dev server
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // if you send cookies/auth
}));

// * Middleware
app.use(express.json());
app.use(cookieParser()); // ✅ enable cookies
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  return res.send("Hi Everyone.");
});

// * Routes file
import routes from "./routes/index.js";
app.use(routes);


app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`));