import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import { resolvers } from './resolvers.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load GraphQL schema
const typeDefs = readFileSync(join(__dirname, 'schema.graphql'), 'utf-8');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true, // Enable for development
});

async function startServer() {
  const { url } = await startStandaloneServer(server, {
    listen: { port: parseInt(process.env.PORT || '4000') },
    context: async () => ({ db: pool }),
  });

  console.log(`🚀 GraphQL Server ready at: ${url}`);
  console.log(`📊 GraphQL Playground: ${url}`);
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully');
  await server.stop();
  await pool.end();
  process.exit(0);
});

