import fs from 'fs';
import path from 'path';

interface TaskDefEnvVar {
  name: string,
  value: string,
}

const workspace: string = process.env.GITHUB_WORKSPACE as string || '';

export async function updateTaskDefinitionFile(file: string, variables: any): Promise<void> {
  const definition = JSON.parse(await readFile(file));
  const updatedDefinition = updateTaskDefinition(definition, variables);
  return writeFile(file, JSON.stringify(updatedDefinition));
}

function updateTaskDefinition(definition: any, variables: any): any {
  definition.containerDefinitions.forEach((containerDef: { environment: Array<TaskDefEnvVar> }) => {
    let variablesCopy = JSON.parse(JSON.stringify(variables));
    if (containerDef.hasOwnProperty('environment')) {
      containerDef.environment
        .forEach(envVar => {
          if (variablesCopy.hasOwnProperty(envVar.name)) {
            envVar.value = variablesCopy[envVar.name];
            delete variablesCopy[envVar.name];
          }
        });
    }
    containerDef.environment = (containerDef.environment || []).concat(Object.entries(variablesCopy)
      .map(([name, value]) => {
        return { name, value, } as TaskDefEnvVar;
      }));
  });

  return definition;
}

async function readFile(file: string): Promise<string> {
  return fs.promises.readFile(path.join(workspace, file), 'utf-8');
}

async function writeFile(file: string, contents: string): Promise<void> {
  return fs.promises.writeFile(path.join(workspace, file), contents);
}
