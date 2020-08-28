import { updateTaskDefinitionFile } from '../src/update-task-definition';
import { file } from 'tmp-promise';
import fs from 'fs';

test('updates task def', async () => {
  const variables = {
    FOO: 'bar',
    ELASTICSEARCH_URL: 'localhost:9200',
  } as any;

  const { path, cleanup } = await file();

  const testData = await fs.promises.readFile('__tests__/sample-task-def.json');

  await fs.promises.writeFile(path, testData);

  await updateTaskDefinitionFile(path, variables);

  const resultDef = JSON.parse(await fs.promises.readFile(path, 'utf-8'));

  expect(resultDef.containerDefinitions.length).toEqual(3);

  resultDef.containerDefinitions.forEach((containerDef: any) => {
      expect(containerDef.environment.length).toEqual(2);
      containerDef.environment.forEach((envVar: any) => {
        expect(variables.hasOwnProperty(envVar.name)).toEqual(true);
        expect(envVar.value).toEqual(variables[envVar.name]);
      })
    })
  
  cleanup();
})