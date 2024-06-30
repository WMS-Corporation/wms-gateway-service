const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { initRouteFunc } = require("./src/routes/route");

const socketio = require('socket.io');

dotenv.config();
const gatewayPort = process.env.PORT || 3000;

// Configurazione CORS
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
// Creazione del server HTTP da 'app' di Express
var server = http.createServer(app);

// Inizializzazione di Socket.IO con il server HTTP
const io = socketio(server, {
  cors: {
    origin: corsOptions.origin,
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  }
});

// Endpoint per ricevere alert di temperatura dai microservizi
io.on('connection', (socket) => {
  console.log('New connection:', socket.id);

  socket.on('temperature-alert', (data) => {
    console.log('Temperature alert received:', data);
    io.emit('temperature-alert', data);
  });
  socket.on('lowStockAlert', (data) => {
    console.log('Low stock alert:', data);
    io.emit('lowStockAlert', data);
  });
});

server.listen(gatewayPort, () => {
  console.log(`Server listening on port ${gatewayPort}`);
});

module.exports = { app, server };