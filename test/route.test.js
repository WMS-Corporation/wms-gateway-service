// FILEPATH: /c:/Users/Michele Studio/source/repos/PSE-Project/WCs/wms-gateway-service/test/route.test.js

const express = require("express");
const request = require("supertest");
const nock = require("nock");
const dotenv = require("dotenv");
const { initRouteFunc, getRoutes } = require("../src/routes/route");

describe("initRouteFunc", () => {
  let app;

  beforeEach(() => {
    dotenv.config();
    app = express();
    app.use(express.json());
    initRouteFunc(app);
  });

  test("should set up routes correctly", () => {
    const routes = getRoutes();
    routes.forEach(async (service_port, route) => {
      const url = `http://localhost:${service_port}`;
      nock(url).get("/").reply(200);

      const response = await request(app).get(`/api/${route}`);
      expect(response.status).toBe(200);
    });
  });

  test("should proxy POST requests with body", (done) => {

    const body = { key: "value" };
    const routes = getRoutes();
    routes.forEach((service_port, route) => {
      const url = `http://localhost:${service_port}`;
  
      nock(url).post("/", body).reply(200);
  
      request(app).post(`/api/${route}`).send(body).expect(200, done);

      return true; 
    });
  });

  test("should proxy PUT requests with body", (done) => {
    
    const body = { key: "value" };
    const routes = getRoutes();
    routes.forEach((service_port, route) => {
      const url = `http://localhost:${service_port}`;

      nock(url).put("/", body).reply(200);

      request(app).put(`/api/${route}`).send(body).expect(200, done);

      return true; 
    });
  });
});
