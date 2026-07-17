export {
  type MetaData,
  type PageData,
  type DynamicSource,
  type SourceUnion,
  type StaticSource,
  type VirtualFile,
  type Source,
  source,
  update,
  multiple,
} from './source';
export * from './loader';
export { getSlugs } from './plugins/slugs';
export { FileSystem } from './storage/file-system';
export * as PathUtils from './path';

export type {
  PageTreeBuilderContext,
  PageTreeOptions,
  PageTreeTransformer,
  PageTreeBuilder,
} from './page-tree/builder';
export type {
  ContentStorage,
  ContentStorageMetaFile,
  ContentStoragePageFile,
} from './storage/content';

// TODO: remove this on next major
export * from './llms';
export * from './sitemap';
export * from './robots';
export * from './rss';

/** internal types, do not use it */
export type * as _Internal from './types';
