import { CanvasTexture, NearestFilter, RepeatWrapping, sRGBEncoding } from 'three';

export const OnlyBotNoiseTypes = ['RANDOM_BINARY', 'RANDOM_GRAYSCALE'] as const;
export type OnlyBotNoiseType = typeof OnlyBotNoiseTypes[number];
export type OnlyBotNoiseSettings = {
    type: OnlyBotNoiseType;
    resolution: number;
    brightness: number;
    strength: number;
    repeat: number;
    pixelated: boolean;
};

const generateNoiseTexture = (id: string, settings: OnlyBotNoiseSettings, alpha: boolean): NoiseTextureEntry => {
    const { type, brightness = 0, strength = 0, resolution, repeat, pixelated } = settings;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = resolution;

    const context = canvas.getContext('2d');
    if (context === null) {
        throw new Error('Failed to create canvas context');
    }

    const image = context.createImageData(resolution, resolution);
    const data = image.data;

    const size = resolution * resolution;

    for (let i = 0; i < size; i++) {
        let noise = Math.random();
        if (type === 'RANDOM_BINARY') noise = Math.round(noise);

        // blend noise onto the base grey value using normal transparency blending, where noiseAmount equates to opacity

        let v = strength * noise + (1 - strength) * brightness;
        v = Math.floor(v * 255);

        const p = i * 4;
        data[p] = v;
        data[p + 1] = v;
        data[p + 2] = v;
        data[p + 3] = alpha ? v : 255;
    }

    context.putImageData(image, 0, 0);

    const texture = new CanvasTexture(canvas);

    if (pixelated) {
        texture.minFilter = NearestFilter;
        texture.magFilter = NearestFilter;
    }

    texture.encoding = sRGBEncoding;
    texture.wrapS = RepeatWrapping;
    texture.wrapT = RepeatWrapping;
    texture.repeat.set(repeat, repeat);

    return {
        id,
        references: 0,
        texture,
    };
};

type NoiseTextureEntry = {
    id: string;
    references: number;
    texture: CanvasTexture;
};

export class NoiseTextureCache {
    private readonly cache: Record<string, NoiseTextureEntry> = {};

    get(this: NoiseTextureCache, settings: OnlyBotNoiseSettings, alpha: boolean = false): NoiseTextureEntry {
        const id = `${settings.type}:${settings.resolution.toString(10)}:${settings.brightness.toString(
            10
        )}:${settings.strength.toString(10)}:${settings.repeat.toString(
            10
        )}:${settings.pixelated.toString()}:${alpha.toString()}`;

        const entry = (this.cache[id] ??= generateNoiseTexture(id, settings, alpha));
        entry.references++;
        return entry;
    }

    public dispose(this: NoiseTextureCache, entry: NoiseTextureEntry | null): void {
        if (!entry) {
            return;
        }
        entry.references--;

        if (entry.references <= 0) {
            entry.texture.dispose();
            delete this.cache[entry.id];
        }
    }

    public disposeAll(this: NoiseTextureCache): void {
        for (const [key, value] of Object.entries(this.cache)) {
            value.texture.dispose();
            delete this.cache[key];
        }
    }
}
