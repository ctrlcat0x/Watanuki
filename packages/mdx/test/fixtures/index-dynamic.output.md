```ts title="server.ts"
// @ts-nocheck
import { server } from '@watanuki/mdx/runtime/server';
import type * as Config from './config';

const create = server<typeof Config, import("@watanuki/mdx/runtime/types").InternalTypeConfig & {
  DocData: {
    blogs: {
      /**
       * extracted references (e.g. hrefs, paths), useful for analyzing relationships between pages.
       */
      extractedReferences: import("@watanuki/mdx").ExtractedReference[];
    },
  }
}>({"doc":{"passthroughs":["extractedReferences"]}});
```

```ts title="dynamic.ts"
// @ts-nocheck
import { dynamic } from '@watanuki/mdx/runtime/dynamic';
import path from 'node:path';
import * as Config from './config';

const create = await dynamic<typeof Config, import("@watanuki/mdx/runtime/types").InternalTypeConfig & {
  DocData: {
    blogs: {
      /**
       * extracted references (e.g. hrefs, paths), useful for analyzing relationships between pages.
       */
      extractedReferences: import("@watanuki/mdx").ExtractedReference[];
    },
  }
}>(Config, {"configPath":"test/fixtures/config.ts","environment":"test","outDir":"test/fixtures"}, {"doc":{"passthroughs":["extractedReferences"]}});

export const docs = await create.doc("docs", "test/fixtures/generate-index", [{ absolutePath: path.resolve("test/fixtures/generate-index/index.mdx"), info: {"fullPath":"test/fixtures/generate-index/index.mdx","path":"index.mdx"}, data: {}, hash: "b12f02f44f5ed3318104c095c455e5ee" }, { absolutePath: path.resolve("test/fixtures/generate-index/folder/test.mdx"), info: {"fullPath":"test/fixtures/generate-index/folder/test.mdx","path":"folder/test.mdx"}, data: {}, hash: "d41d8cd98f00b204e9800998ecf8427e" }]);

export const blogs = await create.doc("blogs", "test/fixtures/generate-index", [{ absolutePath: path.resolve("test/fixtures/generate-index/index.mdx"), info: {"fullPath":"test/fixtures/generate-index/index.mdx","path":"index.mdx"}, data: {}, hash: "b12f02f44f5ed3318104c095c455e5ee" }, { absolutePath: path.resolve("test/fixtures/generate-index/folder/test.mdx"), info: {"fullPath":"test/fixtures/generate-index/folder/test.mdx","path":"folder/test.mdx"}, data: {}, hash: "d41d8cd98f00b204e9800998ecf8427e" }]);
```

```ts title="browser.ts"
// @ts-nocheck
import { browser } from '@watanuki/mdx/runtime/browser';
import type * as Config from './config';

const create = browser<typeof Config, import("@watanuki/mdx/runtime/types").InternalTypeConfig & {
  DocData: {
    blogs: {
      /**
       * extracted references (e.g. hrefs, paths), useful for analyzing relationships between pages.
       */
      extractedReferences: import("@watanuki/mdx").ExtractedReference[];
    },
  }
}>();
const browserCollections = {
};
export default browserCollections;
```