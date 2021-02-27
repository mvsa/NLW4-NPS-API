import request from 'supertest';
import { app } from '../app';

import createConnection from '../database';


describe("Surveys", ()=>{
    beforeAll(async ()=>{
        const connection = await createConnection();
        await connection.runMigrations(); //Acessa a conexão (já em env de testes) e roda as migrations na base de testes
    });
    

    it("Should be able to create a new survey",async ()=>{
        const response = await request(app).post("/surveys")
        .send({
            title: "Test Survey",
            description: "This is a test survey, please rate from 0 to 10."
        });  
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    });

    it("Should be able to get all surveys", async ()=>{
        await request(app).post("/surveys")
        .send({
            title: "Test Survey2",
            description: "This is a test survey, please rate from 0 to 10."
        }); 

        const response = await request(app).get("/surveys");

        expect(response.body.length).toBe(2);
    });

});