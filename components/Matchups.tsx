'use client'

import Image from 'next/image'
import { SleeperMatchup, SleeperRoster, SleeperUser } from '@/types/sleeper'

interface MatchupsProps {
  matchups: SleeperMatchup[]
  rosters: SleeperRoster[]
  users: SleeperUser[]
  week: number
  onMatchupClick: (matchupId: number) => void
}

export default function Matchups({ matchups, rosters, users, week, onMatchupClick }: MatchupsProps) {
  const getUserByRosterId = (rosterId: number) => {
    const roster = rosters.find(r => r.roster_id === rosterId)
    if (!roster) return null
    return users.find(user => user.user_id === roster.owner_id)
  }

  const groupedMatchups = matchups.reduce((acc, matchup) => {
    if (!acc[matchup.matchup_id]) {
      acc[matchup.matchup_id] = []
    }
    acc[matchup.matchup_id].push(matchup)
    return acc
  }, {} as Record<number, SleeperMatchup[]>)

  const matchupPairs = Object.values(groupedMatchups).map(matchupGroup => {
    const sorted = matchupGroup.sort((a, b) => b.points - a.points)
    return sorted
  })

  if (matchups.length === 0) {
    return (
      <div className="text-center text-gray-400">
        No matchups found for week {week}.
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Week {week} Matchups</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {matchupPairs.map((matchupPair, index) => {
          if (matchupPair.length === 0) return null
          
          const matchupId = matchupPair[0].matchup_id
          const team1 = matchupPair[0]
          const team2 = matchupPair[1]
          
          if (!team2) {
            const user1 = getUserByRosterId(team1.roster_id)
            return (
              <div key={index} className="bg-gray-800 rounded-lg p-4">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {user1?.avatar && (
                      <Image
                        src={`https://sleepercdn.com/avatars/${user1.avatar}`}
                        alt={user1.display_name || user1.username || 'User'}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                    )}
                    <div>
                      <div className="font-medium">
                        {(user1 as any)?.metadata?.team_name || user1?.display_name || user1?.username || 'Unknown'}
                      </div>
                      {(user1 as any)?.metadata?.team_name && (
                        <div className="text-xs text-gray-400">
                          {user1?.display_name || user1?.username}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-2xl font-bold">{team1.points.toFixed(2)}</p>
                  <p className="text-sm text-gray-400">BYE WEEK</p>
                </div>
              </div>
            )
          }

          const user1 = getUserByRosterId(team1.roster_id)
          const user2 = getUserByRosterId(team2.roster_id)
          const winner = team1.points > team2.points ? team1 : team2.points > team1.points ? team2 : null

          return (
            <button
              key={index}
              onClick={() => onMatchupClick(matchupId)}
              className="bg-gray-800 hover:bg-gray-700 rounded-lg p-4 transition-colors text-left w-full"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className={`flex items-center mb-2 ${winner?.roster_id === team1.roster_id ? 'text-green-400' : ''}`}>
                    {user1?.avatar && (
                      <Image
                        src={`https://sleepercdn.com/avatars/${user1.avatar}`}
                        alt={user1.display_name || user1.username || 'User'}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                    )}
                    <div>
                      <div className="font-medium">
                        {(user1 as any)?.metadata?.team_name || user1?.display_name || user1?.username || 'Unknown'}
                      </div>
                      {(user1 as any)?.metadata?.team_name && (
                        <div className="text-xs text-gray-400">
                          {user1?.display_name || user1?.username}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`flex items-center ${winner?.roster_id === team2.roster_id ? 'text-green-400' : ''}`}>
                    {user2?.avatar && (
                      <Image
                        src={`https://sleepercdn.com/avatars/${user2.avatar}`}
                        alt={user2.display_name || user2.username || 'User'}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                    )}
                    <div>
                      <div className="font-medium">
                        {(user2 as any)?.metadata?.team_name || user2?.display_name || user2?.username || 'Unknown'}
                      </div>
                      {(user2 as any)?.metadata?.team_name && (
                        <div className="text-xs text-gray-400">
                          {user2?.display_name || user2?.username}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold mb-1 ${winner?.roster_id === team1.roster_id ? 'text-green-400' : ''}`}>
                    {team1.points.toFixed(2)}
                  </div>
                  <div className={`text-lg font-bold ${winner?.roster_id === team2.roster_id ? 'text-green-400' : ''}`}>
                    {team2.points.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-400 text-center">
                Click to view details
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}