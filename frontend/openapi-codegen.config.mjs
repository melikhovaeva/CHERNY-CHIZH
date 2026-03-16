/**
 * Codegen config for RTK Query API from OpenAPI schema.
 * Schema: export from BE with `./scripts/export-openapi.sh` (from repo root).
 * Output is split by entity into separate files.
 */
export default {
  schemaFile: '../backend/openapi.json',
  apiFile: './src/shared/api/base-api.ts',
  apiImport: 'baseApi',
  hooks: true,
  tag: true,
  outputFiles: {
    './src/shared/api/generated/articles.generated.ts': {
      filterEndpoints: [/^v1Articles/],
    },
    './src/shared/api/generated/breeds.generated.ts': {
      filterEndpoints: [/^v1BreedsList$/, /^v1BreedsRetrieve$/],
    },
    './src/shared/api/generated/dogs.generated.ts': {
      filterEndpoints: [/^v1Dogs/, /^v1BreedsDogs/],
    },
    './src/shared/api/generated/courses.generated.ts': {
      filterEndpoints: [/^v1Courses/, /^v1EducationCourses/],
    },
    './src/shared/api/generated/dictionaries.generated.ts': {
      filterEndpoints: [/^dictionaries/],
    },
    './src/shared/api/generated/faq.generated.ts': {
      filterEndpoints: [/^v1Faq/],
    },
    './src/shared/api/generated/requests.generated.ts': {
      filterEndpoints: [/^v1Requests/],
    },
    './src/shared/api/generated/users.generated.ts': {
      filterEndpoints: [/^v1Users/],
    },
  },
};
