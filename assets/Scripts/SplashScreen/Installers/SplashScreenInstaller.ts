import { _decorator, Component } from 'cc';
import { SplashScreenModel } from '../Models/SplashScreenModel';
import { SplashScreenView } from '../Views/SplashScreenView';
import { SplashScreenController } from '../Controllers/SplashScreenController';
import { SceneNavigator } from '../../Core/SceneNavigator/SceneNavigator';
import { CounterCoroutine } from '../../Core/CounterCoroutine';
import { SplashAssetLoader } from '../Models/SplashAssetLoader';
import { TimeService } from '../../ResourceLoad/Services/TimeService';

const { ccclass, property } = _decorator;

@ccclass('SplashScreenInstaller')
export class SplashScreenInstaller extends Component
{

    @property(SplashScreenView)
    public SplashScreenView: SplashScreenView = null!;

    @property(CounterCoroutine)
    public Counter: CounterCoroutine = null!;

    private _splashScreenController: SplashScreenController = null!;

    protected onLoad(): void
    {
        const navigator = new SceneNavigator();
        const timeService = new TimeService();
        const assetLoader = new SplashAssetLoader(timeService);
        const model = new SplashScreenModel(this.Counter, assetLoader);

        this._splashScreenController = new SplashScreenController(navigator, model, this.SplashScreenView);
        this._splashScreenController.init();
    }

    protected onDestroy(): void
    {
        this._splashScreenController?.dispose();
    }
}