const express = require("express");
const serverDebug = require("debug")("app:server");
const connectDB = require("./services/db");
const { appConfig } = require("./services/config");
const path = require("path");
// Connect db
appConfig();
connectDB();

const app = express();

// Middleware
app.use(express.json({ extended: false })); // body parser

// Define Routers
app.use("/api/users", require("./routes/api/users"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/posts", require("./routes/api/posts"));

// Serve static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(peth.resolve(__dirname, "client", "build", "index.html"));
  });
}

// running the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => serverDebug(`Server listening on port ${PORT}`));
