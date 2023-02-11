const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

const { PORT, HOST_URI } = process.env;

const db = require("./services/message");

const http = require("http").Server(app);

mongoose.connect(HOST_URI, () => {
  console.log("Connected to database");
});

// const socket = require("socket.io")(http, {
//   cors: {
//     origin: "http://localhost:8080",
//   },
// });

const socket = require("socket.io")(http, {
  cors: {
    origin: "https://sockets-client.onrender.com",
  },
});

global.usersOnline = new Map();

socket.on("connection", async (client) => {
  client.emit("changedOnline", usersOnline.size);

  // Adding new user to chat when user entered name
  client.on("addUser", async (name) => {
    usersOnline.set(client.id, name);

    client.emit("changedOnline", usersOnline.size);
    client.broadcast.emit("changedOnline", usersOnline.size);

    const messages = await db.findAllMessages();
    client.emit("fetchedMessages", messages);
  });

  // Adding new message from user
  client.on("addMessage", async (message) => {
    const result = await db.createMessage(message);

    client.emit("changedMessages", result);
    client.broadcast.emit("changedMessages", result);
  });

  // Deleting user from chat
  client.on("disconnect", () => {
    usersOnline.delete(client.id);

    client.broadcast.emit("changedOnline", usersOnline.size);
  });
});

http.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
