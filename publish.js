const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

async function publishPayload(accessKeyId, secretAccessKey, tableArn, payload){
  const region = tableArn.split(':')[3];
  const table = tableArn.split('/')[1];
  const client = ddbClient(accessKeyId, secretAccessKey, region);
  const docClient = DynamoDBDocumentClient.from(client);

  return docClient.send(new PutCommand({
    TableName: table,
    Item: payload,
  }));
}

function ddbClient(accessKeyId, secretAccessKey, region) {
  let options = {
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    }
  };

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
