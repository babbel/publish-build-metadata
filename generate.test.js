const { setupEnv, testSha, testDatetime, testMessage } = require('./testdata/env');

beforeEach(() => {
  jest.resetModules();

  setupEnv();
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

test('when pull request event', async () => {
  // Mock GitHub context for pull request event
  jest.resetModules();
  
  // Mock the git module to avoid actual git commands
  jest.mock('./git', () => ({
    commitDatetime: jest.fn().mockResolvedValue('2023-04-02 10:00:00 +0000'),
    commitMessage: jest.fn().mockResolvedValue('PR commit message (pr123)')
  }));
  
  jest.mock('@actions/github', () => ({
    context: {
      eventName: 'pull_request',
      payload: {
        pull_request: {
          head: {
            sha: 'pr-head-sha-123',
            ref: 'feature/new-feature'
          }
        }
      },
      repo: {
        owner: 'babbel',
        repo: 'publish-build-metadata'
      }
    }
  }));

  const generatePayload = require('./generate');
  const payload = await generatePayload();

  expect(payload.commit_sha).toEqual('pr-head-sha-123');
  expect(payload.commit_branch).toEqual('feature/new-feature');
});

test('when pull request event with custom values', async () => {
  // Mock GitHub context for pull request event
  jest.resetModules();
  
  // Mock the git module to avoid actual git commands
  jest.mock('./git', () => ({
    commitDatetime: jest.fn().mockResolvedValue('2023-04-02 10:00:00 +0000'),
    commitMessage: jest.fn().mockResolvedValue('Custom commit message (custom456)')
  }));
  
  jest.mock('@actions/github', () => ({
    context: {
      eventName: 'pull_request',
      payload: {
        pull_request: {
          head: {
            sha: 'pr-head-sha-123',
            ref: 'feature/new-feature'
          }
        }
      },
      repo: {
        owner: 'babbel',
        repo: 'publish-build-metadata'
      }
    }
  }));

  const generatePayload = require('./generate');
  const customSha = 'custom-sha-456';
  const customBranch = 'custom/branch';
  const payload = await generatePayload(null, customSha, customBranch);

  // Custom values should take precedence over pull request values
  expect(payload.commit_sha).toEqual('custom-sha-456');
  expect(payload.commit_branch).toEqual('custom/branch');
});
