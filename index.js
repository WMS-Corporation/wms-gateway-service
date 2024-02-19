const express = require('express');
const cors= require('cors');

const router = require('./src/routes/route');

/*
* Allow access from any subroute of http://localhost:3000
* */
let corsOptions = {
  origin: /http:\/\/localhost:3000\/.*/
};


const app = express();
app.use(cors(corsOptions));

app.use(router);

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});

module.exports = { app };