import {Router} from 'express';
import UserController from './controllers/UserController';

const router = Router();

const userController = new UserController;//abordagem diferente do usado em Nlw anteriores. Tira proveito do TS

router.post("/users", userController.create);

export {router}; //a instrutora faz exportações dessa forma? Existe algum beneficio pratico em arquivos
//com um unico elemento a ser exportado?

