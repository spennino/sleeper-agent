import { SleeperMatchup, SleeperPlayer, SleeperLeague } from '@/types/sleeper'

// Standard lineup positions for best ball format
// Typically: 1 QB, 2 RB, 3 WR, 1 TE, 1 FLEX (RB/WR/TE), 1 K, 1 DEF
const BEST_BALL_LINEUP_POSITIONS = [
  { position: 'QB', count: 1 },
  { position: 'RB', count: 2 },
  { position: 'WR', count: 3 },
  { position: 'TE', count: 1 },
  { position: 'FLEX', count: 1 }, // RB/WR/TE
  { position: 'K', count: 1 },
  { position: 'DEF', count: 1 }
]

export function isBestBallLeague(league: SleeperLeague | null): boolean {
  return league?.settings?.best_ball === 1
}

export function calculateBestBallLineup(
  matchup: SleeperMatchup, 
  players: Record<string, any>
): { starters: string[], startersPoints: number[], totalPoints: number } {
  if (!matchup.players || !matchup.players_points) {
    return { starters: [], startersPoints: [], totalPoints: 0 }
  }

  // Get all players with their points and positions
  const playersWithPoints = matchup.players.map(playerId => {
    const player = players[playerId]
    const points = matchup.players_points[playerId] || 0
    
    return {
      id: playerId,
      points,
      position: player?.position || 'UNKNOWN',
      player
    }
  }).filter(p => p.points !== undefined)

  // Sort players by points (highest first)
  playersWithPoints.sort((a, b) => b.points - a.points)

  const selectedStarters: string[] = []
  const selectedPoints: number[] = []
  const usedPlayers = new Set<string>()

  // Fill each position requirement
  for (const positionReq of BEST_BALL_LINEUP_POSITIONS) {
    let filled = 0
    
    for (const playerData of playersWithPoints) {
      if (filled >= positionReq.count || usedPlayers.has(playerData.id)) {
        continue
      }

      let canFillPosition = false
      
      if (positionReq.position === 'FLEX') {
        // FLEX can be RB, WR, or TE
        canFillPosition = ['RB', 'WR', 'TE'].includes(playerData.position)
      } else if (positionReq.position === 'DEF') {
        // Defense position
        canFillPosition = playerData.position === 'DEF'
      } else {
        // Exact position match
        canFillPosition = playerData.position === positionReq.position
      }

      if (canFillPosition) {
        selectedStarters.push(playerData.id)
        selectedPoints.push(playerData.points)
        usedPlayers.add(playerData.id)
        filled++
      }
    }
  }

  const totalPoints = selectedPoints.reduce((sum, points) => sum + points, 0)

  return {
    starters: selectedStarters,
    startersPoints: selectedPoints,
    totalPoints
  }
}

export function createBestBallMatchup(originalMatchup: SleeperMatchup, players: Record<string, any>, league: SleeperLeague | null): SleeperMatchup {
  if (!isBestBallLeague(league)) {
    return originalMatchup
  }

  const bestBallResult = calculateBestBallLineup(originalMatchup, players)
  
  return {
    ...originalMatchup,
    starters: bestBallResult.starters,
    starters_points: bestBallResult.startersPoints,
    points: bestBallResult.totalPoints
  }
}