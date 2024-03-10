import express from "express";
import { Server } from "socket.io";
import http from "http";

const app = express();

const server = new http.createServer(app);
const io = new Server(server);

io.on("connection", (socket) => {
  console.log(`User connected with Id: ${socket.id}`);
});

app.get("/", (req, res) => {
  res.json({ msg: "Hello World!" });
});

const port = 4000;

app.listen(port, () => {
  console.log("Server is listening on PORT ", port);
});
