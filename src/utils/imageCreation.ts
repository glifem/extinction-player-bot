import {
    read,
    loadFont,
    measureTextHeight,
    MIME_PNG,
    HORIZONTAL_ALIGN_CENTER,
    VERTICAL_ALIGN_MIDDLE,
    measureText,
    HORIZONTAL_ALIGN_LEFT,
    HORIZONTAL_ALIGN_RIGHT
} from 'jimp';

const statCardImagePath = 'assets/cards/player_stats_0.png';

export type GenericCallback<T, U = any, TThis = any> = (
    this: TThis,
    err: Error | null,
    value: T
) => U;

const cardFonts = [
    'assets/fonts/roboto/roboto_medium_10.fnt',
    'assets/fonts/roboto/roboto_medium_16.fnt',
    'assets/fonts/roboto/roboto_medium_18.fnt',
    'assets/fonts/roboto/roboto_medium_19.fnt',
    'assets/fonts/roboto/roboto_medium_20.fnt',
    'assets/fonts/roboto/roboto_medium_21.fnt',
    'assets/fonts/roboto/roboto_medium_22.fnt',
    'assets/fonts/roboto/roboto_medium_23.fnt',
    'assets/fonts/roboto/roboto_medium_24.fnt',
    'assets/fonts/roboto/roboto_medium_25.fnt',
    'assets/fonts/roboto/roboto_medium_26.fnt',
    'assets/fonts/roboto/roboto_medium_28.fnt',
    'assets/fonts/roboto/roboto_medium_29.fnt',
    'assets/fonts/roboto/roboto_medium_30.fnt',
    'assets/fonts/roboto/roboto_medium_31.fnt',
    'assets/fonts/roboto/roboto_medium_32.fnt',
    'assets/fonts/roboto/roboto_medium_33.fnt',
    'assets/fonts/roboto/roboto_medium_34.fnt',
    'assets/fonts/roboto/roboto_medium_36.fnt',
    'assets/fonts/roboto/roboto_medium_38.fnt',
    'assets/fonts/roboto/roboto_medium_48.fnt',
    'assets/fonts/roboto/roboto_medium_54.fnt'
];

const getFontForText = (text: string, fonts: any[], width: number, height?: number) => {
    let fontIndex = 0;

    while (true) {
        const textWidth = measureText(fonts[fontIndex], text);
        if (height) {
            const textHeight = measureTextHeight(fonts[fontIndex], text, height);
            if (textHeight <= height && textWidth <= width) break;
        } else if (textWidth <= width) break;

        fontIndex++;
    }

    return fonts[fontIndex] || fonts[fonts.length - 1];
};

interface ICardInfo {
    key: string;
    aligmentX: number;
    alignmentY: number;
    x: number;
    y: number;
    maxWidth?: number;
    maxHeight?: number;
    maxTextWidth?: number;
    maxTextHeight?: number;
    fontId?: number;
}

