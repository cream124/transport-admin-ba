// const merge = import('loadsh/merge.js');
import { resolvers as resolversUser } from "./index.js";
import { resolvers as resolversBus } from "./busschema.js";
import { ownerResolvers } from "./ownerschema.js";

export const resolvers = [
  resolversUser,
  resolversBus,
  ownerResolvers
];
