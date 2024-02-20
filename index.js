const express = require('express');
const cors= require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

/*
* Allow access from any subroute of http://localhost:3000
* */
let corsOptions = {
  origin: /http:\/\/localhost:3000\/.*/
};
const port = process.env.PORT;

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

const routes = new Map();
routes.set("users", process.env.USERS_SERVICE);

routes.forEach((service_port, route) => {
    console.log(`/api/${route}`, `http://localhost:${service_port}`);
    app.use(
      `/api/${route}`,
      createProxyMiddleware({
        target: `http://localhost:${service_port}`,
        changeOrigin: true,
        secure: false,
        pathRewrite: function (path, req) { return path.replace(`/api/${route}`, ''); },
        onProxyReq: (proxyReq, req, res) => {
          if ((req.method === "POST" || req.method === "PUT") && req.body) {
            let body = req.body;
            let newBody = '';
            delete req.body;
  
            try {
              newBody = JSON.stringify(body);
              proxyReq.setHeader('content-length', Buffer.byteLength(newBody, 'utf8'));
              proxyReq.write(newBody);
              proxyReq.end();
            } catch (e) {
              console.log('Stringify err', e);
            }
          } 
        },
      })
    );
  });


app.listen(port, () => {
  console.log('Server listening on port &{port}');
});

module.exports = { app };