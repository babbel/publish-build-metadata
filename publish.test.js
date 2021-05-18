const { CreateTableCommand, DeleteTableCommand, DescribeTableCommand } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand } = require('@aws-sdk/lib-dynamodb');
const { testSha, testDatetime, testMessage } = require('./testdata/env');
const { publishPayload, ddbClient } = require('./publish');

const TABLE_NAME = 'metadata';
const TABLE_ARN = `arn:aws:dynamodb:local:000000000000:table/${TABLE_NAME}`;
const ACCESS_KEY_ID = 'aws-access-key-id';
const SECRET_ACCESS_KEY = 'aws-secret-access-key';
const REGION = 'local';
const PAYLOAD = {
  commit_branch: 'main',
  commit_datetime: testDatetime,
  commit_message: testMessage,
  commit_sha: testSha,
  repository: 'babbel/publish-build-metadata',
  slices: ['api', 'consumer'],
  ttl: 1000,
};

beforeEach(async () => {
  // setup dynamodb endpoint
  process.env.AWS_ENDPOINT_URL = 'http://localhost:8000';

  // setup inputs
  await createDynamoDBTable();
});


afterEach(async () => {
  await deleteDynamoDBTable();
});


test('wat', async () => {
  const publishResult = await publishPayload(ACCESS_KEY_ID, SECRET_ACCESS_KEY, TABLE_ARN, PAYLOAD);

  expect(publishResult['$metadata'].httpStatusCode).toEqual(200);

  const client = DynamoDBDocumentClient.from(ddbClient(ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION));
  const result = await client.send(new GetCommand(
    {
      TableName: TABLE_NAME,
      Key: {
        repository: PAYLOAD.repository,
        commit_sha: PAYLOAD.commit_sha,
      }
    }
  ));

  expect(result.Item).toEqual(PAYLOAD);
});


//
// Test Helpers
//
async function createDynamoDBTable() {
  const params = {
    TableName: TABLE_NAME,
    KeySchema: [
      {
        AttributeName: 'repository',
        KeyType: 'HASH',
      },
      {
        AttributeName: 'commit_sha',
        KeyType: 'RANGE',
      },
    ],
    AttributeDefinitions: [
      {
        AttributeName: 'repository',
        AttributeType: 'S',
      },
      {
        AttributeName: 'commit_sha',
        AttributeType: 'S',
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
    StreamSpecification: {
      StreamEnabled: false,
    },
  };

  const client = ddbClient(ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION);

  try {
    await client.send(new CreateTableCommand(params));
  } catch(err) {
    if (err == "ResourceInUseException") {
      await deleteDynamoDBTable(client);
      await createDynamoDBTable(client);
    }
  }

  const describeParams = {
    TableName: TABLE_NAME
  };

  return await client.send(new DescribeTableCommand(describeParams));
}

async function deleteDynamoDBTable() {
  const params = {
    TableName: TABLE_NAME
  };

  const client = ddbClient(ACCESS_KEY_ID, SECRET_ACCESS_KEY, REGION);

  return await client.send(new DeleteTableCommand(params));
}
