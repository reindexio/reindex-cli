# reindex-cli

CLI interface for Reindex ([https://www.reindex.io](https://www.reindex.io))

```
npm install -g reindex-cli
```

`REINDEX_URL` and `REINDEX_TOKEN` must be provided either via parameters or
via enviroment.

```
REINDEX_URL="https://MYREINDEXAPP.myreindex.com" REINDEX_TOKEN="TOKEN" reindex
```

or

```
reindex -u https://MYREINDEXAPP.myreindex.com -t TOKEN
```

## Options

##### `-u REINDEX_URL --url REINDEX_URL`

Your Reindex application host (eg `https://YOURAPP.myreindex.com`). Can be set
either with this flag or via `REINDEX_URL` enviroment variable.

##### `-t REINDEX_TOKEN --token REINDEX_TOKEN`

Your Reindex application authorization token. Can be set
either with this flag or via `REINDEX_TOKEN` enviroment variable.

## Usage

##### `reindex graphiql`

Opens [GraphiQL](https://github.com/graphql/graphiql) console for your
Reindex app in your browser.

##### `reindex schema-fetch [SCHEMA_FILE]`

Fetch Reindex JSON schema to `SCHEMA_FILE` file (`ReindexSchema.json` if not
provided). Requires the file to not exist.

##### `reindex schema-push [SCHEMA_FILE] [--dry-run --force]`

Push JSON schema from `SCHEMA_FILE` (defaults to `ReindexSchema.json`)
to Reindex API to perform a migration. Validates the schema and runs the
migration, if it only includes safe operations.

If the migration includes destructive operations, `--force` flag must be used
to run it.

If `--dry-run` flag is given, the command only validates the schema
and displays the migration without running.

##### `reindex schema-relay OUTPUT`

Get Relay compatible GraphQL schema from Reindex API at `HOST`. `OUTPUT` is a
file name. If output is specified, result is written into it. Otherwise result
is written to stdout.
