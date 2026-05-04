import { _decorator, Component } from 'cc';
import { MainMenuModel } from '../Models/MainMenuModel';
import { MainMenuView } from '../Views/MainMenuView';
import { MainMenuController } from '../Controllers/MainMenuController';
import { SceneNavigator } from '../../Core/SceneNavigator';
import { TimeService } from '../Models/Services/TimeService';

const { ccclass, property } = _decorator;

@ccclass('MainMenuInstaller')
export class MainMenuInstaller extends Component
{
    @property(MainMenuView)
    private mainMenuView: MainMenuView = null!;

    private controller: MainMenuController = null!;

    protected onLoad(): void
    {
        const navigator  = new SceneNavigator();
        const timeService = new TimeService();
        const model = new MainMenuModel(timeService, navigator);

        this.controller = new MainMenuController(model, this.mainMenuView);
        this.controller.init();
    }
    protected onDestroy(): void
    {
        this.controller?.dispose();
    }
}