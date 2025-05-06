# publish-build-metadata

Internal Babbel tool to collect build artifacts metadata.

## Usage

In your project workflow, after build artifact was published.

All `AWS_` secrets should be already set and ready to use.

### Standalone project example

```yaml
permissions:
  contents: read
  id-token: write

jobs:
  name_of_the_job:
    #
    # ...
    #
    steps:
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          role-to-assume: ${{ vars.AWS_IAM_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}
      #
      # ... build & publish the artifact
      #
      - uses: babbel/publish-build-metadata@v1
        with:
          meta_table_arn: ${{ vars.AWS_META_TABLE_ARN }}
```

### Microverse example, all slices at once

```yaml
permissions:
  contents: read
  id-token: write

jobs:
  name_of_the_job:
    #
    # ...
    #
    steps:
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          role-to-assume: ${{ vars.AWS_IAM_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}
      #
      # ... build & publish the artifact
      #
      - uses: babbel/publish-build-metadata@v1
        with:
          meta_table_arn: ${{ vars.AWS_META_TABLE_ARN }}
          slices: 'api, consumer.kinesis, consumer.firehose'
```

### Microverse example, one slice at a time

For example in case you have jobs matrix.

```yaml
permissions:
  contents: read
  id-token: write

jobs:
  name_of_the_job:
    #
    # ...
    #
    steps:
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          role-to-assume: ${{ vars.AWS_IAM_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}
      #
      # ... build & publish the artifact
      #
      - uses: babbel/publish-build-metadata@v1
        with:
          meta_table_arn: ${{ vars.AWS_META_TABLE_ARN }}
          slices: 'api' # or ${{ matrix.function_name }}
```

### Pull Request Events

When triggered by a pull request event, `GITHUB_REF` and `GITHUB_SHA` point to the merge branch and merge commit SHA respectively (by default), not the PR's source branch and head commit SHA.
See this [issue](https://github.com/orgs/community/discussions/26325) for more details.

In such cases, the action automatically uses:
- The PR's head commit SHA instead of the merge commit SHA.
- The PR's source branch name instead of the merge branch.
This ensures consistent and accurate metadata for pull request builds.

### Custom Commit SHA and Branch

You can override both the commit SHA and branch name, if needed. This is useful when:
- Triggering builds that fetch from a different branch
- Working with custom CI/CD workflows
- Needing to override the automatic pull request handling

In such cases, `GITHUB_SHA` differs from the actual Commit SHA that the build is working on.
Therefore, you can override `GITHUB_SHA` by passing extra parameter:

```yaml
permissions:
  contents: read
  id-token: write

jobs:
  name_of_the_job:
    #
    # ...
    #
    steps:
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          role-to-assume: ${{ vars.AWS_IAM_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}
      #
      # ... build & publish the artifact
      #
      - uses: babbel/publish-build-metadata@v1
        with:
          meta_table_arn: ${{ vars.AWS_META_TABLE_ARN }}
          sha: ${{ env.MY_CUSTOM_COMMIT_SHA }}
```

Usually, with the above, it will be handy to be able to specify the branch name as well, so the full example would look like:

```yaml
permissions:
  contents: read
  id-token: write

jobs:
  name_of_the_job:
    #
    # ...
    #
    steps:
      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v1
        with:
          role-to-assume: ${{ vars.AWS_IAM_ROLE_ARN }}
          aws-region: ${{ vars.AWS_REGION }}
      #
      # ... build & publish the artifact
      #
      - uses: babbel/publish-build-metadata@v1
        with:
          meta_table_arn: ${{ vars.AWS_META_TABLE_ARN }}
          sha: ${{ env.MY_CUSTOM_COMMIT_SHA }}
          branch: ${{ env.MY_CUSTOM_BRANCH }}
```

## Contribute

Prep the project, it runs against nodejs v20, when using `asdf-vm` just hit `asdf install`. Then install the packages

```
npm ci
```

Run the tests

```
make test
```

Or better run the whole build all the time, this way you won't forget to run it before commit

```
make build
```
