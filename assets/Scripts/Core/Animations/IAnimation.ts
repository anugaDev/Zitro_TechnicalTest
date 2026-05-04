export interface IAnimation
{
    readonly Id: string;

    play(): void;

    cancel(): void;

    onFinished: (() => void) | null;
}