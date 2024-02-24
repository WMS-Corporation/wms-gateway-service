// FILEPATH: /c:/Users/Michele Studio/source/repos/PSE-Project/WCs/wms-gateway-service/test/route.test.js

const express = require('express');
const request = require('supertest');
const nock = require('nock');
const dotenv = require("dotenv");
const {initRouteFunc, getRoutes} = require("../src/routes/route");

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
    routes.forEach((service_port, route) => {
      const middlewareExists = app._router.stack.some(r => r.regexp.test(`/api/${route}`));
      if (!middlewareExists) {
        console.log('Middleware:', app._router.stack.map(r => r.handle && r.handle.name));
      }
      expect(middlewareExists).toBeTruthy();
    });
  });


    test("should proxy requests correctly", async () => {
        // Set up a mock HTTP server that responds to GET /users with a 200 status
        const url = `http://localhost:${process.env.USERS_SERVICE_PORT}`;
        nock(url)
            .get('/')
            .reply(200);

        const response = await request(app).get('/api/users');
        expect(response.status).toBe(200);
    });
});