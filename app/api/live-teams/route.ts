import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const res = await fetch('https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard', { next: { revalidate: 30 } })
    if (!res.ok) {
      return NextResponse.json({ teams: [] }, { status: res.status })
    }
    const data = await res.json()
    const teams: string[] = []
    for (const event of data.events || []) {
      const competition = event.competitions?.[0]
      if (competition?.status?.type?.state === 'in') {
        for (const comp of competition.competitors || []) {
          const abbr = comp.team?.abbreviation
          if (abbr && !teams.includes(abbr)) {
            teams.push(abbr)
          }
        }
      }
    }
    return NextResponse.json({ teams })
  } catch (error) {
    console.error('Error fetching live teams:', error)
    return NextResponse.json({ teams: [] }, { status: 500 })
  }
}
