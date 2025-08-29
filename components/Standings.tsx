'use client'

import Image from 'next/image'
import { SleeperRoster, SleeperUser } from '@/types/sleeper'

interface StandingsProps {
  rosters: SleeperRoster[]
  users: SleeperUser[]
}

export default function Standings({ rosters, users }: StandingsProps) {
  const getUserByOwnerId = (ownerId: string) => {
    return users.find(user => user.user_id === ownerId)
  }

  const sortedRosters = [...rosters].sort((a, b) => {
    const aWinPct = a.settings.wins / (a.settings.wins + a.settings.losses + a.settings.ties)
    const bWinPct = b.settings.wins / (b.settings.wins + b.settings.losses + b.settings.ties)
    
    if (aWinPct !== bWinPct) return bWinPct - aWinPct
    
    return (b.settings.fpts + (b.settings.fpts_decimal / 100)) - (a.settings.fpts + (a.settings.fpts_decimal / 100))
  })

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Standings</h2>
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">#</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Team</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">W</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">L</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">T</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">PCT</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">PF</th>
                <th className="px-4 py-3 text-center text-sm font-medium text-gray-300">PA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sortedRosters.map((roster, index) => {
                const user = getUserByOwnerId(roster.owner_id)
                const totalGames = roster.settings.wins + roster.settings.losses + roster.settings.ties
                const winPct = totalGames > 0 ? (roster.settings.wins / totalGames * 100).toFixed(1) : '0.0'
                const pointsFor = (roster.settings.fpts + (roster.settings.fpts_decimal / 100)).toFixed(2)
                const pointsAgainst = (roster.settings.fpts_against + (roster.settings.fpts_against_decimal / 100)).toFixed(2)
                
                return (
                  <tr key={roster.roster_id} className="hover:bg-gray-750">
                    <td className="px-4 py-3 text-sm font-medium">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {user?.avatar && (
                          <Image
                            src={`https://sleepercdn.com/avatars/${user.avatar}`}
                            alt={user.display_name || user.username || 'User'}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        )}
                        <span className="text-sm font-medium">
                          {user?.display_name || user?.username || 'Unknown'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm">{roster.settings.wins}</td>
                    <td className="px-4 py-3 text-center text-sm">{roster.settings.losses}</td>
                    <td className="px-4 py-3 text-center text-sm">{roster.settings.ties}</td>
                    <td className="px-4 py-3 text-center text-sm">{winPct}%</td>
                    <td className="px-4 py-3 text-center text-sm">{pointsFor}</td>
                    <td className="px-4 py-3 text-center text-sm">{pointsAgainst}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}