import {QuizAnswer} from "db://assets/Scripts/QujizGame/Models/Entities/QuizAnswer";

export interface QuizQuestion {
    statement: string;
    answers: [QuizAnswer, QuizAnswer, QuizAnswer];
}