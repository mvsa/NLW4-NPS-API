import request from 'supertest';
import { getConnection } from 'typeorm';
import { app } from '../app';

import createConnection from '../database';



describe("Users", ()=>{
    beforeAll(async ()=>{
        const connection = await createConnection();
        await connection.runMigrations(); //Acessa a conexão (já em env de testes) e roda as migrations na base de testes
    });

    afterAll(async()=>{
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    });
    

    it("Should be able to create a new user",async ()=>{
        const response = await request(app).post("/users")
        .send({
            email: "user@test.com",
            name: "User test"
        });  
    expect(response.status).toBe(201);
    });

    it("Should not be able to create a user with an already registered e-mail", async ()=>{
        const response = await request(app).post("/users")
        .send({
            email: "user@test.com",
            name: "User test"
        });  
    expect(response.status).toBe(400);
    })

});