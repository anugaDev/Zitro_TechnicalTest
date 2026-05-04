export interface IAnimation
{
    readonly id: string;

    play(): void;

    onFinished: (() => void) | null;
}
