import * as core from '@actions/core'
import { updateTaskDefinitionFile } from './update-task-definition';

async function run(): Promise<void> {
  try {
    const variables = JSON.parse(core.getInput('variables'));
    const file = core.getInput('task-definition-file');

    await updateTaskDefinitionFile(file, variables);
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
