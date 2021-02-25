import 'reflect-metadata';  //importante vir primeiro
import express from 'express';
import './database';
const app = express();

app.get("/", (request, response)=>{
    return response.json({ok: true});
});

app.post("/", (request, response)=>{
    return response.json({message: "Created OK"});
});

app.listen(3333,()=>{
    console.log('Running');
})