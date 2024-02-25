const { createProxyMiddleware } = require("http-proxy-middleware");

const getRoutes = function () {
  const routes = new Map();
  routes.set("users", process.env.USERS_SERVICE_PORT);
  return routes;
};

const initRouteFunc = function (app) {
  const routes = getRoutes();

  routes.forEach((service_port, route) => {
    console.log(`/api/${route}`, `http://localhost:${service_port}/${route}`);
    app.use(
      `/api/${route}`,
      createProxyMiddleware({
        target: `http://localhost:${service_port}`,
        changeOrigin: true,
        secure: false,
        pathRewrite: function (path, req) {
          return path.replace(`/api/${route}`, ``);
        },
        onProxyReq: (proxyReq, req, res) => {
          if ((req.method === "POST" || req.method === "PUT") && req.body) {
            let body = req.body;
            let newBody = "";
            delete req.body;

            try {
              newBody = JSON.stringify(body);
              proxyReq.setHeader(
                "content-length",
                Buffer.byteLength(newBody, "utf8")
              );
              proxyReq.write(newBody);
              proxyReq.end();
            } catch (e) {
              console.log("Stringify err", e);
            }
          }
        },
      })
    );
  });
};

module.exports = {
  initRouteFunc: initRouteFunc,
  getRoutes: getRoutes,
};
