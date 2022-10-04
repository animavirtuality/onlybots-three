import { calculateVoxelBounds, OnlyBot, OnlyBotMaterial, Point3, Point3Set } from '@animavirtuality/onlybots-core';

export type OnlyBotGroupedMaterial = {
    material: OnlyBotMaterial;
    voxels: Point3[];
};

export type OnlyBotThree = {
    min: Point3;
    max: Point3;
    center: Point3;
    set: Point3Set;
    groups: OnlyBotGroupedMaterial[];
};

const negative = (n: number): number => (n === 0 ? 0 : -1 * n);

export const formatOnlyBotForThree = (bot: OnlyBot): OnlyBotThree => {
    const voxels = bot.voxels();
    const { min, max } = calculateVoxelBounds(voxels);
    const center = new Point3((max.x + min.x) / 2, (max.y + min.y) / 2, (max.z + min.z) / 2);

    const negativeMinZ = negative(min.z);
    min.z = negative(max.z);
    max.z = negativeMinZ;
    center.z = negative(center.z);

    const groups: OnlyBotGroupedMaterial[] = bot.materials.map((material) => ({
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

    return {
        min,
        center,
        max,
        set,
        groups,
    };
};
