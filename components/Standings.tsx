'use client'

import { useState } from 'react'
import Image from 'next/image'
import { SleeperRoster, SleeperUser } from '@/types/sleeper'
import RosterView from './RosterView'

interface StandingsProps {
  rosters: SleeperRoster[]
  users: SleeperUser[]
  players: Record<string, any>
}

export default function Standings({ rosters, users, players }: StandingsProps) {
  const [selectedRoster, setSelectedRoster] = useState<SleeperRoster | null>(null)
  const getUserByOwnerId = (ownerId: string) => {
    return users.find(user => user.user_id === ownerId)
  }

  const sortedRosters = [...rosters].sort((a, b) => {
    const aWinPct = a.settings.wins / (a.settings.wins + a.settings.losses + a.settings.ties)
    const bWinPct = b.settings.wins / (b.settings.wins + b.settings.losses + b.settings.ties)
    
    if (aWinPct !== bWinPct) return bWinPct - aWinPct
    
    return (b.settings.fpts + (b.settings.fpts_decimal / 100)) - (a.settings.fpts + (a.settings.fpts_decimal / 100))
  })

  const handleRowClick = (roster: SleeperRoster) => {
    setSelectedRoster(roster)
  }

  const handleCloseRoster = () => {
    setSelectedRoster(null)
  }

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Standings</h2>
      <div className="flex gap-6">
        {/* Standings Table */}
        <div 
          className={`bg-gray-800 rounded-lg overflow-hidden transition-all duration-300 ${
            selectedRoster ? 'w-2/3' : 'w-full'
          }`}
        >
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
                const avatar = user?.metadata?.avatar || user?.avatar
                const totalGames = roster.settings.wins + roster.settings.losses + roster.settings.ties
                const winPct = totalGames > 0 ? (roster.settings.wins / totalGames * 100).toFixed(1) : '0.0'
                const pointsFor = ((roster.settings.fpts || 0) + ((roster.settings.fpts_decimal || 0) / 100)).toFixed(2)
                const pointsAgainst = ((roster.settings.fpts_against || 0) + ((roster.settings.fpts_against_decimal || 0) / 100)).toFixed(2)

                return (
                  <tr
                    key={roster.roster_id}
                    onClick={() => handleRowClick(roster)}
                    className={`hover:bg-gray-750 cursor-pointer transition-colors ${
                      selectedRoster?.roster_id === roster.roster_id ? 'bg-blue-900' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium">{index + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        {avatar && (
                          <Image
                            src={`https://sleepercdn.com/avatars/${avatar}`}
                            alt={user?.display_name || user?.username || 'User'}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium">
                            {user?.metadata?.team_name || user?.display_name || user?.username || 'Unknown'}
                          </div>
                          {user?.metadata?.team_name && (
                            <div className="text-xs text-gray-400">
                              {user?.display_name || user?.username}
                            </div>
                          )}
                        </div>
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

      {/* Roster View Sidebar */}
      {selectedRoster && (
        <div className="w-1/3 animate-slide-in-right">
          <RosterView
            roster={selectedRoster}
            user={getUserByOwnerId(selectedRoster.owner_id)!}
            players={players}
            onClose={handleCloseRoster}
          />
        </div>
      )}
      </div>
    </div>
  )
}