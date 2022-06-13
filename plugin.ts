import * as fs from 'fs/promises';

const dir = __dirname;

const devServiceWorkerPlugin = () => {
  const changesAwaitingAck = {};
  return {
    name: 'vite-dev-server-sw',
    apply: 'serve',
    enforce: 'pre',
    resolveId(id) {
      return id === '/vite-sw-dev-server.js'
        ? id.replace('.js', '.ts')
        : undefined;
    },
    async load(id) {
      if (id === '/vite-sw-dev-server.ts') {
        return await fs.readFile('./src/devServiceWorker.ts', 'utf-8');
      }
    },
    handleHotUpdate({ file, modules, server }) {
      console.log("HOT UPDATE", [file, ...modules])
      const localFilePath = file.split(dir)[1];

      // const promise = new Promise((resolve, reject) => {
      //   changesAwaitingAck[localFilePath] = resolve;
      // })

      // console.log(`SENDING UPDATE NOTIFICATION ${localFilePath}`)
      // server.ws.send('sw:changed', {filename: localFilePath})
      // await promise;

      return modules;
    },
    configureServer(server) {
      server.ws.on('sw:ack-changed', (data, client) => {
        if (changesAwaitingAck[data.filename]) {
          changesAwaitingAck[data.filename]()
        }
      })
    },
    // async transformIndexHtml(html) {
    //   const loadDevServiceWorkerSrc = await fs.readFile(
    //     './src/loadDevServiceWorker.ts',
    //     'utf-8'
    //   );
    //   return [
    //     {
    //       tag: 'script',
    //       attrs: {
    //         type: 'module',
    //       },
    //       children: loadDevServiceWorkerSrc,
    //     },
    //   ];
    // },
  } as const;
};

export default devServiceWorkerPlugin;