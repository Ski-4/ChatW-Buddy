const { time } = require("console");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const port = process.env.PORT || 3000;
const io = new Server(server);

app.use(express.static("public"));

let id = 1;
let prevId = -1;

let idList = {};

io.on("connection", (socket) => {
    console.log("a user connected");
    console.log("Client Id: ", socket.id);
    console.log("User Id: ", id);
    idList[socket.id] = id;
    id++;

    io.emit("update", `user ${idList[socket.id]} : Connected`);

    socket.on("typing", (data) => {
        console.log("typing");
        res = { typing: true, id: socket.id, tag: idList[socket.id] };
        if (data === "") res.typing = false;
        io.emit("typing", res);
    });

    socket.on("chat message", (msg) => {
        let currTime = new Date();
        console.log("message: " + msg);
        res = {
            msg,
            id: socket.id,
            tag: idList[socket.id],
            prevId,
            currTime,
        };
        prevId = socket.id;
        io.emit("chat message1", res);
    });

    socket.on("disconnect", () => {
        io.emit("update", `user ${idList[socket.id]} : Disconnected`);
        console.log("user disconnected");
    });
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

server.listen(port, () => {
    console.log("listening on *:3000");
});
