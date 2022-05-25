const core = require('@actions/core');
const generatePayload = require('./generate');
const { publishPayload } = require('./publish');

async function run() {
  try {
    core.info('Publishing build metadata ...');

    const payload = await generatePayload(
      core.getInput('slices'),
      core.getInput('sha'),
      core.getInput('branch'),
    );

    const accessKeyId = core.getInput('access_key_id');
    const secretAccessKey = core.getInput('secret_access_key');
    const credentials = accessKeyId && secretAccessKey
      ? { accessKeyId, secretAccessKey }
      : null;

    const result = await publishPayload(
      core.getInput('meta_table_arn', { required: true }),
      payload,
      credentials,
    );

    if (result['$metadata'].httpStatusCode !== 200) {
      return core.setFailed(result);
    }

    if (process.env.DEBUG !== 'true') {
      return;
    }

    core.debug(result.Attributes);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
