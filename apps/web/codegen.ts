import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'src/graphql/schema.graphql',                  // put your schema here
  documents: 'src/graphql/operations/**/*.graphql',
  generates: {
    'src/graphql/generated/': {
      preset: 'client', // Apollo-ready hooks
      presetConfig: { gqlTagName: 'gql' }
    }
  },
  hooks: { afterAllFileWrite: ['prettier --write'] }
};
export default config;
