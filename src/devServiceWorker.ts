/// <reference lib="WebWorker" />

// export empty type because of tsc --isolatedModules flag
export type {};
declare const self: ServiceWorkerGlobalScope;

const cacheName = 'dev-cache';
const version = 'v0.0.1';

const exclusions = [/\/devServiceWorker.ts$/];

const shouldBeExcluded = (req: Request) => {
  for (const exclusion of exclusions) {
    const match = req.url.match(exclusion);

    if (match) {
      return true;
    }
  }

  return false;
};

self.addEventListener('install', (event) => {
  console.log('Installing....');
  event.waitUntil(caches.open(version + cacheName));
});

self.addEventListener('activate', (event) => {
  console.log('clearing old caches...');
  event.waitUntil(
    caches.keys().then((keys) => {
      // Remove caches whose name is no longer valid
      return Promise.all(
        keys
          .filter((key) => {
            return key.indexOf(version) !== 0;
          })
          .map((key) => {
            return caches.delete(key);
          })
      );
    })
  );
});

self.addEventListener('fetch', async (event) => {
  const request = event.request;
  console.log('HANDLING REQUEST', request.url);

  if (request.method === 'GET' && !shouldBeExcluded(request)) {
    console.log('fetching with cache:', request.url);
    event.respondWith(getCached(request));
    return;
  }

  return event.respondWith(fetch(request));
});

const getCached = async (req: Request): Promise<Response> => {
  const cache = await caches.open(version + cacheName);

  const match = await cache.match(req);

  if (match) {
    return match;
  }

  const resp = await fetch(req);

  await cache.put(req, resp.clone());
  return resp;
};
