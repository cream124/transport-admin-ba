import { gql } from "apollo-server";
// import { gql } from "graphql-tag";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
dotenv.config();

export const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input RegisterInput {
    name: String!
    email: String!
    password: String!
    confirmPassword: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  type Query {
    validateToken: User
  }

  type Mutation {
    registerUser(input: RegisterInput!): AuthPayload!
    loginUser(input: LoginInput!): AuthPayload!
  }
`;

export const resolvers = {
  Query: {
    validateToken: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await User.findById(user.id);
    },
  },

  Mutation: {
    registerUser: async (_, { input }) => {
      const { name, email, password } = input;

      const existing = await User.findOne({ email });
      if (existing) throw new Error("Email already registered");

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed });

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return { token, user };
    },

    loginUser: async (_, { input }) => {
      const { email, password } = input;
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) throw new Error("Invalid credentials");

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return { token, user };
    },
  },
};
