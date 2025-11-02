import { gql } from "apollo-server-express";
import Bus from "../models/Bus.js";

export const typeDefs = gql`
  type Bus {
    id: ID!
    name: String!
    licensePlate: String!
    owner: String!
    numberOfSeats: Int!
    status: String!
  }

  input BusInput {
    name: String!
    licensePlate: String!
    owner: String!
    numberOfSeats: Int!
    status: String!
  }

  type Query {
    buses: [Bus!]!
    bus(id: ID!): Bus
  }

  type Mutation {
    createBus(input: BusInput!): Bus!
    updateBus(id: ID!, input: BusInput!): Bus!
    deleteBus(id: ID!): Boolean!
  }
`;

export const resolvers = {
  Query: {
    buses: async () => await Bus.find(),
    bus: async (_, { id }) => await Bus.findById(id),
  },
  Mutation: {
    createBus: async (_, { input }) => {
        console.log('----input-----', input)
      const newBus = new Bus(input);
      return await newBus.save();
    },
    updateBus: async (_, { id, input }) => {
      return await Bus.findByIdAndUpdate(id, input, { new: true });
    },
    deleteBus: async (_, { id }) => {
      const deleted = await Bus.findByIdAndDelete(id);
      return !!deleted;
    },
  },
};
