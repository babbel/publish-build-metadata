const {commitDatetime, commitMessage} = require('./git');
const { setupEnv, testSha, testDatetime, testMessage } = require('./testdata/env');

beforeEach(() => {
  setupEnv();
})

test("fetch correct datetime", async () => {
  const datetime = await commitDatetime(testSha);

  expect(datetime).toEqual(testDatetime);
});

test("fetch correct message", async () => {
  const message = await commitMessage(testSha);

  expect(message).toEqual(testMessage);
});
