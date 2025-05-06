const { setupEnv, setupPullRequestEnv, testSha, testDatetime, testMessage } = require('./testdata/env');

beforeEach(() => {
  jest.resetModules();

  setupEnv();

  // Mock the git module to avoid actual git commands
  jest.mock('./git', () => ({
    commitDatetime: jest.fn().mockResolvedValue('2019-12-17 15:29:36 +0100'),
    commitMessage: jest.fn().mockResolvedValue('Use header in README (890befe)')
  }));
});

test('default payload', async () => {
  const generatePayload = require('./generate');
  const payload = await generatePayload('publish.lambda');

  expect(payload.commit_branch).toEqual('main');
  expect(payload.commit_datetime).toEqual(testDatetime);
  expect(payload.commit_message).toEqual(testMessage);
  expect(payload.commit_sha).toEqual(testSha);
  expect(payload.repository).toEqual('babbel/publish-build-metadata');
  expect(payload.slices).toEqual(['publish.lambda']);
});

test('when missing slice', async () => {
  const generatePayload = require('./generate');
  const payload = await generatePayload(undefined);

  expect(payload.slices).toEqual([]);
});

test('when empty slices', async () => {
  const generatePayload = require('./generate');
  const payload = await generatePayload(' ,');

  expect(payload.slices).toEqual([]);
});

test('when multiple slices', async () => {
  const generatePayload = require('./generate');
  const payload = await generatePayload('publish.lambda,consumer.firehose,api');

  expect(payload.slices).toEqual(['publish.lambda', 'consumer.firehose', 'api']);
});

test('when custom sha', async () => {
  const generatePayload = require('./generate');
  const customSha = '5455d7267182f9585017d9f9e6c59a7798fb3c7e';

  expect(customSha).not.toEqual(testSha);

  const payload = await generatePayload(null, customSha);

  expect(payload.commit_sha).toEqual(customSha);
});

test('when custom branch', async () => {
  const generatePayload = require('./generate');
  const customBranch = 'feature/add-examples';
  const payload = await generatePayload(null, null, customBranch);

  expect(payload.commit_branch).toEqual(customBranch);
});

describe('when pull_request event', () => {
  beforeEach(() => {
    jest.resetModules();

    setupPullRequestEnv();

    // Mock the git module to avoid actual git commands
    jest.mock('./git', () => ({
      commitDatetime: jest.fn().mockResolvedValue('2023-04-02 10:00:00 +0000'),
      commitMessage: jest.fn().mockResolvedValue('Custom commit message (custom456)')
    }));
  });

  describe('and no custom values are provided', () => {
    test("it fetches the PR's source branch", async () => {
      const generatePayload = require('./generate');
      const payload = await generatePayload(null);

      // defined in the testdata/payloads/event.json
      expect(payload.commit_branch).toEqual("feature-branch");
    });

    test("it fetches the PR's head commit_sha", async () => {
      const generatePayload = require('./generate');
      const payload = await generatePayload(null);

      // defined in the testdata/payloads/event.json
      expect(payload.commit_sha).toEqual("feature-branch-sha123");
    });
  })

  describe('and custom values are provided', () => {
    // Custom values should take precedence over
    // the pull_request values in `github.context`.

    test('it uses the custom sha provided ', async () => {
      const generatePayload = require('./generate');
      const customSha = 'custom-sha-123';

      const payload = await generatePayload(null, customSha);

      expect(payload.commit_sha).toEqual(customSha);
    });

    test('it uses the custom branch provided', async () => {
      const generatePayload = require('./generate');
      const customBranch = 'custom-branch-name';

      const payload = await generatePayload(null, null, customBranch);

      expect(payload.commit_branch).toEqual(customBranch);
    });
  });
});


