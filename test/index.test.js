const { app, server } = require("../index");
const request = require("supertest"); //simula le richieste HTTP al tuo server Express e verifica le risposte

describe("Index Testing", () => {
  afterAll((done) => {
    server.close();
    done();
  });

  it("It should get 404 from error route", async () => {
    const response = await request(app).get("/api/error");
    expect(response.statusCode).toBe(404);
  });
});
