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
