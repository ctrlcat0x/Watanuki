```ts title="server.ts"
// @ts-nocheck
import { server } from '@watanuki/mdx/runtime/server';
import type * as Config from './config';

const create = server<typeof Config, import("@watanuki/mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});
```

```ts title="dynamic.ts"
// @ts-nocheck
import { default as __fd_glob_0 } from "./generate-index-docs/meta.json?collection=docs"
import { dynamic } from '@watanuki/mdx/runtime/dynamic';
import path from 'node:path';
import * as Config from './config';

const create = await dynamic<typeof Config, import("@watanuki/mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>(Config, {"configPath":"test/fixtures/config.ts","environment":"test","outDir":"test/fixtures"}, {"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.docs("docs", "test/fixtures/generate-index-docs", {"meta.json": __fd_glob_0, }, [{ absolutePath: path.resolve("test/fixtures/generate-index-docs/index.mdx"), info: {"fullPath":"test/fixtures/generate-index-docs/index.mdx","path":"index.mdx"}, data: {"title":"Hello World"}, hash: "ff5bb77e7944dd47e09718d8190c76b3" }, { absolutePath: path.resolve("test/fixtures/generate-index-docs/folder/test.mdx"), info: {"fullPath":"test/fixtures/generate-index-docs/folder/test.mdx","path":"folder/test.mdx"}, data: {"title":"Folder Test"}, hash: "f003f596f68747454370ba42599464fc" }]);
```

```ts title="browser.ts"
// @ts-nocheck
import { browser } from '@watanuki/mdx/runtime/browser';
import type * as Config from './config';

const create = browser<typeof Config, import("@watanuki/mdx/runtime/types").InternalTypeConfig & {
  DocData: {
  }
}>();
const browserCollections = {
};
export default browserCollections;
```