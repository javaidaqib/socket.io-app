import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";

const app = express();

const server = new http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`User connected with Id: ${socket.id}`);
  socket.broadcast.emit("welcome", `${socket.id} joined the chat`);

  socket.on("disconnect", () => {
    console.log(`User DISCONNECTED: ${socket.id}`);
  });

  socket.on("message", ({ message, room, socketId }) => {
    console.log("message be : ", { message, room, socketId });
    if (room) {
      io.to(room).emit("emit-msg", { message, room, socketId });
    } else {
      socket.broadcast.emit("emit-msg", { message, room, socketId });
    }
  });
});

app.use(cors());

app.get("/", (req, res) => {
  res.json({ msg: "Hello World!" });
});

const port = 4000;

server.listen(port, () => {
  console.log("Server is listening on PORT ", port);
});
