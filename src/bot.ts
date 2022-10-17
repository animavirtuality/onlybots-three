import { BufferGeometry } from 'three';
import { calculateVoxelBounds, OnlyBot, OnlyBotMaterial, Point3, Point3Set } from '@animavirtuality/onlybots-core';
import { createOnlyBotGroupedMaterialGeometry } from '@/geometry';

const negative = (n: number): number => (n === 0 ? 0 : -1 * n);

export type OnlyBotThreeMesh = {
    material: OnlyBotMaterial;
    geometry: BufferGeometry;
};
export class OnlyBotThree {
    public readonly min: Point3;
    public readonly max: Point3;
    public readonly center: Point3;
    public readonly anchor: Point3;
    public readonly meshes: OnlyBotThreeMesh[];

    constructor(bot: OnlyBot) {
        const voxels = bot.voxels();
        const { min: originalMin, max: originalMax } = calculateVoxelBounds(voxels);

        this.min = new Point3(originalMin.x, originalMin.y, negative(originalMin.z));
        this.max = new Point3(originalMax.x, originalMax.y, negative(originalMax.z));
        this.center = new Point3(
            (this.max.x + this.min.x) / 2,
            (this.max.y + this.min.y) / 2,
            (this.max.z + this.min.z) / 2
        );
        this.anchor = new Point3(bot.anchor.x, bot.anchor.y, negative(bot.anchor.z));

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
        this.meshes = groups
            .filter((group) => group.voxels.length > 0)
            .map((group) => ({
                material: group.material,
                geometry: createOnlyBotGroupedMaterialGeometry(this.min, this.max, set, group.voxels),
            }));
    }

    public dispose(): void {
        this.meshes.forEach((mesh) => {
            mesh.geometry.dispose();
        });
    }
}
