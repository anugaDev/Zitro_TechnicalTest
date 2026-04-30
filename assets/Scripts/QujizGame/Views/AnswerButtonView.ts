import { _decorator, Component, Button, RichText, Node, Prefab, instantiate } from 'cc';

import {IQuizGameView} from "db://assets/Scripts/QujizGame/Views/IQuizGameView";

const { ccclass, property } = _decorator;

export class AnswerButtonView extends Component implements IQuizGameView {

    @property(Button)
    public Button : Button = null!;

    @property(RichText)
    public Label : RichText = null!;
}
