import express from "express";
import cors from "cors";

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Simple test route
app.get("/", (req, res) => {
  res.json({ 
    message: "🦏 Rhino Linings Backend is running!",
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", service: "rhino-backend" });
});

// Test database connection (without actually connecting)
app.get("/test-db", (req, res) => {
  const mongoUri = process.env.MONGODB_URI ? "✅ MONGODB_URI is set" : "❌ MONGODB_URI is missing";
  res.json({ 
    database: mongoUri,
    message: "Database connection test"
  });
});

export default app;