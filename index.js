const core = require('@actions/core');
const DynamoDBClient = require('@aws-sdk/client-dynamodb');
const DynamoDBDocument = require('@aws-sdk/lib-dynamodb');
const generatePayload = require('./payload');

async function run() {
  try {
    core.info('Publishing build metadata ...');

    await publishPayload();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

async function publishPayload(){
  const credentials = {
    AccessKeyId: core.getInput('access_key_id'),
    SecretAccessKey: core.getInput('secret_access_key'),
  };

  const meta_table_arn = core.getInput('meta_table_arn');
  const region = meta_table_arn.split(':')[2];
  const table = meta_table_arn.split('/')[-1];
  const client = new DynamoDBClient({ region: region, credentials: credentials });
  const docClient = DynamoDBDocument.from(client);
  const payload = await generatePayload(core.getInput('slices'));

  await docClient.put({
    TableName: table,
    Item: payload,
  });
}
