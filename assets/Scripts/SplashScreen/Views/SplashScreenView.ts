import { _decorator, Component, Button, ProgressBar } from 'cc';
import { ISplashScreenView } from './ISplashScreenView';

const { ccclass, property } = _decorator;

@ccclass('SplashScreenView')
export class SplashScreenView extends Component implements ISplashScreenView {
    @property(ProgressBar)
    public ProgressBar: ProgressBar = null!

    setProgressBar(progress: number): void {
        this.ProgressBar.progress = progress;
    }

    public unbindAll(): void {
    }
}