import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/db.js";

// Import route modules
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import documentsRoutes from "./routes/documentsRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import mpesaRoutes from "./routes/mpesaRoutes.js";
import photoRoutes from "./routes/photoRoutes.js";
import quotationRoutes from "./routes/quotationRoutes.js";
import serviceRoutes from "./routes/serviceRoutes.js";
import serviceManagementRoutes from "./routes/serviceManagementRoutes.js";
import serviceImageRoutes from "./routes/serviceImageRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import timeRoutes from "./routes/timeRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";

dotenv.config();

const app = express();

// ✅ Enable CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:3000"],
    credentials: true,
  })
);

// ✅ Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

// ✅ Connect to MongoDB
connectDB();

// ✅ Mount Routes
app.use("/api/admin", adminRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/documents", documentsRoutes);
app.use("/api/employee", employeeRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/mpesa", mpesaRoutes);
app.use("/api/photos", photoRoutes);
app.use("/api/quotations", quotationRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/service-management", serviceManagementRoutes);
app.use("/api/service-images", serviceImageRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/time", timeRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vehicles", vehicleRoutes);

// ✅ Health check
app.get("/", (req, res) => res.send("🦏 Rhino Linings Backend is running!"));

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(500).json({ message: err.message || "Server error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
