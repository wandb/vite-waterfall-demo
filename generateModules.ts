import { v4 as uuidOriginal } from "uuid";
import { promises as fs } from "fs";

const uuid = () => uuidOriginal().replace(/-/g, "");

export async function generateStringConstantModule(localId: string) {
  const id = uuid();

  const dir = `./src/generated/stringConstants`;
  const path = `${dir}/${id}.ts`;

  let source = `export default '${id}';
`;

  source += `let uselessVariable: number = 0;
`;
  for (let i = 0; i < 1000; i++) {
    // just add a bunch of do-nothing code to increase the parse size
    source += `
if (true) {
  uselessVariable += 1
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
  if (false) { uselessVariable = 0 }
}
`;
  }
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path, source);

  return `import ${localId} from './stringConstants/${id}'`;
}

export async function generateWaterfall(
  localId: string = uuid(),
  constantsPerLevel = 20,
  nestedImportsPerLevel = 3,
  levels = 3
) {
  console.log(`Generating module ${localId}, w/ levels ${levels}`);
  const imports: string[] = [];
  const uses: string[] = [];

  // const imports =
  for (let i = 0; i < constantsPerLevel; i++) {
    const constantId = localId + "_stringConstant_" + uuid();
    imports.push(await generateStringConstantModule(constantId));
    uses.push(
      `console.log('local string constant ${constantId}:', ${constantId})`
    );
  }

  if (levels > 0) {
    for (let i = 0; i < nestedImportsPerLevel; i++) {
      const nestedId = "_nestedImport_" + uuid();
      imports.push(
        await generateWaterfall(
          nestedId,
          constantsPerLevel,
          nestedImportsPerLevel,
          levels - 1
        )
      );
    }
  }

  const source = [...imports, ...uses].join("\n");

  await fs.mkdir("./src/generated", { recursive: true });
  await fs.writeFile(`./src/generated/${localId}.ts`, source);

  return `import './${localId}'`;
}

generateWaterfall("root");
