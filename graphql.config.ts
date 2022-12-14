import type { IGraphQLConfig } from "graphql-config";

const config: IGraphQLConfig = {
  schema: "./schema.graphql",
  documents: ["./**/*.ts", "./**/*.js"],
};

export default config;
