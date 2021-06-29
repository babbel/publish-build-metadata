# publish-build-metadata

Internal Babbel tool to collect build artifacts metadata.

## Usage

In your project workflow, after build artifact was published.

All `AWS_` secrets should be already set and ready to use.

### Standalone project example

```yaml
jobs:
  name_of_the_job:
    #
    # ...
    #
    steps:
      #
      # ... build & publish the artifact
      #
      - uses: babbel/publish-build-metadata@v1
        with:
          access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          meta_table_arn: ${{ secrets.AWS_META_TABLE_ARN }}
```

### Microverse example, all slices at once

```yaml
jobs:
  name_of_the_job:
    #
    # ...
    #
    steps:
      #
      # ... build & publish the artifact
      #
      - uses: babbel/publish-build-metadata@v1
        with:
          access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          meta_table_arn: ${{ secrets.AWS_META_TABLE_ARN }}
          slices: 'api, consumer.kinesis, consumer.firehose'
```

### Microverse example, one slice at a time

For example in case you have jobs matrix.

```yaml
jobs:
  name_of_the_job:
    #
    # ...
    #
    steps:
      #
      # ... build & publish the artifact
      #
      - uses: babbel/publish-build-metadata@v1
        with:
          access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          meta_table_arn: ${{ secrets.AWS_META_TABLE_ARN }}
          slices: 'api' # or ${{ matrix.function_name }}
```

### When custom Commit SHA

Sometimes you might trigger an automatic build which fetches a different branch. In such case `GITHUB_SHA` differs from actual Commit SHA that the build is working on.

In such case you can override `GITHUB_SHA` by passing extra parameter:

```yaml
jobs:
  name_of_the_job:
    #
    # ...
    #
    steps:
      #
      # ... build & publish the artifact
      #
      - uses: babbel/publish-build-metadata@v1
        with:
          access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          meta_table_arn: ${{ secrets.AWS_META_TABLE_ARN }}
          sha: ${{ env.MY_CUSTOM_COMMIT_SHA }}
```

Usually with above it will be handy to be able to specify the branch name as well, so the full example would look like:

```yaml
jobs:
  name_of_the_job:
    #
    # ...
    #
    steps:
      #
      # ... build & publish the artifact
      #
      - uses: babbel/publish-build-metadata@v1
        with:
          access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          meta_table_arn: ${{ secrets.AWS_META_TABLE_ARN }}
          sha: ${{ env.MY_CUSTOM_COMMIT_SHA }}
          branch: ${{ env.MY_CUSTOM_BRANCH }}
```

## Contribute

Prep the project, it runs against nodejs v12, when using `asdf-vm` just hit `asdf install`. Then install the packages

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
