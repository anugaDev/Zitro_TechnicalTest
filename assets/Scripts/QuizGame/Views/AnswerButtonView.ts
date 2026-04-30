import { _decorator, Component, Button, Label } from 'cc';

const { ccclass, property } = _decorator;

@ccclass('AnswerButtonView')
export class AnswerButtonView extends Component {

    @property(Button)
    public Button: Button = null!;

    @property(Label)
    public Label: Label = null!;
}
