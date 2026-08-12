# Changelog
All notable changes to this project will be documented in this file. See [conventional commits](https://www.conventionalcommits.org/) for commit guidelines.

- - -
## [0.7.0](https://github.com/irabeny89/js-html-view/compare/497ffa31709ea3e0783c6448262ccbb69864bfa8..0.7.0) - 2026-08-12
#### Features
- update CLI flags, improve debug logging, move scripts, and finalize versioning - ([b0816a0](https://github.com/irabeny89/js-html-view/commit/b0816a07a3db043b7dfa41997b108f2465be47ec)) - Irabeny
- add version, update, and uninstall CLI commands with refactored logic in utility modules - ([497ffa3](https://github.com/irabeny89/js-html-view/commit/497ffa31709ea3e0783c6448262ccbb69864bfa8)) - Irabeny

- - -

## [0.6.0](https://github.com/irabeny89/js-html-view/compare/2841f9509bd91567e44cf33399faa5d622531ce6..0.6.0) - 2026-08-12
#### Features
- generate and use detailed changelog file for GitHub release body - ([2841f95](https://github.com/irabeny89/js-html-view/commit/2841f9509bd91567e44cf33399faa5d622531ce6)) - Irabeny

- - -

## [0.5.0](https://github.com/irabeny89/js-html-view/compare/b4bf25505092ab25f529cbee0f8b2e8f782ae8cc..0.5.0) - 2026-08-12
#### Features
- include conventional commits log in GitHub release body - ([b4bf255](https://github.com/irabeny89/js-html-view/commit/b4bf25505092ab25f529cbee0f8b2e8f782ae8cc)) - Irabeny

- - -

## [0.4.0](https://github.com/irabeny89/js-html-view/compare/f7552dca62745e0ba9160c5946e00fd9148e15d6..0.4.0) - 2026-08-12
#### Build system
- run build script before updating Homebrew formula in publish workflow - ([26f454d](https://github.com/irabeny89/js-html-view/commit/26f454da4db925239c892317ea23199bd7be0aba)) - Irabeny
#### Documentation
- remove manual cURL installation instructions from README - ([733c783](https://github.com/irabeny89/js-html-view/commit/733c7835728e7b3fe28c0f3fdbf497e4b19a4cd4)) - Irabeny
#### Features
- add shell-based installation/uninstallation scripts and implement auto-update notifications in CLI - ([df6a366](https://github.com/irabeny89/js-html-view/commit/df6a366f75e7a54b050feeb4651b188ab437ccd6)) - Irabeny
#### Miscellaneous Chores
- bump softprops/action-gh-release to v3 in publish workflow - ([7ce62da](https://github.com/irabeny89/js-html-view/commit/7ce62daefdf0341891aebf74abf97e1457a3da5d)) - Irabeny
- move build step before packaging in publish workflow - ([1df01bd](https://github.com/irabeny89/js-html-view/commit/1df01bd3cba38e60b8fb9a79d5303188c5ce4a6c)) - Irabeny
#### Refactoring
- transition from compiled binaries to a Node.js-based distribution model with release archiving - ([f7552dc](https://github.com/irabeny89/js-html-view/commit/f7552dca62745e0ba9160c5946e00fd9148e15d6)) - Irabeny

- - -

## [0.3.0](https://github.com/irabeny89/js-html-view/compare/6ea84fef6502bf2dacf21727c95be505ea9ea599..0.3.0) - 2026-08-12
#### Features
- complete end-to-end binary compilation and homebrew tap automation - ([6ea84fe](https://github.com/irabeny89/js-html-view/commit/6ea84fef6502bf2dacf21727c95be505ea9ea599)) - Irabeny
#### Refactoring
- remove JSR support, simplify build scripts, and update documentation for binary distribution - ([c32dfbd](https://github.com/irabeny89/js-html-view/commit/c32dfbd9558dd607221e1cfa163ab400f2b91ff2)) - Irabeny

- - -

## [0.2.1](https://github.com/irabeny89/js-html-view/compare/af8df3d4ae8e5ebd4d7f839db9f218d96c002952..0.2.1) - 2026-08-11
#### Bug Fixes
- adjust jsr type comment injection to keep shebang on line 1 - ([af8df3d](https://github.com/irabeny89/js-html-view/commit/af8df3d4ae8e5ebd4d7f839db9f218d96c002952)) - Irabeny

- - -

## [0.2.0](https://github.com/irabeny89/js-html-view/compare/5147722be9f764336c6d7416179a91874ff005aa..0.2.0) - 2026-08-11
#### Documentation
- Merge branch 'main' of github.com:irabeny89/js-html-view - ([3bbefe2](https://github.com/irabeny89/js-html-view/commit/3bbefe224992823101d74a6205a6d6dd6cca113f)) - Irabeny
#### Features
- trigger first automated package release - ([37130fb](https://github.com/irabeny89/js-html-view/commit/37130fbf03ca2722b60df7938f2f0ddf8adc98b8)) - Irabeny
#### Miscellaneous Chores
- update JSR publish include configuration for explicit file exports - ([4606363](https://github.com/irabeny89/js-html-view/commit/4606363e6063fc65facc926213c0a9ea46a58856)) - Irabeny
- add project license, update metadata, refine build hooks, and upgrade publish workflow actions - ([5147722](https://github.com/irabeny89/js-html-view/commit/5147722be9f764336c6d7416179a91874ff005aa)) - Irabeny

- - -

## [0.1.0](https://github.com/irabeny89/js-html-view/compare/b5df5b679e85cc0996b01179c061f74d9f3e4232..0.1.0) - 2026-08-11
#### Continuous Integration
- update release workflow authentication and refine versioning hooks in cog.toml - ([2eca025](https://github.com/irabeny89/js-html-view/commit/2eca02545621ccabe2aec3e93c612e4bf01dd9f1)) - Irabeny
#### Features
- initialize project structure with CLI template renderer, automated CI/CD, and Git hooks - ([b5df5b6](https://github.com/irabeny89/js-html-view/commit/b5df5b679e85cc0996b01179c061f74d9f3e4232)) - Irabeny
#### Miscellaneous Chores
- restructure cog.toml configuration and update author metadata - ([75248e2](https://github.com/irabeny89/js-html-view/commit/75248e21a2a9c33034a6a1b313920afb04aa1f6a)) - Irabeny

- - -

Changelog generated by [cocogitto](https://github.com/cocogitto/cocogitto).