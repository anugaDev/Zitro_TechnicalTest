import { _decorator, Component } from 'cc';
import { QuizGameModel } from '../Models/QuizGameModel';
import { QuizGameView } from '../Views/QuizGameView';
import { QuizGameController } from '../Controllers/QuizGameController';
import { GameSceneView } from '../../GameScene/Views/GameSceneView';
import { GameSceneModel } from '../../GameScene/Models/GameSceneModel';
import { GameSceneController } from '../../GameScene/Controllers/GameSceneController';
import { SceneNavigator } from '../../Core/SceneNavigator/SceneNavigator';
import { QuizQuestion } from '../Models/Entities/QuizQuestion';
import { AppCache } from '../../ResourceLoad/AppCache';

const { ccclass, property } = _decorator;

@ccclass('QuizGameInstaller')
export class QuizGameInstaller extends Component
{
    @property(QuizGameView)
    private quizView: QuizGameView = null!;

    @property(GameSceneView)
    private gameSceneView: GameSceneView = null!;

    private quizController: QuizGameController = null!;

    private gameSceneController: GameSceneController = null!;

    protected onLoad(): void
    {
        const navigator = new SceneNavigator();
        const gameSceneModel = new GameSceneModel(navigator);
        this.gameSceneController = new GameSceneController(gameSceneModel, this.gameSceneView);

        const questions = AppCache.instance.QuizJson.json as QuizQuestion[];
        this.scheduleOnce(() => this.initWithQuestions(questions));
    }

    private initWithQuestions(questions: QuizQuestion[]): void
    {
        const model = new QuizGameModel();
        model.setQuestionsConfiguration(questions);
        this.quizController = new QuizGameController(model, this.quizView);
        this.quizController.init();
        this.gameSceneController.onFadeInCompleted = () => this.quizView.onSceneFadeInCompleted();
        this.gameSceneController.init();
    }

    protected onDestroy(): void
    {
        this.quizController?.dispose();
        this.gameSceneController?.dispose();
    }
}