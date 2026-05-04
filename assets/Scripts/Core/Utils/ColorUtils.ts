import { Color } from 'cc';

export class ColorUtils {
    public static toHex(color: Color): string {
        return `#${ColorUtils.toHexChannel(color.r)}` +
            `${ColorUtils.toHexChannel(color.g)}` +
            `${ColorUtils.toHexChannel(color.b)}`;
    }

    private static toHexChannel(value: number): string {
        const hex = value.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }
}
