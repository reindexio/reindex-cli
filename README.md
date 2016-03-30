# reindex-cli

CLI interface for Reindex ([https://www.reindex.io](https://www.reindex.io))

```
npm install -g reindex-cli
reindex login
reindex schema-fetch
```

## Usage

##### `reindex login [url] [token]`

Login to Reindex using given Reindex URL and token. Prompts for url and token if
they are not provided. Credentials are stored in `.netrc` file in user's HOME
folder.

##### `reindex logout`

Clear stored credentials.

##### `reindex graphiql`

Opens [GraphiQL](https://github.com/graphql/graphiql) console for your
Reindex app in your browser.

##### `reindex schema-fetch [SCHEMA_FILE] [--force]`

Fetch Reindex JSON schema to `SCHEMA_FILE` file (`ReindexSchema.json` if not
provided).

If `--force` flag is not set, it will not run if schema file already exists.

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

## Options

##### `-u REINDEX_URL --url REINDEX_URL`

Your Reindex application host (eg `https://YOURAPP.myreindex.com`). Can be set
either with this flag or via `REINDEX_URL` environment variable. If you use
`reindex login`, this parameter overrides stored credentials.

##### `-t REINDEX_TOKEN --token REINDEX_TOKEN`

Your Reindex application authorization token. Can be set
either with this flag or via `REINDEX_TOKEN` environment variable. If you use
`reindex login`, this parameter overrides stored credentials.
