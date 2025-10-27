import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const TEAMS_QUERY = gql`
  query Teams {
    teams {
      teamId
      userId
      name
      leagueId
    }
  }
`;

const ROSTER_QUERY = gql`
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
`;

/**
 * TeamSelector component
 * Dropdown to select a team and display their roster
 */
export default function TeamSelector() {
  const [selectedTeam, setSelectedTeam] = useState(null);

  // Fetch all teams
  const { data: teamsData, loading: teamsLoading, error: teamsError } = useQuery(TEAMS_QUERY);

  // Fetch roster for selected team
  const { data: rosterData, loading: rosterLoading, error: rosterError } = useQuery(
    ROSTER_QUERY,
    {
      variables: { userId: selectedTeam?.userId || '' },
      skip: !selectedTeam,
    }
  );

  const handleTeamChange = (event) => {
    const userId = event.target.value;
    const team = teamsData?.teams?.find((t) => t.userId === userId);
    setSelectedTeam(team || null);
  };

  if (teamsLoading) return <div className="text-white">Loading teams...</div>;
  if (teamsError) return <div className="text-red-500">Error loading teams: {teamsError.message}</div>;

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <label htmlFor="team-select" className="block text-sm font-medium text-gray-300 mb-2">
          Select Team
        </label>
        <select
          id="team-select"
          onChange={handleTeamChange}
          value={selectedTeam?.userId || ''}
          className="w-full px-4 py-2 bg-slate-700 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select a Team --</option>
          {teamsData?.teams?.map((team) => (
            <option key={team.teamId} value={team.userId}>
              {team.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTeam && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            {selectedTeam.name} Roster
          </h2>

          {rosterLoading && <div className="text-white">Loading roster...</div>}
          {rosterError && <div className="text-red-500">Error loading roster: {rosterError.message}</div>}
          
          {rosterData?.roster && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rosterData.roster.slots.map((slot) => (
                slot.player && (
                  <div
                    key={slot.slot}
                    className="bg-slate-800 p-4 rounded-lg border border-slate-700 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center text-lg font-bold">
                        #{slot.slot}
                      </div>
                      <div className="flex-1">
                        <div className="text-white font-semibold">{slot.player.name}</div>
                        <div className="text-sm text-gray-400">
                          {slot.player.position} • {slot.player.team}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          )}

          {rosterData?.roster?.slots?.length === 0 && (
            <div className="text-gray-400">No players on this roster</div>
          )}
        </div>
      )}
    </div>
  );
}

