if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const path = require("path");
const cors = require("cors");
const { sequelize } = require("./models");

const authRoutes = require("./routes/authRoutes");
const propertyRoutes = require("./routes/propertyRoutes");
const landRoutes = require("./routes/landRoutes");
const numberRoutes = require("./routes/numberRoutes");
const contactRoutes = require("./routes/contactRoutes");
const sellEnquiryRoutes = require("./routes/sellEnquiry.routes");

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://shreesaikpd.com",
      "https://shreesaikpd.com",
      "https://www.shreesaikpd.com",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "Uploads")));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} ${JSON.stringify(req.body)}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/landproperties", landRoutes);
app.use("/api/numbers", numberRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/sell-enquiries", sellEnquiryRoutes);

app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.use((err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] Global error:`, err);
  res.status(500).json({ error: "Something went wrong", details: err.message });
});

const PORT = process.env.PORT || 4000;

sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Database connection established");
    return sequelize.sync({ alter: true });
  })
  .then(() => {
    console.log("✅ Database synced & models updated");
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to database or syncing:", err);
    if (err.original) {
      console.error("Original error:", err.original);
    }
    process.exit(1);
  });

if (process.env.NODE_ENV === "production") {
  const clientBuildPath = path.join(__dirname, "client/build");
  app.use(express.static(clientBuildPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}