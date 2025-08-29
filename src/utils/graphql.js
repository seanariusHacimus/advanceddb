import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://api.advance-db.upaynet.tel/api/graphql',
  cache: new InMemoryCache()
});

export default client;