import { SleeperUser, SleeperLeague, SleeperRoster, SleeperMatchup } from '@/types/sleeper'

const BASE_URL = 'https://api.sleeper.app/v1'

export class SleeperAPI {
  static async getUser(username: string): Promise<SleeperUser | null> {
    try {
      const response = await fetch(`${BASE_URL}/user/${username}`)
      if (!response.ok) {
        return null
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  static async getUserLeagues(userId: string, season: string = '2025'): Promise<SleeperLeague[]> {
    try {
      const response = await fetch(`${BASE_URL}/user/${userId}/leagues/nfl/${season}`)
      if (!response.ok) {
        return []
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching user leagues:', error)
      return []
    }
  }

  static async getLeagueRosters(leagueId: string): Promise<SleeperRoster[]> {
    try {
      const response = await fetch(`${BASE_URL}/league/${leagueId}/rosters`)
      if (!response.ok) {
        return []
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching league rosters:', error)
      return []
    }
  }

  static async getLeagueUsers(leagueId: string): Promise<SleeperUser[]> {
    try {
      const response = await fetch(`${BASE_URL}/league/${leagueId}/users`)
      if (!response.ok) {
        return []
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching league users:', error)
      return []
    }
  }

  static async getMatchups(leagueId: string, week: number): Promise<SleeperMatchup[]> {
    try {
      const response = await fetch(`${BASE_URL}/league/${leagueId}/matchups/${week}`)
      if (!response.ok) {
        return []
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching matchups:', error)
      return []
    }
  }

  static async getNFLState(): Promise<{ season: string; week: number } | null> {
    try {
      const response = await fetch(`${BASE_URL}/state/nfl`)
      if (!response.ok) {
        return null
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching NFL state:', error)
      return null
    }
  }

  static async getNFLPlayers(): Promise<Record<string, any> | null> {
    try {
      const response = await fetch(`${BASE_URL}/players/nfl`)
      if (!response.ok) {
        return null
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching NFL players:', error)
      return null
    }
  }

  static async getLeague(leagueId: string): Promise<SleeperLeague | null> {
    try {
      const response = await fetch(`${BASE_URL}/league/${leagueId}`)
      if (!response.ok) {
        return null
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching league info:', error)
      return null
    }
  }
}