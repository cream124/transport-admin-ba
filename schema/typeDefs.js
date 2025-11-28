// const typeDefsPerson = require('./person/typeDefsPerson');
import { typeDefs as typeDefsUser } from "./index.js";
import { typeDefs as typeDefsBus } from "./busschema.js";
import { ownerTypeDefs} from "./ownerschema.js";

export const typeDefs = [
  typeDefsUser,
  typeDefsBus,
  ownerTypeDefs
];