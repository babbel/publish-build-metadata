# publish-build-metadata

Internal Babbel tool to collects build artifacts metadata.

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
      - name: Publish build artifact metadata
        uses: babbel/publish-build-metadata@v1
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
      - name: Publish build artifact metadata
        uses: babbel/publish-build-metadata@v1
        with:
          access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          meta_table_arn: ${{ secrets.AWS_META_TABLE_ARN }}
          with: 'api, consumer.kinesis, consumer.firehose'
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
      - name: Publish build artifact metadata
        uses: babbel/publish-build-metadata@v1
        with:
          access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          meta_table_arn: ${{ secrets.AWS_META_TABLE_ARN }}
          with: 'api' # or ${{ matrix.function_name }}
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
