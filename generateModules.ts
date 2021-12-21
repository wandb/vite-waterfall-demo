import { v4 as uuid } from "uuid";
import { promises as fs } from "fs";

export async function generateStringConstantModule(localId: string) {
  console.log(`generating constant ${localId}`);
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
  localId: string = "root",
  constantsPerLevel = 5,
  nestedImportsPerLevel = 3,
  levels = 3
) {
  console.log(`Generating module ${localId}, w/ levels ${levels}`);
  const imports: string[] = [];
  const uses: string[] = [];

  // const imports =
  for (let i = 0; i < constantsPerLevel; i++) {
    const constantId = localId + "_stringConstant_" + i.toString();
    imports.push(await generateStringConstantModule(constantId));
    uses.push(
      `console.log('local string constant ${constantId}:', ${constantId})`
    );
  }

  for (let i = 0; i < nestedImportsPerLevel; i++) {
    const nestedId = "_nestedImport_" + i.toString();
    imports.push(
      await generateWaterfall(
        nestedId,
        constantsPerLevel,
        nestedImportsPerLevel,
        levels - 1
      )
    );
  }

  const source = [...imports, ...uses].join("\n");

  await fs.mkdir("./src/generated", { recursive: true });
  await fs.writeFile(`./src/generated/${localId}.ts`, source);

  return `import './${localId}'`;
}

generateWaterfall();
