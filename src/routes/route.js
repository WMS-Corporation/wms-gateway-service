const { createProxyMiddleware } = require("http-proxy-middleware");

// Get routes
const getRoutes = function () {
  const routes = new Map();
  const routesString = process.env.NAME_AND_PORT_SERVICES_LIST;
  const routesArray = routesString.split(',');

  routesArray.forEach((route) => {
    const [name, port] = route.split(':');
    routes.set(name, port);
  });
  return routes;
};

// Init routes
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
