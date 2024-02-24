const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const initRouteFunc = require("./src/routes/route");

dotenv.config();

const gatewayPort = process.env.PORT || 3000;

/*
 * Allow access from any subroute of http://localhost:<gatewayPort>
 */
let corsOptions = {
  origin: new RegExp(`http:\/\/localhost:${gatewayPort}\/.*`),
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

initRouteFunc(app);

app.listen(gatewayPort, () => {
  console.log(`Server listening on port ${gatewayPort}`);
});

module.exports = { app };
