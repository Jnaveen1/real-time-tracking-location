// const express = require("express") 

// const app = express() 

// const http = require("http") ;
// const path = require("path");
// const socketio = require("socket.io") ;

// const server = http.createServer(app) ;
// const io = socketio(server) ;

// io.on("connection" , function(socket){
//     socket.on("send-location", function(data){
//         io.emit("receive-location", {id:socket.id, ...data}) ;
//     });

//     socket.on("disconnect", function(){
//         io.emit("user-disconnected", socket.id) ;
//     }) ;

//     console.log("connected") ;
// })



// app.set("view engine", "ejs") ;
// app.use(express.static(path.join(__dirname, "public"))) ;

// app.get("/" , (req, res)=>{
//     res.render("index") 
// })



// server.listen(3000, ()=>{
//     console.log("Server is running...") 
// })

const express = require("express");
const app = express();
const http = require("http");
const path = require("path");
const socketio = require("socket.io");

const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.redirect(`/track-naveen-location/${Math.random().toString(36).substring(2, 8)}`);
});

app.get("/track/:roomId", (req, res) => {
  res.render("index", { roomId: req.params.roomId });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
    socket.roomId = roomId;
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });

  socket.on("send-location", ({ roomId, latitude, longitude }) => {
    io.to(roomId).emit("receive-location", { id: socket.id, latitude, longitude });
  });

  socket.on("disconnect", () => {
    if (socket.roomId) {
      io.to(socket.roomId).emit("user-disconnected", socket.id);
    }
  });
});

server.listen(process.env.PORT || 3000, '0.0.0.0', () => {
  console.log("Server running");
});

