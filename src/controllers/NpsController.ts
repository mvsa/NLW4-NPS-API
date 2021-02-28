import { Request, Response } from "express";
import { getCustomRepository,Not, IsNull } from "typeorm"
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository"


class NpsController{
    async execute(request: Request, response: Response){

        const {survey_id} = request.params;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            // value: Not(isNull())
        });

        const detractors = surveysUsers.filter((survey) =>
         (survey.value) && (survey.value >= 0 && survey.value <= 6)
        ).length;

        const promoters = surveysUsers.filter((survey) =>
        (survey.value) && (survey.value >= 9 && survey.value <= 10)
        ).length;

        const passives = surveysUsers.filter((survey) =>
        (survey.value) && (survey.value >= 7 && survey.value <= 8)
        ).length;

        const totalAnswers = surveysUsers.filter((survey) => survey.value).length;

        const calculate = Number((((promoters - detractors) / totalAnswers) * 100).toFixed(2));

        return response.json({
            detractors,
            promoters,
            passives,
            totalAnswers,
            nps: calculate,
        })
    }
}

export{NpsController}


// 123456789 10
//Detratores -> 0-6
//Passivos -> 7 8
//Promotores => 9 10

//Passivos são eliminados, não geram valor e não importam
// (Promotores - detratores)  / (todos os respondentes) x 100   