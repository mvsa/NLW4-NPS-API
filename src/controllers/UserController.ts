import {Request, Response} from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';


class UserController{

    async create(request:Request, response:Response){
        const {name, email} = request.body;

        const schema =  yup.object({
            name: yup.string().required("Nome obrigatório"),
            email: yup.string().email("Email deve ser válido").required()
        })

        // if(! (await schema.isValid(request.body))){
        //     return response.status(400).json({error: "Validation Failed!"}); 
        // } forma mais generica

        try{
            await schema.validate(request.body,{abortEarly:false}); //Faz todas as validações e não para no primeiro erro que encontrar
        }catch(err){
            return response.status(400).json({error: err.errors}); //tras o erro de quais campos falharam
        }
        

        const usersRepository = getCustomRepository(UsersRepository);   
        
        const userAlreadyExists = await usersRepository.findOne({
            email
        });

        if(userAlreadyExists){
            throw new AppError("User already exists");
        }

        const user = usersRepository.create({
            name,
            email
        })

        
        await usersRepository.save(user);
        

        return response.status(201).json(user);
       
    }
}

export default UserController;