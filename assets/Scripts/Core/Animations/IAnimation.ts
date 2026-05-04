export interface IAnimation
{
    readonly id: string;

    play(): void;

    cancel(): void;

    onFinished: (() => void) | null;
}
