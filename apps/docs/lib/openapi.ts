import { createOpenAPI } from '@watanuki/openapi/server';

export const openapi = createOpenAPI({
  input: ['./openapi/petstore.yaml'],
});
