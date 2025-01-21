const { ApolloServer, gql } = require("apollo-server-express");
const express = require("express");

// Örnek veri seti
const users = [
  { id: 1, username: "Ali" },
  { id: 2, username: "Veli" },
];

const locations = [
  { id: 1, name: "Istanbul" },
  { id: 2, name: "Ankara" },
];

const events = [
  { id: 1, title: "Concert", userId: 1, locationId: 1 },
  { id: 2, title: "Workshop", userId: 2, locationId: 2 },
];

const participants = [
  { id: 1, username: "Mehmet", eventId: 1 },
  { id: 2, username: "Ayşe", eventId: 1 },
  { id: 3, username: "Fatma", eventId: 2 },
];

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
    deleteAllUsers: [User]

    addEvent(title: String!, userId: ID!, locationId: ID!): Event
    updateEvent(id: ID!, title: String!): Event
    deleteEvent(id: ID!): Event
    deleteAllEvents: [Event]

    addLocation(name: String!): Location
    updateLocation(id: ID!, name: String!): Location
    deleteLocation(id: ID!): Location
    deleteAllLocations: [Location]

    addParticipant(username: String!, eventId: ID!): Participant
    updateParticipant(id: ID!, username: String!): Participant
    deleteParticipant(id: ID!): Participant
    deleteAllParticipants: [Participant]
  }
`;

// Resolver'lar
const resolvers = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find((user) => user.id == id),
    events: () => events,
    event: (_, { id }) => events.find((event) => event.id == id),
    locations: () => locations,
    location: (_, { id }) => locations.find((loc) => loc.id == id),
    participants: () => participants,
    participant: (_, { id }) => participants.find((p) => p.id == id),
  },

  Mutation: {
    addUser: (_, { username }) => {
      const newUser = { id: users.length + 1, username };
      users.push(newUser);
      return newUser;
    },
    updateUser: (_, { id, username }) => {
      const user = users.find((u) => u.id == id);
      if (!user) return null;
      user.username = username;
      return user;
    },
    deleteUser: (_, { id }) => {
      users = users.filter((u) => u.id != id);
      return { id, username: "Deleted" };
    },
    deleteAllUsers: () => {
      const deleted = [...users];
      users = [];
      return deleted;
    },
    addEvent: (_, { title, userId, locationId }) => {
      const newEvent = { id: events.length + 1, title, userId, locationId };
      events.push(newEvent);
      return newEvent;
    },
    updateEvent: (_, { id, title }) => {
      const event = events.find((e) => e.id == id);
      if (!event) return null;
      event.title = title;
      return event;
    },
    deleteEvent: (_, { id }) => {
      events = events.filter((e) => e.id != id);
      return { id, title: "Deleted" };
    },
    deleteAllEvents: () => {
      const deleted = [...events];
      events = [];
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
    addParticipant: (_, { username, eventId }) => {
      const newParticipant = { id: participants.length + 1, username, eventId };
      participants.push(newParticipant);
      return newParticipant;
    },
    updateParticipant: (_, { id, username }) => {
      const participant = participants.find((p) => p.id == id);
      if (!participant) return null;
      participant.username = username;
      return participant;
    },
    deleteParticipant: (_, { id }) => {
      participants = participants.filter((p) => p.id != id);
      return { id, username: "Deleted" };
    },
    deleteAllParticipants: () => {
      const deleted = [...participants];
      participants = [];
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
