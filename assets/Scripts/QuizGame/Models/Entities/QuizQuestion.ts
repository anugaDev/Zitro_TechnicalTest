import {QuizAnswer} from "db://assets/Scripts/QuizGame/Models/Entities/QuizAnswer";

export interface QuizQuestion {
    statement: string;
    answers: [QuizAnswer, QuizAnswer, QuizAnswer];
}