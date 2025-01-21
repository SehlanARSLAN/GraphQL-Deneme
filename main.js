const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');

// Örnek veri seti
const users = [
  { id: 1, username: 'Ali' },
  { id: 2, username: 'Veli' }
];

const locations = [
  { id: 1, name: 'Istanbul' },
  { id: 2, name: 'Ankara' }
];

const events = [
  { id: 1, title: 'Concert', userId: 1, locationId: 1 },
  { id: 2, title: 'Workshop', userId: 2, locationId: 2 }
];

const participants = [
  { id: 1, username: 'Mehmet', eventId: 1 },
  { id: 2, username: 'Ayşe', eventId: 1 },
  { id: 3, username: 'Fatma', eventId: 2 }
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
`;

// Resolver'lar
const resolvers = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find(user => user.id == id),
    events: () => events,
    event: (_, { id }) => events.find(event => event.id == id),
    locations: () => locations,
    location: (_, { id }) => locations.find(loc => loc.id == id),
    participants: () => participants,
    participant: (_, { id }) => participants.find(p => p.id == id),
  },
  
  User: {
    events: (user) => events.filter(event => event.userId === user.id)
  },
  
  Event: {
    user: (event) => users.find(user => user.id === event.userId),
    location: (event) => locations.find(loc => loc.id === event.locationId),
    participants: (event) => participants.filter(p => p.eventId === event.id)
  }
};

const app = express();
const server = new ApolloServer({ typeDefs, resolvers });

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`);
  });
}

startServer();