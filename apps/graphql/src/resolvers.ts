import { Pool } from 'pg';

/**
 * GraphQL Resolvers
 * Handles queries for the fantasy football locker room app
 * Uses clubhouse-api database schema
 */

export const resolvers = {
  Query: {
    /**
     * Get a user's roster with all slots and players
     * Uses clubhouse-api database with team_id and roster_player tables
     */
    roster: async (_: any, { userId }: { userId: string }, { db }: { db: Pool }) => {
      try {
        // First, get the team_id from user_id (in clubhouse-api, user_id is the identifier)
        const teamResult = await db.query(
          `SELECT team_id, league_id, user_id, name FROM team WHERE user_id = $1 LIMIT 1`,
          [userId]
        );

        if (teamResult.rows.length === 0) {
          // Return empty roster if user doesn't have a team yet
          return {
            id: `roster-${userId}`,
            userId,
            slots: [],
          };
        }

        const team = teamResult.rows[0];
        const teamId = team.team_id;
        const leagueId = team.league_id;

        // Get all roster players for this team
        const rosterResult = await db.query(
          `SELECT 
            rp.roster_player_id,
            rp.roster_seat,
            np.nfl_player_id,
            np.name,
            np.position,
            nt.name as team_name,
            nt.nfl_team_code
          FROM roster_player rp
          LEFT JOIN player p ON rp.player_id = p.player_id
          LEFT JOIN nfl_player np ON p.nfl_player_id = np.nfl_player_id
          LEFT JOIN nfl_team nt ON np.nfl_team_id = nt.nfl_team_id
          WHERE rp.team_id = $1 AND rp.league_id = $2
          ORDER BY rp.roster_player_id`,
          [teamId, leagueId]
        );

        // Map roster players to slots (for now, use roster_player_id as slot position)
        const slots = rosterResult.rows.map((row, index) => ({
          slot: index + 1, // Use 1-indexed slot position
          player: row.nfl_player_id ? {
            id: row.nfl_player_id.toString(),
            name: row.name,
            position: row.position,
            team: row.team_name || '',
            avatar: {
              spriteKey: 'player_avatar',
              frame: row.nfl_player_id % 10, // Use player_id modulo to get a sprite frame
            },
          } : null,
        }));

        return {
          id: `team-${teamId}`,
          userId,
          slots,
        };
      } catch (error) {
        console.error('Error fetching roster:', error);
        throw new Error('Failed to fetch roster');
      }
    },
  },
};
