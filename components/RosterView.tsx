'use client'

import Image from 'next/image'
import { SleeperRoster, SleeperUser } from '@/types/sleeper'

interface RosterViewProps {
  roster: SleeperRoster
  user: SleeperUser
  players: Record<string, any>
  onClose: () => void
}

export default function RosterView({ roster, user, players, onClose }: RosterViewProps) {
  const renderPlayer = (playerId: string, position: string, isStarter: boolean = false) => {
    const player = players[playerId]
    
    if (!player) {
      return (
        <div className={`flex items-center py-2 px-3 rounded ${isStarter ? 'bg-gray-700' : 'bg-gray-800'}`}>
          <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3 text-xs">
            {position}
          </div>
          <div className="flex-1">
            <div className="text-sm text-gray-400">Empty Slot</div>
            <div className="text-xs text-gray-500">{position}</div>
          </div>
        </div>
      )
    }
    
    return (
      <div className={`flex items-center py-2 px-3 rounded ${isStarter ? 'bg-gray-700' : 'bg-gray-800'}`}>
        <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center mr-3 text-xs font-bold">
          {player.first_name?.[0]}{player.last_name?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">
            {player.full_name || `${player.first_name} ${player.last_name}`}
          </div>
          <div className="text-xs text-gray-400">
            {player.position} • {player.team || 'FA'}
            {player.injury_status && player.injury_status !== 'Healthy' && (
              <span className="text-red-400 ml-1">({player.injury_status})</span>
            )}
          </div>
        </div>
      </div>
    )
  }

  const getPlayersByPosition = () => {
    // Common fantasy positions
    const positions = ['QB', 'RB', 'WR', 'TE', 'FLEX', 'K', 'DEF']
    const startersByPosition: Record<string, string[]> = {}
    const bench: string[] = []
    
    // Initialize position arrays
    positions.forEach(pos => {
      startersByPosition[pos] = []
    })
    
    // Sort starters by position
    roster.starters.forEach((playerId, index) => {
      if (!playerId) return
      
      const player = players[playerId]
      if (player && player.position) {
        const position = player.position
        if (startersByPosition[position]) {
          startersByPosition[position].push(playerId)
        } else if (position === 'RB' || position === 'WR' || position === 'TE') {
          // These can go in FLEX
          if (startersByPosition['FLEX']) {
            startersByPosition['FLEX'].push(playerId)
          }
        }
      }
    })
    
    // Add bench players
    roster.players?.forEach(playerId => {
      if (!roster.starters.includes(playerId)) {
        bench.push(playerId)
      }
    })
    
    return { startersByPosition, bench }
  }

  const { startersByPosition, bench } = getPlayersByPosition()

  return (
    <div className="bg-gray-800 rounded-lg p-6 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          {user?.avatar && (
            <Image
              src={`https://sleepercdn.com/avatars/${user.avatar}`}
              alt={user.display_name || user.username || 'User'}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full mr-3"
            />
          )}
          <div>
            <h3 className="text-lg font-semibold">
              {(user as any)?.metadata?.team_name || user?.display_name || user?.username || 'Unknown'}
            </h3>
            {(user as any)?.metadata?.team_name && (
              <div className="text-sm text-gray-400">
                {user?.display_name || user?.username}
              </div>
            )}
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Record */}
      <div className="mb-6 p-3 bg-gray-700 rounded-lg">
        <div className="text-center">
          <div className="text-lg font-bold">
            {roster.settings.wins}-{roster.settings.losses}
            {roster.settings.ties > 0 && `-${roster.settings.ties}`}
          </div>
          <div className="text-sm text-gray-400">
            {((roster.settings.fpts || 0) + ((roster.settings.fpts_decimal || 0) / 100)).toFixed(2)} PF
          </div>
        </div>
      </div>

      {/* Starters */}
      <div className="mb-6">
        <h4 className="font-semibold text-sm text-gray-300 mb-3">Starters</h4>
        <div className="space-y-2">
          {roster.starters.map((playerId, index) => (
            <div key={`starter-${playerId}-${index}`}>
              {renderPlayer(playerId, `SLOT ${index + 1}`, true)}
            </div>
          ))}
        </div>
      </div>

      {/* Bench */}
      {bench.length > 0 && (
        <div>
          <h4 className="font-semibold text-sm text-gray-300 mb-3">Bench</h4>
          <div className="space-y-2">
            {bench.map((playerId) => (
              <div key={`bench-${playerId}`}>
                {renderPlayer(playerId, 'BENCH', false)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}