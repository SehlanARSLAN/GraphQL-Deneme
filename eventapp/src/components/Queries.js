import { gql } from "@apollo/client";

export const GET_EVENTS = gql`
  query GetEvents {
    events {
      id
      title
      description
      time
    }
  }
`;

export const CREATE_EVENT = gql`
  mutation AddEvent($title: String!, $userId: ID!, $locationId: ID!, $description: String!, $time: String!) {
    addEvent(title: $title, userId: $userId, locationId: $locationId, description: $description, time: $time) {
      id
      title
      user {
        id
        username
      }
      location {
        id
        name
      }
      description
      time
    }
  }
`;

export const GET_USERS = gql`
  query GetUsers {
    users {
      id
      username
    }
  }
`;

export const GET_LOCATIONS = gql`
  query GetLocations {
    locations {
      id
      name
    }
  }
`;