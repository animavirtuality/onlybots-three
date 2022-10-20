# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project (loosely) adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Updated
* onlybots-core

## [1.5.0](https://github.com/animavirtuality/onlybots-three/compare/1.4.0...1.5.0) - October 17, 2022
### Added
* `OnlyBotThree.anchor`

## [1.4.0](https://github.com/animavirtuality/onlybots-three/compare/1.3.1...1.4.0) - October 13, 2022
### Added
* `OnlyBotThree.dispose()` method to dispose of the bot's underlying three.js resources.

## [1.3.1](https://github.com/animavirtuality/onlybots-three/compare/1.3.0...1.3.1) - October 7, 2022
### Updated
* onlybots-core

## [1.3.0](https://github.com/animavirtuality/onlybots-three/compare/1.2.0...1.3.0) - October 7, 2022
### Updated
* onlybots-core

## [1.2.0](https://github.com/animavirtuality/onlybots-three/compare/1.1.0...1.2.0) - October 4, 2022
### Updated
* Updated three.js to `0.145.0`

## [1.1.0](https://github.com/animavirtuality/onlybots-three/compare/1.0.2...1.1.0) - October 4, 2022
### Changed
* Downgraded three.js to `0.144.0` because `postprocessing` has not updated yet.

## [1.0.2](https://github.com/animavirtuality/onlybots-three/compare/1.0.1...1.0.2) - October 4, 2022
### Fixed
* Error when material contains no voxels

## [1.0.1](https://github.com/animavirtuality/onlybots-three/compare/1.0.0...1.0.1) - October 4, 2022
### Fixed
* Make min/max z more intuitive (un-swap)

## [1.0.0](https://github.com/animavirtuality/onlybots-three/compare/0.3.1...1.0.0) - October 4, 2022
### Changed
* Expose API through single class `OnlyBotThree`

## [0.3.1](https://github.com/animavirtuality/onlybots-three/compare/0.3.0...0.3.1) - October 4, 2022
### Fixed
* Swap min and max when making z coordinates negative

## [0.3.0](https://github.com/animavirtuality/onlybots-three/compare/0.2.1...0.3.0) - October 4, 2022
### Fixed
* Prevent `-0` when making z coordinates negative
### Added
* Return a set of all points in the bot for determining adjacency
### Updated
* `onlybots-core`

## [0.2.1](https://github.com/animavirtuality/onlybots-three/compare/0.2.0...0.2.1) - October 3, 2022
### Fixed
* `BufferGeometryUtils` import

## [0.2.0](https://github.com/animavirtuality/onlybots-three/compare/0.1.1...0.2.0) - October 3, 2022
### Changed
* Renamed function

## [0.1.1](https://github.com/animavirtuality/onlybots-three/compare/0.1.0...0.1.1) - October 3, 2022
### Fixed
* Removed postinstall

## [0.1.0](https://github.com/animavirtuality/onlybots-three/compare/0.0.1...0.1.0) - October 3, 2022
### Added
* Initial code