const { app } = require("../index");
const request = require("supertest"); //simula le richieste HTTP al tuo server Express e verifica le risposte

describe("Index Testing", () => {
  it("It should get 404 from error route", async () => {
    const response = await request(app).get("/api/error");
    expect(response.statusCode).toBe(404);
  });
});
