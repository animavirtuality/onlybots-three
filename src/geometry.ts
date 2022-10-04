import { BoxGeometry, BufferGeometry } from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Point3, Point3Set } from '@animavirtuality/onlybots-core';

type VisibleFaces = [boolean, boolean, boolean, boolean, boolean, boolean]; // planes px,nx, py,ny, pz,nz
const createGeometry = (x: number, y: number, z: number, faces: VisibleFaces): BoxGeometry => {
    const geometry = new BoxGeometry();
    const index: number[] = [];
    if (faces[0]) index.push(0, 2, 1, 2, 3, 1);
    if (faces[1]) index.push(4, 6, 5, 6, 7, 5);
    if (faces[2]) index.push(8, 10, 9, 10, 11, 9);
    if (faces[3]) index.push(12, 14, 13, 14, 15, 13);
    if (faces[4]) index.push(16, 18, 17, 18, 19, 17);
    if (faces[5]) index.push(20, 22, 21, 22, 23, 21);
    geometry.setIndex(index);
    geometry.translate(x, y, z);

    return geometry;
};

const determineVisibleFaces = (voxel: Point3, min: Point3, max: Point3, set: Point3Set): VisibleFaces => {
    return [
        voxel.x >= max.x || !set.has(voxel.x + 1, voxel.y, voxel.z),
        voxel.x <= min.x || !set.has(voxel.x - 1, voxel.y, voxel.z),
        voxel.y >= max.y || !set.has(voxel.x, voxel.y + 1, voxel.z),
        voxel.y <= min.y || !set.has(voxel.x, voxel.y - 1, voxel.z),
        voxel.z >= min.z || !set.has(voxel.x, voxel.y, voxel.z + 1),
        voxel.z <= max.z || !set.has(voxel.x, voxel.y, voxel.z - 1),
    ];
};

export const createOnlyBotGroupedMaterialGeometry = (
    min: Point3,
    max: Point3,
    set: Point3Set,
    voxels: Point3[]
): BufferGeometry => {
    return BufferGeometryUtils.mergeBufferGeometries(
        voxels.map((voxel) => createGeometry(voxel.x, voxel.y, voxel.z, determineVisibleFaces(voxel, min, max, set)))
    );
};
