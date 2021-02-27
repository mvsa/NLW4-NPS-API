import { getCustomRepository } from 'typeorm';
import { Request, Response } from "express";
import { UsersRepository } from "../repositories/UsersRepository";
import { SurveysRepository } from '../repositories/SurveysRepository';
import { SurveysUsersRepository } from '../repositories/SurveysUsersRepository';


class SendMailController {

    async execute(request: Request, response: Response){
        const {email, survey_id} = request.body;

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const userAlreadyExists = await usersRepository.findOne({email});

        if(!userAlreadyExists){
            return response.status(400).json({
                error: "User not found",
            });
        }

        const surveyAlreadyExists = await surveysRepository.findOne({id: survey_id});

        if(!surveyAlreadyExists){
            return response.status(400).json({
                error: "Survey not found",
            })
        }

        const surveyUser = surveysUsersRepository.create({
            user_id: userAlreadyExists.id,
            survey_id
        });


        await surveysUsersRepository.save(surveyUser);

        return response.json(surveyUser);


    }
}

export {SendMailController}