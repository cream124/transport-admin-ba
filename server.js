import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
// import { typeDefs, resolvers } from "./schema/index.js";
// import { typeDefs as typeDefsBus, resolvers as resolversBus } from "./schema/busschema.js";

import {typeDefs} from "./schema/typeDefs.js";
import {resolvers} from "./schema/resolvers.js";

dotenv.config();


// Connect to MongoDB
await mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

const getUserFromToken = (token) => {
  try {
    if (token) {
      return jwt.verify(token, process.env.JWT_SECRET);
    }
    return null;
  } catch {
    return null;
  }
};

// Create Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT || 4000 },
  context: async ({ req }) => {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.replace("Bearer ", "");
    const user = getUserFromToken(token);
    return { user };
  },
});

console.log(`🚀 Server ready at ${url}`);
