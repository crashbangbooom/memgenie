import { gql } from 'graphql-tag';
import projectTypedefs from './project';

const typeDefs = gql`
  scalar Date

  type Answer {
    correctOption: Int
    mainWord: String
  }

  type User {
    id: String!
    name: String
    email: String
    address: String
    state: String
    country: String
    isAdmin: Boolean
    isSubscribed: Boolean
    subscriptionEndDate: Date
  }

  type LoginResponse {
    token: String
    error: String
    user: User
  }

  type StatusResponse {
    message: String
    status: String!
  }
  type MessageResponse {
    message: String!
  }

  type Query {
    user: User
    users: [User!]!
    solveQuestion(
      question: String!
      options: [String!]
      context: String
    ): Answer
  }
  type Mutation {
    registerUser(
      name: String!
      email: String!
      address: String
      state: String
      country: String
      password: String!
    ): User
    login(email: String!, password: String!): LoginResponse!
    sendResetPasswordLink(email: String!): MessageResponse!
    resetPassword(password: String!, token: String!): StatusResponse!
    sendVerificationEmail(email: String!): MessageResponse!
    verifyEmail(token: String!): StatusResponse!
    updateAdminStatus(userId: String!, status: Boolean): User
    deleteUser(id: String!): User

    sendPhoneOtp(phoneNo: String): StatusResponse
    phoneOtpLogin(otp: String, phoneNo: String): LoginResponse!
  }

  ${projectTypedefs}
`;

export default typeDefs;
