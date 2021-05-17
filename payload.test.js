const OLD_ENV = process.env;

beforeEach(() => {
  jest.resetModules();

  process.env = { ...OLD_ENV };

  process.env.GITHUB_REPOSITORY = 'babbel/publish-build-metadata';
  process.env.GITHUB_REF = 'refs/heads/main';
  process.env.GITHUB_SHA = '0bfd7892d984410861327506b001edb360665d39';
});

afterAll(() => {
  process.env = OLD_ENV;
});

test('default payload', async () => {
  const generatePayload = require('./payload');
  const payload = await generatePayload('publish.lambda');

  expect(payload.commit_branch).toEqual('main');
  expect(payload.commit_datetime).toEqual('2021-05-07 17:27:30 +0200');
  expect(payload.commit_message).toEqual('Bootstrap the action (0bfd789)');
  expect(payload.commit_sha).toEqual('0bfd7892d984410861327506b001edb360665d39');
  expect(payload.repository).toEqual('babbel/publish-build-metadata');
  expect(payload.slices).toEqual(['publish.lambda']);
});

test('when missing slice', async () => {
  const generatePayload = require('./payload');
  const payload = await generatePayload();

  expect(payload.slices).toEqual([]);
});

test('when multiple slices', async () => {
  const generatePayload = require('./payload');
  const payload = await generatePayload(['publish.lambda', 'consumer.firehose', 'api']);

  expect(payload.slices).toEqual(['publish.lambda', 'consumer.firehose', 'api']);
});
