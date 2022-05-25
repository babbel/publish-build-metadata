const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

async function publishPayload(tableArn, payload, credentials = null) {
  const region = tableArn.split(':')[3];
  const table = tableArn.split('/')[1];
  const client = ddbClient(region, credentials);
  const docClient = DynamoDBDocumentClient.from(client);

  return docClient.send(new PutCommand({
    TableName: table,
    Item: payload,
  }));
}

function ddbClient(region, credentials = null) {
  let options = {
    region
  };

  if (credentials != null) {
    options.credentials = credentials;
  }

  const endpoint = process.env.AWS_ENDPOINT_URL;

  if (typeof endpoint == 'string' && endpoint !== '') {
    options.endpoint = endpoint
  }

  return new DynamoDBClient(options);
}

module.exports = {
  publishPayload,
  ddbClient,
};
