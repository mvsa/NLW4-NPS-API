import {Router} from 'express';
import UserController from './controllers/UserController';

const router = Router();

const userController = new UserController;//abordagem diferente do usado em Nlw anteriores. Tira proveito do TS

router.post("/users", userController.create);

export {router}; //a instrutora faz exportações dessa forma pois pode auxiliar com o processo de autoimport
// do vs code, porém é mais uma preferencia pessoal
