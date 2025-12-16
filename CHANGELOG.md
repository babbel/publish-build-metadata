# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.15.0] - 2025-12-16

### Changed
- Bump @octokit/request from 8.1.6 to 8.4.1

## [1.14.0] - 2025-12-16

### Changed
- Bump @octokit/request-error from 5.0.1 to 5.1.1

## [1.13.0] - 2025-12-16

### Changed
- Bump @octokit/plugin-paginate-rest from 9.1.5 to 9.2.2

## [1.12.0] - 2025-12-16

### Changed
- Bump undici from 5.28.2 to 5.29.0

## [1.11.0] - 2025-12-16

### Changed
- Bump js-yaml from 3.14.1 to 3.14.2

## [1.10.0] - 2025-12-16

### Changed
- Bump braces from 3.0.2 to 3.0.3

## [1.9.0] - 2025-12-16

### Changed
- Bump actions/checkout to v5

## [1.8.0] - 2025-12-04

### Added
- Ability to provide custom commit_message sha. This is useful for PR-triggered workflows where Github generates an adhoc PR merge branch (e.g refs/pull/123/merge) and merge commit.

## [1.7.0] - 2024-05-10

### Added
- Introduced cloudposse/github-action-major-release-tagger Github action to generate or update v<major-release> tags every time a new release is published.

## [1.6.0] - 2024-03-22

### Changed
- Bumps node from 16 to 20

## [1.2.0] - 2022-05-26

### Changed
- Make inputs for AWS credentials optional, allowing the AWS SDK to find the credentials via its built-in auto-discovery.

## [1.1.0] - 2021-06-28
### Added
- Ability to provide custom commit sha. Useful when build is based on different commit sha that triggered the build.
- Ability to provide custom branch name.

### Changed
- Updated dependencies

## [1.0.0] - 2021-05-19
Initial release
