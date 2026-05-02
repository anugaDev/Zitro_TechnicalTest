import { _decorator, Component } from 'cc';
import { resources, JsonAsset } from 'cc';
import { QuizGameModel } from '../Models/QuizGameModel';
import { QuizGameView } from '../Views/QuizGameView';
import { QuizGameController } from '../Controllers/QuizGameController';
import { GameSceneView } from '../../GameScene/Views/GameSceneView';
import { GameSceneModel } from '../../GameScene/Models/GameSceneModel';
import { GameSceneController } from '../../GameScene/Controllers/GameSceneController';
import { SceneNavigator } from '../../Core/SceneNavigator';
import { QuizQuestion } from '../Models/Entities/QuizQuestion';

const { ccclass, property } = _decorator;

@ccclass('QuizGameInstaller')
export class QuizGameInstaller extends Component {

    @property(QuizGameView)
    private quizView: QuizGameView = null!;

    @property(GameSceneView)
    private gameSceneView: GameSceneView = null!;

    private quizController: QuizGameController = null!;

    private gameSceneController: GameSceneController = null!;

    protected onLoad(): void {
        const navigator = new SceneNavigator();
        const gameSceneModel  = new GameSceneModel(navigator);
        this.gameSceneController = new GameSceneController(gameSceneModel, this.gameSceneView);

        resources.load('quizGameConfiguration', JsonAsset, (err, jsonAsset: JsonAsset) => {
            if (err) {
                console.error('Failed to load quizGameConfiguration.json:', err);
                this.gameSceneController.init();
                return;
            }

            const questions = jsonAsset.json as QuizQuestion[];
            const model = new QuizGameModel();
            model.setQuestionsConfiguration(questions);
            this.quizController = new QuizGameController(model, this.quizView);
            this.quizController.init();
            this.gameSceneController.init();
        });
    }

    protected onDestroy(): void {
        this.quizController?.dispose();
        this.gameSceneController?.dispose();
    }
}