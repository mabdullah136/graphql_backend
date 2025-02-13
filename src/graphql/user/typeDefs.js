const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type User {
    userId: ID!
    name: String!
    email: String!
    designations: String!
  }

  type GetUsersResponse {
    users: [User]
  }

  type GetUserResponse {
    user: User
  }

  type Query {
    getUsers: GetUsersResponse
    getUser(userId: ID!): GetUserResponse
  }

  type UpdateUserResponse {
    user: User
  }

  type CreateUserResponse {
    user: User
  }

  type DeleteUserResponse {
    user: User
  }

  type LoginResponse {
    user: User
    token: String
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      designations: String!
      password: String!
    ): CreateUserResponse

    updateUser(
      userId: ID!
      name: String
      email: String
      designations: String
    ): UpdateUserResponse

    deleteUser(userId: ID!): DeleteUserResponse

    loginUser(email: String!, password: String!): LoginResponse
  }
`;

module.exports = typeDefs;
