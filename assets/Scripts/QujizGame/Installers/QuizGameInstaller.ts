import { _decorator, Component, resources } from 'cc';
import { QuizGameModel } from '../Models/QuizGameModel';
import { QuizGameView } from '../Views/QuizGameView';
import { QuizGameController } from '../Controllers/QuizGameController';
import { SceneNavigator } from '../../Core/SceneNavigator';
import { QuizQuestion } from '../Models/Entities/QuizQuestion';
const { ccclass, property } = _decorator;

@ccclass('QuizGameInstaller')
export class QuizGameInstaller extends Component {

    @property(QuizGameView)
    private quizView: QuizGameView = null!;

    private controller: QuizGameController = null!;

    protected onLoad(): void {

        resources.load('questions', (err, jsonAsset: any) => {
            if (err) {
                console.error('Failed to load questions.json:', err);
                return;
            }
            const questions: QuizQuestion[] = jsonAsset.json;
            const navigator = new SceneNavigator();
            const model = new QuizGameModel();
            model.setQuestionsConfiguration(questions);
            this.controller = new QuizGameController(navigator, model, this.quizView);
            this.controller.init();
        });
    }
    protected onDestroy(): void {
        this.controller?.dispose();
    }
}