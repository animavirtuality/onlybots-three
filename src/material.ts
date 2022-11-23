import { Color, MeshPhysicalMaterial } from 'three';
import { NoiseTextureCache, OnlyBotNoiseSettings } from '@/noise';

export type OnlyBotMaterialPreset = {
    bloom: boolean;
    emissive: number;
    environmentIntensity: number;
    specularIntensity: number;
    roughness: number;
    roughnessNoise?: OnlyBotNoiseSettings;
    metalness: number;
    metalnessNoise?: OnlyBotNoiseSettings;
    clearcoat: number;
    clearcoatNoise?: OnlyBotNoiseSettings;
    clearcoatRoughness: number;
    clearcoatRoughnessNoise?: OnlyBotNoiseSettings;
};

export const FALLBACK_PRESET: OnlyBotMaterialPreset = {
    bloom: false,
    emissive: 0,
    environmentIntensity: 0,
    specularIntensity: 0,
    roughness: 0,
    metalness: 0,
    clearcoat: 0,
    clearcoatRoughness: 0,
};

export type DisposableMaterial = {
    material: MeshPhysicalMaterial;
    bloom: boolean;
    dispose: () => void;
};

const noiseCache = new NoiseTextureCache();

export const createMaterialFromPreset = (
    [r, g, b]: [number, number, number],
    preset: OnlyBotMaterialPreset
): DisposableMaterial => {
    const material = new MeshPhysicalMaterial();
    material.transparent = false;
    material.opacity = 1;

    const color = new Color(r / 255, g / 255, b / 255).convertSRGBToLinear();
    material.color = color;

    material.emissiveIntensity = preset.emissive;
    if (preset.emissive > 0) {
        material.emissive = color.clone();
    }

    material.envMapIntensity = preset.environmentIntensity;
    material.specularIntensity = preset.specularIntensity;
    material.roughness = preset.roughness;
    material.metalness = preset.metalness;
    material.clearcoat = preset.clearcoat;
    material.clearcoatRoughness = preset.clearcoatRoughness;

    const roughnessNoise = preset.roughnessNoise ? noiseCache.get(preset.roughnessNoise) : null;
    const metalnessNoise = preset.metalnessNoise ? noiseCache.get(preset.metalnessNoise) : null;
    const clearcoatNoise = preset.clearcoatNoise ? noiseCache.get(preset.clearcoatNoise) : null;
    const clearcoatRoughnessNoise = preset.clearcoatRoughnessNoise
        ? noiseCache.get(preset.clearcoatRoughnessNoise)
        : null;

    if (roughnessNoise) {
        material.roughnessMap = roughnessNoise.texture;
    }
    if (metalnessNoise) {
        material.metalnessMap = metalnessNoise.texture;
    }
    if (clearcoatNoise) {
        material.clearcoatMap = clearcoatNoise.texture;
    }
    if (clearcoatRoughnessNoise) {
        material.clearcoatRoughnessMap = clearcoatRoughnessNoise.texture;
    }

    return {
        material,
        bloom: preset.bloom,
        dispose: () => {
            material.dispose();
            noiseCache.dispose(roughnessNoise);
            noiseCache.dispose(metalnessNoise);
            noiseCache.dispose(clearcoatNoise);
            noiseCache.dispose(clearcoatRoughnessNoise);
        },
    };
};
