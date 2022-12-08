# Onlybots THREE.js

THREE.js helpers for Onlybots, built on [onlybots-core](https://github.com/animavirtuality/onlybots-core).
This module can be used in vanilla THREE.js or @react-three/fiber.

<!-- toc -->

- [Usage](#usage)
- [Reference](#reference)
  * [`OnlyBotThree`](#onlybotthree)
  * [`OnlyBotThreeMesh`](#onlybotthreemesh)
  * [`OnlyBotMaterialPreset`](#onlybotmaterialpreset)

<!-- tocstop -->

## Usage

```
npm i @anima-virtuality/onlybots-three
```

## Reference

_Note: the docs below are not exhaustive, but should cover the most common use cases._

________________________________________________________________________________________________________________________
### `OnlyBotThree`

A helper class that generates THREE.js geometry and materials for an OnlyBot.

#### Properties

- `min: Point3`
  > The minimum point of the bounding box of the bot.  Note that voxels are cubes centered at coordinates with a l/w/h of 1, so the bot geometry will extend by 0.5 past the min.
- `max: Point3`
  > The maximum point of the bounding box of the bot.  Note that voxels are cubes centered at coordinates with a l/w/h of 1, so the bot geometry will extend by 0.5 past the max.
- `center: Point3`
  > The center of the bounding box of the bot.
- `anchor: Point3`
  > The anchor value of the bot.  See OnlyBot for more info.
- `meshes: OnlyBotThreeMesh[]`

#### Methods

- `static create(bot: OnlyBot, presets: OnlyBotMaterialPreset[]): OnlyBotThree`
  > Creates an OnlyBotThree instance from an OnlyBot instance and presets.
- `constructor(min: Point3, max: Point3, center: Point3, anchor: Point3, meshes: OnlyBotThreeMesh[])`
  > Creates a new `OnlyBotThree` instance.
- `dispose()`
  > Disposes the geometry and materials of the bot.
 
________________________________________________________________________________________________________________________
### `OnlyBotThreeMesh`

A class that holds the geometry and material for one material of an OnlyBot.

#### Properties

- `geometry: THREE.BufferGeometry`
  > Combined geometry for all voxels of this material.
- `material: THREE.MeshPhysicalMaterial`
  > The material for this mesh.
- `bloom: boolean`
  > Whether this mesh should be rendered with bloom.

#### Methods

- `dispose()`
  > Disposes the geometry and materials of the bot.

________________________________________________________________________________________________________________________
### `OnlyBotMaterialPreset`

A type that defines the specific properties for a material to look correct in THREE.js

The current list of preset can be found in [current-presets.json](https://github.com/animavirtuality/onlybots-three/blob/main/current-presets.json)