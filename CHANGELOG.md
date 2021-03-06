# Changelog


## [2.1.0](https://github.com/supercharge/cedar/compare/v2.0.0...v2.1.0) - 2022-xx-xx

### Updated
- bump dependencies


## [2.0.0](https://github.com/supercharge/cedar/compare/v1.3.2...v2.0.0) - 2022-04-15

### Updated
- bump dependencies

### Breaking Changes
- require Node.js v14, drop support for Node.js v12


## [1.3.2](https://github.com/supercharge/cedar/compare/v1.3.1...v1.3.2) - 2022-04-15

### Updated
- bump dependencies


## [1.3.1](https://github.com/supercharge/cedar/compare/v1.3.0...v1.3.1) - 2022-03-01

### Updated
- bump dependencies


## [1.3.0](https://github.com/supercharge/cedar/compare/v1.2.0...v1.3.0) - 2021-10-11

### Added
- support command constructors in the `application.add(CommandCtor)` method

### Updated
- bump dependencies
- bump versions in the used GitHub Actions packages
- update test to avoid printing help output to the console


## [1.2.0](https://github.com/supercharge/cedar/compare/v1.1.0...v1.2.0) - 2021-07-29

### Added
- the `@supercharge/console-io` update brings us two new IO methods: `.spinner()` and `withSpinner(message, callback)`

### Updated
- bump dependencies


## [1.1.0](https://github.com/supercharge/cedar/compare/v1.0.0...v1.1.0) - 2021-07-27

### Added
- validate required options and fail if required options are missing
- create `ValidationError` class
- throw validation errors for invalid input
- add `.shortcut(value: string)` method to the option builder removing the plural method (`shortcuts`) or array for single character shortcuts

### Updated
- bump dependencies
- print input binding and validation error message without stack
- use `any` as the return type when retrieving an argument or option in a command
- use `isMissing` method instead of the deprecated `missing` in the arguments map
- use `any` as the value type for arguments and options (instead of unknown)


## 1.0.0 - 2021-06-12

### Added
- `1.0.0` release 🚀 🎉
