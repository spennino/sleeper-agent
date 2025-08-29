'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { SleeperAPI } from '@/lib/sleeper-api'

export default function MatchupsRedirect() {
  const params = useParams()
  const router = useRouter()
  const leagueId = params.league_id as string

  useEffect(() => {
    const redirectToCurrentWeek = async () => {
      const nflState = await SleeperAPI.getNFLState()
      const currentWeek = nflState?.week || 1
      router.replace(`/league/${leagueId}/matchups/${currentWeek}`)
    }
    
    redirectToCurrentWeek()
  }, [leagueId, router])

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto text-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    </main>
  )
}