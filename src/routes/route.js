const { createProxyMiddleware } = require("http-proxy-middleware");

// Get routes
const getRoutes = function () {
  const routes = new Map();
  const routesString = process.env.NAME_AND_PORT_SERVICES_LIST;
  const routesArray = routesString.split(';');

  routesArray.forEach((route) => {
    const [name, service_url] = route.split(',');
    routes.set(name, service_url);
  });
  return routes;
};

// Init routes
const initRouteFunc = function (app) {
  const routes = getRoutes();

  routes.forEach((service_url, route) => {
    console.log(`/api/${route}`, `${service_url}/${route}`);
    app.use(
      `/api/${route}`,
      createProxyMiddleware({
        target: service_url,
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
