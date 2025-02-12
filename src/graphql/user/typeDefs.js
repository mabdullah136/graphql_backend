const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    userId: ID!
    name: String!
    email: String!
    designations: String!
  }

  type Query {
    getUsers: [User]
    getUser(userId: ID!): User
  }

  type UpdateUserResponse {
    status: String!
    message: String!
    user: User
  }

  type Mutation {
    createUser(name: String!, email: String!, designations: String!): User
    updateUser(
      userId: ID!
      name: String
      email: String
      designations: String
    ): UpdateUserResponse
    deleteUser(userId: ID!): User
  }
`;

module.exports = typeDefs;
