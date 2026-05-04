import { _decorator, Component } from 'cc';
import { SlotGameModel } from '../Models/SlotGameModel';
import { SlotGameView } from '../Views/SlotGameView';
import { SlotGameController } from '../Controllers/SlotGameController';
import { GameSceneView } from '../../GameScene/Views/GameSceneView';
import { GameSceneModel } from '../../GameScene/Models/GameSceneModel';
import { GameSceneController } from '../../GameScene/Controllers/GameSceneController';
import { SceneNavigator } from '../../Core/SceneNavigator/SceneNavigator';

const { ccclass, property } = _decorator;

@ccclass('SlotGameInstaller')
export class SlotGameInstaller extends Component
{
    @property(SlotGameView)
    private slotView: SlotGameView = null!;

    @property(GameSceneView)
    private gameSceneView: GameSceneView = null!;

    private slotController: SlotGameController = null!;

    private gameSceneController: GameSceneController = null!;

    protected onLoad(): void
    {
        const navigator = new SceneNavigator();
        const gameSceneModel = new GameSceneModel(navigator);
        this.gameSceneController = new GameSceneController(gameSceneModel, this.gameSceneView);
        const model = new SlotGameModel();
        this.slotController = new SlotGameController(model, this.slotView);

        this.setGameSceneEvents();
        this.slotController.init();
    }

    private setGameSceneEvents(): void
    {
        this.gameSceneController.onFadeInCompleted = () => this.slotView.onSceneFadeInCompleted();
        this.gameSceneController.onFadeOutStarted = () => this.slotView.onSceneFadeOutStarted();
        this.slotView.onAllReelsReady = () => this.gameSceneController.init();
    }

    protected onDestroy(): void
    {
        this.slotController?.dispose();
        this.gameSceneController?.dispose();
    }
}