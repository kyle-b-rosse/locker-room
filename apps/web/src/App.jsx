import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client';
import TeamSelector from './components/TeamSelector';
import './App.css';

// Create Apollo Client instance
const client = new ApolloClient({
  uri: import.meta.env.VITE_GRAPHQL_URL || 'http://localhost:4001',
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="min-h-screen bg-slate-900 text-white py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-center mb-8">
            Fantasy Football Locker Room
          </h1>
          <TeamSelector />
        </div>
      </div>
    </ApolloProvider>
  );
}

export default App;
