/**
 * Codegen config for RTK Query API from OpenAPI schema.
 * Schema: export from BE with `./scripts/export-openapi.sh` (from repo root).
 */
export default {
  schemaFile: '../../../backend/openapi.json',
  apiFile: './src/shared/api/base-api.ts',
  apiImport: 'baseApi',
  outputFile: './src/shared/api/generated/api.generated.ts',
  exportName: 'generatedApi',
  hooks: true,
  tag: true,
};
