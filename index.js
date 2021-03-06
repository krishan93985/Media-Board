// npm install express
const express = require("express");
const app = express();
// server
// const httpServer = require("http").createServer(app);
// const socketServer = require("socket.io")(httpServer);
// const path = require("path");
// /client
app.use(express.static(__dirname + "/activity"));
const PORT = process.env.PORT || 3000;

app.get("/",(req,res) => {
    res.status(200).send("index.html");
})
// socketServer.on("connection", function (socket) {
//     console.log("New client connected")
//     console.log(socket.id);
//     // listener=> recieve
//     socket.on("colorChange", function (color) {
//         console.log(color);
//         socket.broadcast.emit('rColorChange', color);
//     })
//     socket.on("md", function (point) {
//         console.log(point);
//         socket.broadcast.emit('onmd', point);
//     })
//     socket.on("mm", function (point) {
//         console.log(point);
//         socket.broadcast.emit('onmm', point);
//     })
// })
//  tcp => uniquely identify server on a machine
app.listen(PORT, function () {
    console.log(`Server is listening to request at port ${PORT}`);
})


