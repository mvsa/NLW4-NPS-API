import 'reflect-metadata';  //importante vir primeiro
import express from 'express';
import createConnection from './database';
import { router } from './routes';

createConnection();
const app = express();

app.use(express.json());
app.use(router);
// console.log(process.env.NODE_ENV);
export {app};