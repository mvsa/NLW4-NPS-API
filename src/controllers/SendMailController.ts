import { getCustomRepository } from 'typeorm';
import { Request, Response } from "express";
import { UsersRepository } from "../repositories/UsersRepository";
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import {resolve} from 'path';
import SendMailService from '../services/SendMailService';
import { AppError } from '../errors/AppError';


class SendMailController {

    async execute(request: Request, response: Response){
        const {email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const npsPath = resolve(__dirname, "..","views","emails","npsMail.hbs");

        const userAlreadyExists = await usersRepository.findOne({email});
        

        if(!userAlreadyExists){
            throw new AppError("User not found");
        }

        const survey = await surveysRepository.findOne({id: survey_id});

        if(!survey){
            throw new AppError("Survey not found");
        }

       

        const surveyAlreadyExistsForUser = await surveysUsersRepository.findOne({
            where:{user_id:userAlreadyExists.id , value: null},
            relations:["user","survey"]
        });

        //where:[{user_id:userAlreadyExists.id},  {value: null}],
        //Esse where é condicional, a ou b -- o colchete e a divisão de chaves transforma em OR?

        const variables = {
            name: userAlreadyExists.name,
            title:survey.title,
            description:survey.description,
            id: "",
            link:process.env.URL_MAIL,
        }

        if (surveyAlreadyExistsForUser){
            variables.id = surveyAlreadyExistsForUser.id;
            await SendMailService.execute(email, survey.title, variables,npsPath);
            return response.json(surveyAlreadyExistsForUser);
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: userAlreadyExists.id,
            survey_id
        });

        await surveysUsersRepository.save(surveyUser);

        variables.id = surveyUser.id;

        await SendMailService.execute(email, survey.title, variables,npsPath );

        return response.json(surveyUser);


    }
}

export {SendMailController}