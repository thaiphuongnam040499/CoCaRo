const jsonServer = require("json-server");
const auth = require("json-server-auth");
const express = require("express");
const cors = require("cors");

const app = express();

// Cho phép tất cả các nguồn (cần thiết cho việc phát triển)
app.use(cors());

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

// Set default middlewares (logger, static, cors and no-cache)
server.db = router.db;
server.use(cors());
server.use(auth);
server.use(middlewares);

// Add custom routes before JSON Server router
server.get("/echo", (req, res) => {
  res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

server.use((req, res, next) => {
  if (req.method === "POST") {
    req.body.createdAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});

// Use default router
server.use("/api", router);
server.listen(8080, () => {
  console.log("JSON Server is running");
});
