import { Box3, BoxGeometry, BufferGeometry, Float32BufferAttribute, Matrix4, Vector2, Vector3 } from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { Point3, Point3Set } from '@anima-virtuality/onlybots-core';

const makeUVs = (
    transformMatrix: Matrix4,
    boundingBox: Box3,
    maxSize: number,
    v0: Vector3,
    v1: Vector3,
    v2: Vector3
): [Vector2, Vector2, Vector2] => {
    // pre-rotate the model so that cube sides match world axis

    v0.applyMatrix4(transformMatrix);
    v1.applyMatrix4(transformMatrix);
    v2.applyMatrix4(transformMatrix);

    //get normal of the face, to know into which cube side it maps better

    const n = new Vector3();
    n.crossVectors(v1.clone().sub(v0), v1.clone().sub(v2)).normalize();

    n.x = Math.abs(n.x);
    n.y = Math.abs(n.y);
    n.z = Math.abs(n.z);

    const uv0 = new Vector2();
    const uv1 = new Vector2();
    const uv2 = new Vector2();

    // xz mapping

    if (n.y > n.x && n.y > n.z) {
        uv0.x = (v0.x - boundingBox.min.x) / maxSize;
        uv0.y = (boundingBox.max.z - v0.z) / maxSize;
        uv1.x = (v1.x - boundingBox.min.x) / maxSize;
        uv1.y = (boundingBox.max.z - v1.z) / maxSize;
        uv2.x = (v2.x - boundingBox.min.x) / maxSize;
        uv2.y = (boundingBox.max.z - v2.z) / maxSize;
    } else if (n.x > n.y && n.x > n.z) {
        uv0.x = (v0.z - boundingBox.min.z) / maxSize;
        uv0.y = (v0.y - boundingBox.min.y) / maxSize;
        uv1.x = (v1.z - boundingBox.min.z) / maxSize;
        uv1.y = (v1.y - boundingBox.min.y) / maxSize;
        uv2.x = (v2.z - boundingBox.min.z) / maxSize;
        uv2.y = (v2.y - boundingBox.min.y) / maxSize;
    } else if (n.z > n.y && n.z > n.x) {
        uv0.x = (v0.x - boundingBox.min.x) / maxSize;
        uv0.y = (v0.y - boundingBox.min.y) / maxSize;
        uv1.x = (v1.x - boundingBox.min.x) / maxSize;
        uv1.y = (v1.y - boundingBox.min.y) / maxSize;
        uv2.x = (v2.x - boundingBox.min.x) / maxSize;
        uv2.y = (v2.y - boundingBox.min.y) / maxSize;
    }

    return [uv0, uv1, uv2];
};

const applyBoxUV = (geometry: BufferGeometry): void => {
    if (geometry.boundingBox === null) {
        geometry.computeBoundingBox();
    }
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const geometryBoundingBox = geometry.boundingBox!;
    const geometryDimensions = new Vector3(
        geometryBoundingBox.max.x - geometryBoundingBox.min.x,
        geometryBoundingBox.max.y - geometryBoundingBox.min.y,
        geometryBoundingBox.max.z - geometryBoundingBox.min.z
    );

    const uvSize = Math.max(geometryDimensions.x, geometryDimensions.y, geometryDimensions.z);
    const uvBoundingBox = new Box3(
        new Vector3(-uvSize / 2, -uvSize / 2, -uvSize / 2),
        new Vector3(uvSize / 2, uvSize / 2, uvSize / 2)
    );

    const transformMatrix = new Matrix4();

    const coords = Array.from({ length: Math.ceil((2 * geometry.attributes.position.array.length) / 3) }, () => 0);

    // maps 3 verts of 1 face on the better side of the cube
    // side of the cube can be XY, XZ or YZ

    if (geometry.index) {
        // is it indexed buffer geometry?

        for (let vi = 0; vi < geometry.index.array.length; vi += 3) {
            const idx0 = geometry.index.array[vi];
            const idx1 = geometry.index.array[vi + 1];
            const idx2 = geometry.index.array[vi + 2];

            const vx0 = geometry.attributes.position.array[3 * idx0];
            const vy0 = geometry.attributes.position.array[3 * idx0 + 1];
            const vz0 = geometry.attributes.position.array[3 * idx0 + 2];

            const vx1 = geometry.attributes.position.array[3 * idx1];
            const vy1 = geometry.attributes.position.array[3 * idx1 + 1];
            const vz1 = geometry.attributes.position.array[3 * idx1 + 2];

            const vx2 = geometry.attributes.position.array[3 * idx2];
            const vy2 = geometry.attributes.position.array[3 * idx2 + 1];
            const vz2 = geometry.attributes.position.array[3 * idx2 + 2];

            const v0 = new Vector3(vx0, vy0, vz0);
            const v1 = new Vector3(vx1, vy1, vz1);
            const v2 = new Vector3(vx2, vy2, vz2);

            const [uv0, uv1, uv2] = makeUVs(transformMatrix, uvBoundingBox, uvSize, v0, v1, v2);

            coords[2 * idx0] = uv0.x;
            coords[2 * idx0 + 1] = uv0.y;

            coords[2 * idx1] = uv1.x;
            coords[2 * idx1 + 1] = uv1.y;

            coords[2 * idx2] = uv2.x;
            coords[2 * idx2 + 1] = uv2.y;
        }
    } else {
        for (let vi = 0; vi < geometry.attributes.position.array.length; vi += 9) {
            const vx0 = geometry.attributes.position.array[vi];
            const vy0 = geometry.attributes.position.array[vi + 1];
            const vz0 = geometry.attributes.position.array[vi + 2];

            const vx1 = geometry.attributes.position.array[vi + 3];
            const vy1 = geometry.attributes.position.array[vi + 4];
            const vz1 = geometry.attributes.position.array[vi + 5];

            const vx2 = geometry.attributes.position.array[vi + 6];
            const vy2 = geometry.attributes.position.array[vi + 7];
            const vz2 = geometry.attributes.position.array[vi + 8];

            const v0 = new Vector3(vx0, vy0, vz0);
            const v1 = new Vector3(vx1, vy1, vz1);
            const v2 = new Vector3(vx2, vy2, vz2);

            const [uv0, uv1, uv2] = makeUVs(transformMatrix, uvBoundingBox, uvSize, v0, v1, v2);

            const idx0 = vi / 3;
            const idx1 = idx0 + 1;
            const idx2 = idx0 + 2;

            coords[2 * idx0] = uv0.x;
            coords[2 * idx0 + 1] = uv0.y;

            coords[2 * idx1] = uv1.x;
            coords[2 * idx1 + 1] = uv1.y;

            coords[2 * idx2] = uv2.x;
            coords[2 * idx2 + 1] = uv2.y;
        }
    }

    geometry.setAttribute('uv', new Float32BufferAttribute(coords, 2));
};

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
    const geometry = BufferGeometryUtils.mergeBufferGeometries(
        voxels.map((voxel) => createGeometry(voxel.x, voxel.y, voxel.z, determineVisibleFaces(voxel, min, max, set)))
    );
    applyBoxUV(geometry);
    return geometry;
};
