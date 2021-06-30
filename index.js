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

    const result = await publishPayload(
      core.getInput('access_key_id', { required: true }),
      core.getInput('secret_access_key', { required: true }),
      core.getInput('meta_table_arn', { required: true }),
      payload,
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