const cardInfo: ICardInfo[] = [
    {
        key: 'name',
        aligmentX: HORIZONTAL_ALIGN_CENTER,
        alignmentY: VERTICAL_ALIGN_MIDDLE,
        x: -10,
        y: -50,
        maxWidth: 500,
        maxHeight: 200,
        maxTextWidth: 250
    },
    {
        key: 'playtime',
        aligmentX: HORIZONTAL_ALIGN_LEFT,
        alignmentY: VERTICAL_ALIGN_MIDDLE,
        x: 292,
        y: -7,
        maxWidth: 500,
        maxHeight: 200,
        fontId: 20
    },
    // Global
    {
        key: 'global_kd',
        aligmentX: HORIZONTAL_ALIGN_RIGHT,
        alignmentY: VERTICAL_ALIGN_MIDDLE,
        x: -369,
        y: 105,
        maxWidth: 500,
        maxHeight: 200,
        fontId: 16
    },
    {
        key: 'global_kills',
        aligmentX: HORIZONTAL_ALIGN_RIGHT,
        alignmentY: VERTICAL_ALIGN_MIDDLE,
        x: -388,
        y: 159,
        maxWidth: 500,
        maxHeight: 200,
        fontId: 16
    },
    {
        key: 'global_deaths',
        aligmentX: HORIZONTAL_ALIGN_RIGHT,
        alignmentY: VERTICAL_ALIGN_MIDDLE,
        x: -407,
        y: 214,
        maxWidth: 500,
        maxHeight: 200,
        fontId: 16
    },
    // Redzone
    {
        key: 'redzone_kd',
        aligmentX: HORIZONTAL_ALIGN_RIGHT,
        alignmentY: VERTICAL_ALIGN_MIDDLE,
        x: -369 + 205,
        y: 105,
        maxWidth: 500,
        maxHeight: 200,
        fontId: 16
    },
    {
        key: 'redzone_kills',
        aligmentX: HORIZONTAL_ALIGN_RIGHT,
        alignmentY: VERTICAL_ALIGN_MIDDLE,
        x: -355 + 173,
        y: 159,
        maxWidth: 500,
        maxHeight: 200,
        fontId: 16
    },
    {
        key: 'redzone_deaths',
        aligmentX: HORIZONTAL_ALIGN_RIGHT,
        alignmentY: VERTICAL_ALIGN_MIDDLE,
        x: -407 + 206,
        y: 215,
        maxWidth: 500,
        maxHeight: 200,
        fontId: 16
    },
    // Darkzone
    {
        key: 'darkzone_kd',
        aligmentX: HORIZONTAL_ALIGN_RIGHT,
        alignmentY: VERTICAL_ALIGN_MIDDLE,
        x: -369 + 205 + 205 + 2,
        y: 105,
        maxWidth: 500,
        maxHeight: 200,
        fontId: 16
    },
    {
        key: 'darkzone_kills',
        aligmentX: HORIZONTAL_ALIGN_RIGHT,
        alignmentY: VERTICAL_ALIGN_MIDDLE,
        x: -355 + 173 + 173 + 34,
        y: 159,
        maxWidth: 500,
        maxHeight: 200,
        fontId: 16
    },
    {
        key: 'darkzone_deaths',
        aligmentX: HORIZONTAL_ALIGN_RIGHT,
        alignmentY: VERTICAL_ALIGN_MIDDLE,
        x: -407 + 206 + 206 + 1,
        y: 215,
        maxWidth: 500,
        maxHeight: 200,
        fontId: 16
    },
    // Level
    {
        key: 'level',
        aligmentX: HORIZONTAL_ALIGN_CENTER,
        alignmentY: VERTICAL_ALIGN_MIDDLE,
        x: 259,
        y: -37,
        maxWidth: 500,
        maxHeight: 200,
        maxTextWidth: 250,
        maxTextHeight: 25
    }
];

class ImageCreation {
    private fonts: any[] = [];

    constructor() {
        cardFonts.reverse().forEach((a, key) => {
            loadFont(a).then((loadedFont) => {
                this.fonts[key] = loadedFont;
            });
        });
    }

    createStatsCard(
        values: { [key: string]: string | number },
        cb: GenericCallback<Buffer, any, any>
    ) {
        read(statCardImagePath)
            .then((image) => {
                cardInfo.forEach((a) => {
                    const value = String(values[a.key]) || 'Unknown';
                    const font = a.fontId
                        ? this.fonts[a.fontId]
                        : getFontForText(value, this.fonts, a.maxTextWidth || 0, a.maxTextHeight);

                    image.print(
                        font,
                        a.x,
                        a.y,
                        {
                            text: value,
                            alignmentX: a.aligmentX,
                            alignmentY: a.alignmentY
                        },
                        a.maxWidth,
                        a.maxHeight
                    );
                });

                image.getBuffer(MIME_PNG, cb);
            })
            .catch((err) => {
                throw err;
            });
    }
}

export const imageCreation = new ImageCreation();
