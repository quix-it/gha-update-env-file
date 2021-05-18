# Update env file

![unit-test](https://github.com/quix-it/gha-update-env-file/actions/workflows/test.yml/badge.svg)

This is a GitHub Actions action used for populating environment files with the format
```bash
VARIABLE=a_value
ANOTHER_VARIABLE=another_value
```

## Parameters

| Name | Required | Default value | Description |
| - | - | - | - |
| filename | `false` | .env | Path to the environment file |
| variables | `true` | | Names of the environment variables to add/update the file with, one per line |
| reset | `false` | `false` | Whether the file has to be reset or just updated with the new variables |
| blanks | `false` | allow | When `ignore` variables with blank values are not updated, when `remove` they are removed from file, when `allow` they get assigned a blank value. Default is `ignore`. |

## Usage

You can now consume the action by referencing the v1 branch

```yaml
uses: quix-it/gha-update-env-file@v1
with:
  filename: .env
  variables: |
    BACKEND_VERSION
    FRONTEND_VERSION
env:
  BACKEND_VERSION: 1.0.1
  FRONTEND_VERSION: 1.3.0
```

Environment variables can also be specified at job or workflow levels. For example:

```yaml
name: Sample workflow
on:
  push:
env:
  BACKEND_VERSION: 1.0.1
  FRONTEND_VERSION: 1.3.0

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: quix-it/gha-update-env-file@v1
        with:
          filename: global.env
          variables: |
            BACKEND_VERSION
            FRONTEND_VERSION
      - uses: quix-it/gha-update-env-file@v1
        with:
          filename: backend.env
          variables: BACKEND_VERSION
      - uses: quix-it/gha-update-env-file@v1
        with:
          filename: frontend.env
          variables: FRONTEND_VERSION
...
```
