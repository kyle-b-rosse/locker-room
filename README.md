# Locker Room 🏈

A fantasy football locker room built with React + Vite + Phaser 3, featuring Apollo Client (GraphQL) and Clerk for authentication.

## Tech Stack

- **Frontend**: React 19 + Vite + Tailwind CSS v4
- **Game Engine**: Phaser 3
- **Backend**: Apollo GraphQL Server
- **Database**: Clubhouse-API PostgreSQL (shared database)
- **Auth**: Clerk
- **State Management**: Zustand
- **Infrastructure**: Docker Compose

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 20+
- npm

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/kyle-b-rosse/locker-room.git
cd locker-room
```

2. **Ensure clubhouse-api is running**

The locker-room app uses the database from the clubhouse-api project. Make sure clubhouse-api is running first:

```bash
# In your clubhouse-api directory
docker-compose up -d
```

3. **Start the GraphQL server**

```bash
# In your locker-room directory
docker-compose up -d
```

This will:
- Connect to clubhouse-api PostgreSQL database on port `5432`
- Start GraphQL server on port `4001`

4. **Verify GraphQL server is running**

Visit http://localhost:4001 to access the GraphQL Playground.

5. **Setup the web app**

```bash
cd apps/web
npm install
npm run dev
```

The app will be available at http://localhost:5173

### Environment Variables

Copy `.env.example` to `.env` and fill in your Clerk keys:

```bash
cp .env.example .env
```

## Project Structure

```
locker-room/
├── apps/
│   ├── web/              # React frontend app
│   │   ├── src/
│   │   │   ├── components/    # React components
│   │   │   ├── game/          # Phaser ladder-related code
│   │   │   ├── graphql/       # GraphQL queries and schema
│   │   │   └── ...
│   └── graphql/           # Apollo GraphQL server
│       ├── src/
│       │   ├── resolvers/    # GraphQL resolvers
│       │   └── migrations/   # Database migrations
│       └── ...
├── docker-compose.yml
└── CURSOR_RULES.md
```

## Database Schema

The app connects to the clubhouse-api PostgreSQL database which includes:

- **nfl_player**: NFL player data with positions and team information
- **player**: League-specific player data linking to nfl_player
- **roster_player**: User roster definitions linking players to teams
- **team**: Team data with user_id associations
- **league**: League information

## GraphQL API

### Query: Roster

Get a user's roster with all players:

```graphql
query Roster($userId: ID!) {
  roster(userId: $userId) {
    id
    slots {
      slot
      player {
        id
        name
        position
        team
        avatar { spriteKey frame }
      }
    }
  }
}
```

## Development

### Running migrations

```bash
docker-compose exec graphql npm run db:migrate
```

### Viewing logs

```bash
docker-compose logs -f graphql
docker-compose logs -f postgres
```

### Stopping services

```bash
docker-compose down
```

To also remove volumes (database data):

```bash
docker-compose down -v
```

## Building for Production

```bash
# Build GraphQL server
cd apps/graphql
npm run build

# Build web app
cd apps/web
npm run build
```

## License

ISC

