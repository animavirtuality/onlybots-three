import { calculateVoxelBounds, OnlyBot, OnlyBotMaterial, Point3 } from '@animavirtuality/onlybots-core';

export type OnlyBotGroupedMaterial = {
    material: OnlyBotMaterial;
    voxels: Point3[];
};

export type OnlyBotThree = {
    min: Point3;
    max: Point3;
    center: Point3;
    groups: OnlyBotGroupedMaterial[];
};

export const formatOnlyBotForThree = (bot: OnlyBot): OnlyBotThree => {
    const voxels = bot.voxels();
    const { min, max } = calculateVoxelBounds(voxels);
    const center = new Point3((max.x + min.x) / 2, (max.y + min.y) / 2, (max.z + min.z) / 2);

    min.z = min.z * -1;
    max.z = max.z * -1;
    center.z = center.z * -1;

    const groups: OnlyBotGroupedMaterial[] = bot.materials.map((material) => ({
        material,
        voxels: [],
    }));
    bot.layers.map((layer) => {
        if (layer.material >= groups.length) {
            throw new Error(`No material found for layer: ${layer.material}`);
        }

        const material = groups[layer.material];
        layer.voxels.forEach((voxel) => {
            material.voxels.push(new Point3(voxel.x, voxel.y, voxel.z * -1));
        });
    });

    return {
        min,
        center,
        max,
        groups,
    };
};
