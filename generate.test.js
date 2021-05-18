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
  const payload = await generatePayload();

  expect(payload.slices).toEqual([]);
});

test('when multiple slices', async () => {
  const generatePayload = require('./generate');
  const payload = await generatePayload(['publish.lambda', 'consumer.firehose', 'api']);

  expect(payload.slices).toEqual(['publish.lambda', 'consumer.firehose', 'api']);
});
