import { _decorator, Component } from 'cc';
import { MainMenuModel } from '../Models/MainMenuModel';
import { MainMenuView } from '../Views/MainMenuView';
import { MainMenuController } from '../Controllers/MainMenuController';
import { SceneNavigator } from '../../Core/SceneNavigator';
import { WorldTimeApiService } from 'db://assets/Scripts/MainMenu/Models/Services/TimeService';
import { ApiStatusView } from 'db://assets/Scripts/Shared/Views/ApiStatusView';

const { ccclass, property } = _decorator;

@ccclass('MainMenuInstaller')
export class MainMenuInstaller extends Component {

    @property(MainMenuView)
    private menuView: MainMenuView = null!;

    @property(ApiStatusView)
    private apiStatusView: ApiStatusView = null!;

    private controller: MainMenuController = null!;

    protected onLoad(): void {
        const navigator  = new SceneNavigator();
        const timeService = new WorldTimeApiService();
        const model      = new MainMenuModel(timeService, navigator);

        this.controller = new MainMenuController(model, this.menuView);

        if (this.apiStatusView) {
            this.controller.onApiResult = (result) =>
                this.apiStatusView.onApiResult(result);
        }

        this.controller.init();
    }

    protected onDestroy(): void {
        this.controller?.dispose();
    }
}