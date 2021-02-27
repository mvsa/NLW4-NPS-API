import {Router} from 'express';
import { SendMailController } from './controllers/SendMailController';
import {SurveysController}  from './controllers/SurveysController';
import UserController from './controllers/UserController';

const router = Router();

const userController = new UserController();//abordagem diferente do usado em Nlw anteriores. Tira proveito do TS
const surveysController = new SurveysController();
const sendMailController = new SendMailController();

router.get("/surveys",surveysController.show);
router.post("/surveys",surveysController.create);

router.post("/users", userController.create);

router.post("/sendMail", sendMailController.execute);

export {router}; //a instrutora faz exportações dessa forma pois pode auxiliar com o processo de autoimport
// do vs code, porém é mais uma preferencia pessoal
