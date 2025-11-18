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

test('when custom commit_message sha is provided', async () => {
  const generatePayload = require('./generate');

  // this sha is gotten from the commits in testdata/dummy_project.tar.gz.
  // it corresponds to the "Add description" commit message.
  const commitMessageSha = '6b5520fefdc66ee8c55f1429090306cbc82f6fb2';
  const payload = await generatePayload(null, null, null, commitMessageSha);

  // these are from the `github.context` defined in testdata/env.js
  expect(payload.commit_sha).toEqual('890befeef37b52a4d97c6f6d29fc836ec85308c4');
  expect(payload.commit_branch).toEqual('main');

  // while the commit_message and commit_datetime are from the provided `commitMessageSha` above.
  expect(payload.commit_message).toEqual('Add description (6b5520f)');
  expect(payload.commit_datetime).toEqual('2019-12-17 15:30:26 +0100');
});
