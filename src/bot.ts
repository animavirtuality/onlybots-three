import { BufferGeometry, MeshPhysicalMaterial } from 'three';
import { calculateVoxelBounds, OnlyBot, OnlyBotMaterial, Point3, Point3Set } from '@animavirtuality/onlybots-core';
import { createOnlyBotGroupedMaterialGeometry } from '@/geometry';
import { createMaterialFromPreset, DisposableMaterial, FALLBACK_PRESET, OnlyBotMaterialPreset } from '@/material';

const negative = (n: number): number => (n === 0 ? 0 : -1 * n);

export class OnlyBotThreeMesh {
    public readonly geometry: BufferGeometry;
    public readonly material: MeshPhysicalMaterial;
    public readonly bloom: boolean;

    private readonly disposeMaterial: () => void;

    constructor(geometry: BufferGeometry, { material, bloom, dispose: disposeMaterial }: DisposableMaterial) {
        this.geometry = geometry;
        this.material = material;
        this.disposeMaterial = disposeMaterial;
        this.bloom = bloom;
    }

    public dispose(): void {
        this.geometry.dispose();
        this.disposeMaterial();
    }
}

export class OnlyBotThree {
    public readonly min: Point3;
    public readonly max: Point3;
    public readonly center: Point3;
    public readonly anchor: Point3;
    public readonly meshes: OnlyBotThreeMesh[];

    constructor(min: Point3, max: Point3, center: Point3, anchor: Point3, meshes: OnlyBotThreeMesh[]) {
        this.min = min;
        this.max = max;
        this.center = center;
        this.anchor = anchor;
        this.meshes = meshes;
    }

    public static create(bot: OnlyBot, presets: OnlyBotMaterialPreset[]): OnlyBotThree {
        const voxels = bot.voxels();
        const { min: originalMin, max: originalMax } = calculateVoxelBounds(voxels);

        const min = new Point3(originalMin.x, originalMin.y, negative(originalMin.z));
        const max = new Point3(originalMax.x, originalMax.y, negative(originalMax.z));
        const center = new Point3((max.x + min.x) / 2, (max.y + min.y) / 2, (max.z + min.z) / 2);
        const anchor = new Point3(bot.anchor.x, bot.anchor.y, negative(bot.anchor.z));

        const groups: { material: OnlyBotMaterial; voxels: Point3[] }[] = bot.materials.map((material) => ({
            material,
            voxels: [],
        }));
        bot.layers.map((layer) => {
            if (layer.material >= groups.length) {
                throw new Error(`No group found for layer: ${layer.material}`);
            }

            const group = groups[layer.material];
            layer.voxels.forEach((voxel) => {
                group.voxels.push(new Point3(voxel.x, voxel.y, negative(voxel.z)));
            });
        });

        const set = new Point3Set(groups.flatMap((group) => group.voxels));
        const meshes = groups
            .filter((group) => group.voxels.length > 0)
            .map(
                (group) =>
                    new OnlyBotThreeMesh(
                        createOnlyBotGroupedMaterialGeometry(min, max, set, group.voxels),
                        createMaterialFromPreset(
                            group.material.color,
                            presets[group.material.preset] ?? FALLBACK_PRESET
                        )
                    )
            );

        return new OnlyBotThree(min, max, center, anchor, meshes);
    }

    public dispose(): void {
        this.meshes.forEach((mesh) => {
            mesh.dispose();
        });
    }
}
