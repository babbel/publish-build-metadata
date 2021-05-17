const {commitDatetime, commitMessage} = require('./git');

const COMMIT_SHA = '0bfd7892d984410861327506b001edb360665d39';

test("fetch correct datetime", async () => {
  const datetime = await commitDatetime(COMMIT_SHA);

  expect(datetime).toEqual('2021-05-07 17:27:30 +0200');
});

test("fetch correct message", async () => {
  const message = await commitMessage(COMMIT_SHA);

  expect(message).toEqual('Bootstrap the action (0bfd789)');
});
