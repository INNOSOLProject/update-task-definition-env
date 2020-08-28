import fs from 'fs'
import path from 'path'

interface TaskDefEnvVar {
  name: string
  value: string
}

export async function updateTaskDefinitionFile(
  file: string,
  variables: Record<string, unknown>,
  directory = process.env.GITHUB_WORKSPACE as string
): Promise<void> {
  const definition = JSON.parse(
    await fs.promises.readFile(path.join(directory, file), 'utf-8')
  )
  const updatedDefinition = updateTaskDefinition(definition, variables)
  return fs.promises.writeFile(
    path.join(directory, file),
    JSON.stringify(updatedDefinition)
  )
}

function updateTaskDefinition(
  definition: {containerDefinitions: {environment: TaskDefEnvVar[]}[]},
  variables: Record<string, unknown>
): Record<string, unknown> {
  for (const containerDef of definition.containerDefinitions) {
    const variablesCopy = JSON.parse(JSON.stringify(variables))
    if (containerDef.hasOwnProperty('environment')) {
      for (const envVar of containerDef.environment) {
        if (variablesCopy.hasOwnProperty(envVar.name)) {
          envVar.value = variablesCopy[envVar.name]
          delete variablesCopy[envVar.name]
        }
      }
    }
    containerDef.environment = (containerDef.environment || []).concat(
      Object.entries(variablesCopy).map(([name, value]) => {
        return {name, value} as TaskDefEnvVar
      })
    )
  }

  return definition
}
