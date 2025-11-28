import { gql } from "apollo-server";
import Owner from "../models/Owner.js";

export const ownerTypeDefs = gql`
  type Owner {
    id: ID!
    name: String!
    lastName: String
    secondLastName: String
    email: String!
    cell: String
    photo: String
  }

  input OwnerInput {
    name: String!
    lastName: String
    secondLastName: String
    email: String!
    cell: String
    photo: String
  }

  input UpdateOwnerInput {
    id: ID!
    name: String
    lastName: String
    secondLastName: String
    email: String
    cell: String
    photo: String
  }

  type Query {
    owners: [Owner!]!
    owner(id: ID!): Owner
  }

  type Mutation {
    createOwner(input: OwnerInput!): Owner
    updateOwner(input: UpdateOwnerInput!): Owner!
    deleteOwner(id: ID!): Boolean!
  }
`;

export const ownerResolvers = {
  Query: {
    owners: async () => {
      return await Owner.find();
    },
    owner: async (_, { id }) => {
      return await Owner.findById(id);
    },
  },
  Mutation: {
    createOwner: async (_, { input }) => {
      const { name, lastName, secondLastName, email, cell, photo } = input;
      const existing = await Owner.findOne({ email });
      if (existing) throw new Error("Email already registered for owner");
      const owner = await Owner.create({ name, lastName, secondLastName, email, cell, photo });
      return owner;
    },
    updateOwner: async (_, { input }) => {
      const { id, name, lastName, secondLastName, email, cell, photo } = input;
      const existing = await Owner.findById(id);
      if (!existing) throw new Error("Owner not found");
      await Owner.updateOne({ _id: id }, { $set: { name, lastName, secondLastName, email, cell, photo } });
      return await Owner.findById(id);
    },
    deleteOwner: async (_, { id }) => {
      const existing = await Owner.findById(id);
      if (!existing) throw new Error("Owner not found");
      const result = await Owner.deleteOne({ _id: id });
      return result.acknowledged;
    },
  },
};
