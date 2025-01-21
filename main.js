const { ApolloServer, gql } = require("apollo-server-express");
const { PubSub } = require('graphql-subscriptions');

const express = require("express");
const pubsub = new PubSub();

// GraphQL Şeması
typeDefs = gql`
  type User {
    id: ID!
    username: String!
    events: [Event]
  }

  type Event {
    id: ID!
    title: String!
    user: User!
    location: Location!
    participants: [Participant]
  }

  type Location {
    id: ID!
    name: String!
  }

  type Participant {
    id: ID!
    username: String!
  }

  type Query {
    users: [User]
    user(id: ID!): User
    events: [Event]
    event(id: ID!): Event
    locations: [Location]
    location(id: ID!): Location
    participants: [Participant]
    participant(id: ID!): Participant
  }

  type Mutation {
    addUser(username: String!): User
    updateUser(id: ID!, username: String!): User
    deleteUser(id: ID!): User
    deleteAllUsers: [User!]

    addEvent(title: String!, userId: ID!, locationId: ID!): Event
    updateEvent(id: ID!, title: String!): Event
    deleteEvent(id: ID!): Event
    deleteAllEvents: [Event!]

    addLocation(name: String!): Location
    updateLocation(id: ID!, name: String!): Location
    deleteLocation(id: ID!): Location
    deleteAllLocations: [Location!]

    addParticipant(username: String!, eventId: ID!): Participant
    updateParticipant(id: ID!, username: String!): Participant
    deleteParticipant(id: ID!): Participant
    deleteAllParticipants: [Participant!]
  }
  
  type Subscription {
    userCreated: User
    userDeleted: User
    eventCreated: Event
    eventDeleted: Event
    participantAdded: Participant
    participantDeleted: Participant
  }
`;

const users = [];
const events = [];
const participants = [];

// Resolver'lar
const resolvers = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find((user) => user.id == id),
    events: () => events,
    event: (_, { id }) => events.find((event) => event.id == id),
    locations: () => [],
    location: (_, { id }) => null,
    participants: () => participants,
    participant: (_, { id }) => participants.find((p) => p.id == id),
  },

  Mutation: {
    addUser: (_, { username }) => {
      const user = { id: Date.now().toString(), username };
      users.push(user);
      pubsub.publish('USER_CREATED', { userCreated: user });
      return user;
    },
    updateUser: (_, { id, username }) => {
      const user = users.find((u) => u.id == id);
      if (!user) return null;
      user.username = username;
      return user;
    },
    deleteUser: (_, { id }) => {
      const index = users.findIndex(user => user.id === id);
      if (index === -1) return null;
      const deletedUser = users.splice(index, 1)[0];
      pubsub.publish('USER_DELETED', { userDeleted: deletedUser });
      return deletedUser;
    },
    deleteAllUsers: () => {
      const deleted = [...users];
      users.length = 0;
      return deleted;
    },
    addEvent: (_, { title, userId, locationId }) => {
      const event = { id: Date.now().toString(), title, user: { id: userId, username: "User" }, location: { id: locationId, name: "Location" }, participants: [] };
      events.push(event);
      pubsub.publish('EVENT_CREATED', { eventCreated: event });
      return event;
    },
    updateEvent: (_, { id, title }) => {
      const event = events.find((e) => e.id == id);
      if (!event) return null;
      event.title = title;
      return event;
    },
    deleteEvent: (_, { id }) => {
      const index = events.findIndex(event => event.id === id);
      if (index === -1) return null;
      const deletedEvent = events.splice(index, 1)[0];
      pubsub.publish('EVENT_DELETED', { eventDeleted: deletedEvent });
      return deletedEvent;
    },
    deleteAllEvents: () => {
      const deleted = [...events];
      events.length = 0;
      return deleted;
    },
    addLocation: (_, { name }) => {
      const newLocation = { id: locations.length + 1, name };
      locations.push(newLocation);
      return newLocation;
    },
    updateLocation: (_, { id, name }) => {
      const location = locations.find((l) => l.id == id);
      if (!location) return null;
      location.name = name;
      return location;
    },
    deleteLocation: (_, { id }) => {
      locations = locations.filter((l) => l.id != id);
      return { id, name: "Deleted" };
    },
    deleteAllLocations: () => {
      const deleted = [...locations];
      locations = [];
      return deleted;
    },
    addParticipant: (_, { eventId, username }) => {
      const participant = { id: Date.now().toString(), username };
      participants.push(participant);
      pubsub.publish('PARTICIPANT_ADDED', { participantAdded: participant });
      return participant;
    },
    updateParticipant: (_, { id, username }) => {
      const participant = participants.find((p) => p.id == id);
      if (!participant) return null;
      participant.username = username;
      return participant;
    },
    deleteParticipant: (_, { id }) => {
      const index = participants.findIndex(p => p.id === id);
      if (index === -1) return null;
      const deletedParticipant = participants.splice(index, 1)[0];
      pubsub.publish('PARTICIPANT_DELETED', { participantDeleted: deletedParticipant });
      return deletedParticipant;
    },
    deleteAllParticipants: () => {
      const deleted = [...participants];
      participants.length = 0;
      return deleted;
    },
  },
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
    );
  });
}

startServer();
