'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SleeperAPI } from '@/lib/sleeper-api'
import { SleeperUser } from '@/types/sleeper'
import UsernameInput from '@/components/UsernameInput'

export default function Home() {
  const router = useRouter()
  const [currentSeason, setCurrentSeason] = useState('2025')

  useEffect(() => {
    const getCurrentSeason = async () => {
      const nflState = await SleeperAPI.getNFLState()
      if (nflState) {
        setCurrentSeason(nflState.season)
      }
    }
    getCurrentSeason()
  }, [])

  const handleUserLoaded = (user: SleeperUser) => {
    // Redirect to user page
    router.push(`/user/${user.username}`)
  }

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Sleeper Agent
          </h1>
          <p className="text-gray-400 text-lg">
            Your fantasy football command center
          </p>
        </div>
        <UsernameInput onUserLoaded={handleUserLoaded} currentSeason={currentSeason} />
      </div>
    </main>
  )
}