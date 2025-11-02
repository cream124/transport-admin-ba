import { gql } from "apollo-server";
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
    role: String! # "admin" or "user"
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
  input UpdateUserInput {
    id: ID!
    name: String
    email: String
  }

  type Query {
    validateToken: User
    users: [User!]!
  }

  type Mutation {
    registerUser(input: RegisterInput!): AuthPayload!
    loginUser(input: LoginInput!): AuthPayload!
    updateUser(input: UpdateUserInput!): User!
    deleteUser(id: ID): Boolean!
  }
`;

export const resolvers = {
  Query: {
    validateToken: async (_, __, { user }) => {
      if (!user) throw new Error("Not authenticated");
      return await User.findById(user.id);
    },
    users: async (_, __) => {
      return await User.find();
    },
  },

  Mutation: {
    registerUser: async (_, { input }) => {
      const { name, email, password } = input;

      const existing = await User.findOne({ email });
      if (existing) throw new Error("Email already registered");

      const hashed = await bcrypt.hash(password, 10);
      const user = await User.create({ name, email, password: hashed, role: "user" });

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

    updateUser: async (_, { input}) => {
      const { id, name, email } = input;
      const existing = await User.findById(id);

      if (!existing) throw new Error("The user not exited");
      await User.updateOne({_id:id},
        {
          $set: {name, email}
        });
      return await User.findById(id);
    },

    deleteUser: async (_, { id }) => {
      const existing = await User.findById(id);
      if (!existing) throw new Error("The user not exited");
      const ss = await User.deleteOne({_id: id});
      return ss.acknowledged;
    },
  },
};
