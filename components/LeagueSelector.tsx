'use client'

import { SleeperLeague } from '@/types/sleeper'

interface LeagueSelectorProps {
  leagues: SleeperLeague[]
  selectedLeague: SleeperLeague | null
  onLeagueSelect: (league: SleeperLeague) => void
}

export default function LeagueSelector({ leagues, selectedLeague, onLeagueSelect }: LeagueSelectorProps) {
  if (leagues.length === 0) {
    return (
      <div className="text-center text-gray-400">
        No leagues found for this user.
      </div>
    )
  }

  if (leagues.length === 1 && !selectedLeague) {
    onLeagueSelect(leagues[0])
    return null
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Select a League</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {leagues.map((league) => (
          <button
            key={league.league_id}
            onClick={() => onLeagueSelect(league)}
            className={`p-4 rounded-lg border transition-colors text-left ${
              selectedLeague?.league_id === league.league_id
                ? 'bg-blue-600 border-blue-500'
                : 'bg-gray-800 border-gray-600 hover:bg-gray-700'
            }`}
          >
            <h3 className="font-semibold text-lg mb-2">{league.name}</h3>
            <div className="text-sm text-gray-400 space-y-1">
              <p>Season: {league.season}</p>
              <p>Teams: {league.total_rosters}</p>
              <p>Status: {league.status}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}