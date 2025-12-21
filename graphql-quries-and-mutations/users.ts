import { gql } from 'urql';

export const GET_USERS = gql`
  query Users {
    users {
      id
      email
      name
      country
      state
      isAdmin
      isSubscribed
      address
      subscriptionEndDate
      referrals
      pendingReferralCount
    }
  }
`;
export const GIVE_FREE_MONTH = gql`
  mutation Mutation($userId: String!) {
    giveFreeMonth(userId: $userId) {
      id
    }
  }
`;
