const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const socketio = require('socket.io');

const { initRouteFunc } = require("./src/routes/route");

dotenv.config();
const gatewayPort = process.env.PORT || 3000;

/*
 * Allow access from any subroute of http://localhost:<gatewayPort>
 */
let corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [`http://wms-gateway:${gatewayPort}`,];
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith('http://localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

initRouteFunc(app);

var server = app.listen(gatewayPort, () => {
  console.log(`Server listening on port ${gatewayPort}`);
});

const io = socketio(server, {
  cors: {
    origin: corsOptions.origin, 
    methods: ["GET", "POST"], 
    allowedHeaders: ["my-custom-header"], 
    credentials: true,
  }
});

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

module.exports = { app, server };
