import { _decorator, Component } from 'cc';
import { MainMenuModel } from '../Models/MainMenuModel';
import { MainMenuView } from '../Views/MainMenuView';
import { MainMenuController } from '../Controllers/MainMenuController';
import { SceneNavigator } from '../../Core/SceneNavigator';

const { ccclass, property } = _decorator;

@ccclass('MainMenuInstaller')
export class MainMenuInstaller extends Component
{
    @property(MainMenuView)
    private menuView: MainMenuView = null!;

    private controller: MainMenuController = null!;

    protected onLoad(): void
    {
        const navigator = new SceneNavigator();
        const model = new MainMenuModel();
        this.controller = new MainMenuController(navigator, model, this.menuView);
        this.controller.init();
    }

    protected onDestroy(): void {
        this.controller?.dispose();
    }
}