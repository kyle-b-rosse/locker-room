-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  position VARCHAR(50) NOT NULL,
  team VARCHAR(100) NOT NULL,
  avatar_sprite_key VARCHAR(100),
  avatar_frame INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Rosters table
CREATE TABLE IF NOT EXISTS rosters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Roster Slots table (joins rosters to players)
CREATE TABLE IF NOT EXISTS roster_slots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  roster_id UUID NOT NULL REFERENCES rosters(id) ON DELETE CASCADE,
  slot INTEGER NOT NULL CHECK (slot >= 1 AND slot <= 10),
  player_id UUID REFERENCES players(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(roster_id, slot)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_roster_slots_roster_id ON roster_slots(roster_id);
CREATE INDEX IF NOT EXISTS idx_roster_slots_player_id ON roster_slots(player_id);
CREATE INDEX IF NOT EXISTS idx_players_position ON players(position);

-- Insert some sample players
INSERT INTO players (name, position, team, avatar_sprite_key, avatar_frame) VALUES
('Tom Brady', 'QB', 'TB', 'player_avatar', 1),
('Patrick Mahomes', 'QB', 'KC', 'player_avatar', 2),
('Derrick Henry', 'RB', 'TEN', 'player_avatar', 3),
('Tyreek Hill', 'WR', 'MIA', 'player_avatar', 4),
('Travis Kelce', 'TE', 'KC', 'player_avatar', 5),
('Justin Jefferson', 'WR', 'MIN', 'player_avatar', 6),
('Josh Allen', 'QB', 'BUF', 'player_avatar', 7),
('Cooper Kupp', 'WR', 'LAR', 'player_avatar', 8),
('Austin Ekeler', 'RB', 'LAC', 'player_avatar', 9),
('Mark Andrews', 'TE', 'BAL', 'player_avatar', 10)
ON CONFLICT DO NOTHING;

