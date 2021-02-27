import { getCustomRepository } from 'typeorm';
import { Request, Response } from "express";
import { UsersRepository } from "../repositories/UsersRepository";
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';
import {resolve} from 'path';
import SendMailService from '../services/SendMailService';


class SendMailController {

    async execute(request: Request, response: Response){
        const {email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const npsPath = resolve(__dirname, "..","views","emails","npsMail.hbs");

        const userAlreadyExists = await usersRepository.findOne({email});
        

        if(!userAlreadyExists){
            return response.status(400).json({
                error: "User not found",
            });
        }

        const survey = await surveysRepository.findOne({id: survey_id});

        if(!survey){
            return response.status(400).json({
                error: "Survey not found",
            })
        }

        const variables = {
            name: userAlreadyExists.name,
            title:survey.title,
            description:survey.description,
            user_id: userAlreadyExists.id,
            link:process.env.URL_MAIL,
        }

        const surveyAlreadyExistsForUser = await surveysUsersRepository.findOne({
            where:[{user_id:userAlreadyExists.id},  {value: null}],
            relations:["user","survey"]
        });

        if (surveyAlreadyExistsForUser){
            await SendMailService.execute(email, survey.title, variables,npsPath);
            return response.json(surveyAlreadyExistsForUser);
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: userAlreadyExists.id,
            survey_id
        });

        await surveysUsersRepository.save(surveyUser);

        await SendMailService.execute(email, survey.title, variables,npsPath );

        return response.json(surveyUser);


    }
}

export {SendMailController}