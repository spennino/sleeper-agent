export interface SleeperUser {
  user_id: string
  username: string
  display_name: string
  avatar: string
  metadata?: {
    team_name?: string
    avatar?: string
    [key: string]: any
  }
}

export interface SleeperLeague {
  league_id: string
  name: string
  season: string
  status: string
  sport: string
  season_type: string
  total_rosters: number
  avatar?: string
  settings: {
    max_keepers: number
    draft_rounds: number
    trade_deadline: number
    playoff_week_start: number
    num_teams: number
    league_average_match: number
    leg: number
    playoff_type: number
    playoff_round_type: number
    playoff_seed_type: number
    squads: number
    teams: number
    map_id: number
    best_ball?: number // 1 for best ball leagues, undefined for regular leagues
  }
  scoring_settings: Record<string, number>
  roster_positions: string[]
  previous_league_id: string
}

export interface SleeperRoster {
  roster_id: number
  owner_id: string
  league_id: string
  players: string[]
  starters: string[]
  settings: {
    wins: number
    waiver_position: number
    waiver_budget_used: number
    total_moves: number
    ties: number
    losses: number
    fpts: number
    fpts_decimal: number
    fpts_against: number
    fpts_against_decimal: number
  }
}

export interface SleeperMatchup {
  matchup_id: number
  roster_id: number
  points: number
  players: string[]
  starters: string[]
  players_points: Record<string, number>
  starters_points: number[]
}

export interface SleeperPlayer {
  player_id: string
  first_name: string
  last_name: string
  full_name: string
  position: string
  team: string
  status: string
  fantasy_positions: string[]
  number: number
  depth_chart_position: number
  height: string
  weight: string
  age: number
  birth_date: string
  college: string
  sport: string
  injury_status: string
}