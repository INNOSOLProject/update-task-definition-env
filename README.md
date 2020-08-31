# update-task-definition-env
A GitHub action to update the environment variables
of an AWS task definition file.

## Sample Configuration
```yaml
jobs:
  publish-to-aws:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: INNOSOLProject/update-task-definition-env@v1
        with:
          variables: '{ "LOG_LEVEL": "debug", "FILE_PATH": "/tmp/bar" }'
          task-definition-file: main-deployment-task-def.json
```
