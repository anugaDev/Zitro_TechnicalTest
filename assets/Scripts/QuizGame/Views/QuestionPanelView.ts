import { _decorator, Component, Button, RichText, Node, Prefab, instantiate } from 'cc';
import { AnswerButtonView } from './AnswerButtonView';

const { ccclass, property } = _decorator;

@ccclass('QuestionPanelView')
export class QuestionPanelView extends Component {
    @property(RichText)
    public StatementText: RichText = null!;

    @property(Node)
    public AnswerLayout: Node = null!;

    @property(Prefab)
    public AnswerButtonPrefab: Prefab = null!;

    public onAnswerSelected: ((index: number) => void) | null = null;

    public show(statement: string, answers: string[]): void {
        this.StatementText.string = statement;
        this.AnswerLayout.removeAllChildren();
        answers.forEach((text, index) => this.spawnAnswer(text, index));
    }

    private spawnAnswer(answerText: string, index: number): void {
        const node = instantiate(this.AnswerButtonPrefab);
        const answerButtonView = node.getComponent(AnswerButtonView)!;
        answerButtonView.Label.string = answerText;
        answerButtonView.Button.node.on(
            Button.EventType.CLICK,
            () => this.onAnswerSelected?.(index), this
        );
        this.AnswerLayout.addChild(node);
    }

    public setInteractable(value: boolean): void {
        this.AnswerLayout.children.forEach(child => this.setButtonInteractable(child, value));
    }

    private setButtonInteractable(child: Node, value: boolean): void {
        const answerButton = child.getComponent(AnswerButtonView);
        if (!answerButton?.Button?.isValid) {
            return;
        }
        answerButton.Button.interactable = value;
    }

    public setActive(value: boolean): void {
        this.node.active = value;
    }

    public clear(): void {
        if (!this.AnswerLayout?.isValid) {
            return;
        }
        this.AnswerLayout.removeAllChildren();
    }
}
