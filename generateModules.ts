import { v4 as uuid } from 'uuid';
import { promises as fs } from 'fs';

export async function generateStringConstantModule(localId: string) {
  const id = uuid();

  const dir = `./src/generated/stringConstants`;
  const path = `${dir}/${id}.ts`;

  const source = `export default '${id}';
`;
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path, source);

  return `import ${localId} from './src/generated/stringConstants/${id}`;
}

export async function generateWaterfall(
  localId: string = 'root',
  constantsPerLevel = 100,
  nestedImportsPerLevel = 3,
  levels = 10
) {
  const imports: string[] = [];
  const uses: string[] = [];

  // const imports =
  for (let i = 0; i < constantsPerLevel; i++) {
    const localId = 'stringConstant' + i.toString();
    imports.push(await generateStringConstantModule(localId));
    uses.push(`console.log('local string constant ${localId}:', ${localId})`);
  }

  for (let i = 0; i < nestedImportsPerLevel; i++) {
    const localId = 'nestedImport' + i.toString();
    imports.push(
      await generateWaterfall(
        localId,
        constantsPerLevel,
        nestedImportsPerLevel,
        levels - 1
      )
    );
  }

  const source = [...imports, ...uses].join('\n');

  await fs.mkdir('./src/generated', { recursive: true });
  await fs.writeFile(`./src/generated/${localId}.ts`, source);

  return `import './${localId}'`;
}

generateWaterfall();
