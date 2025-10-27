import { Pool } from 'pg';

/**
 * GraphQL Resolvers
 * Handles queries for the fantasy football locker room app
 */

export const resolvers = {
  Query: {
    /**
     * Get a user's roster with all slots and players
     */
    roster: async (_: any, { userId }: { userId: string }, { db }: { db: Pool }) => {
      try {
        // Get roster
        const rosterResult = await db.query(
          'SELECT id, user_id FROM rosters WHERE user_id = $1',
          [userId]
        );

        if (rosterResult.rows.length === 0) {
          // Return empty roster if user doesn't have one yet
          return {
            id: `roster-${userId}`,
            userId,
            slots: [],
          };
        }

        const roster = rosterResult.rows[0];

        // Get all slots with players
        const slotsResult = await db.query(
          `SELECT 
            rs.slot,
            p.id as player_id,
            p.name,
            p.position,
            p.team,
            p.avatar_sprite_key,
            p.avatar_frame
          FROM roster_slots rs
          LEFT JOIN players p ON rs.player_id = p.id
          WHERE rs.roster_id = $1
          ORDER BY rs.slot`,
          [roster.id]
        );

        const slots = slotsResult.rows.map((row) => ({
          slot: row.slot,
          player: row.player_id ? {
            id: row.player_id,
            name: row.name,
            position: row.position,
            team: row.team,
            avatar: row.avatar_sprite_key ? {
              spriteKey: row.avatar_sprite_key,
              frame: row.avatar_frame || 0,
            } : null,
          } : null,
        }));

        return {
          id: roster.id,
          userId: roster.user_id,
          slots,
        };
      } catch (error) {
        console.error('Error fetching roster:', error);
        throw new Error('Failed to fetch roster');
      }
    },
  },
};

