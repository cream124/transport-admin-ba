// const merge = import('loadsh/merge.js');
import { resolvers as resolversUser } from "./index.js";
import { resolvers as resolversBus } from "./busschema.js";

export const resolvers = [
  resolversUser,
  resolversBus,
];
