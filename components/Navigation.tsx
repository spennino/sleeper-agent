'use client'

interface NavigationProps {
  activeTab: 'standings' | 'matchups'
  onTabChange: (tab: 'standings' | 'matchups') => void
  week?: number
  onWeekChange?: (week: number) => void
}

export default function Navigation({ activeTab, onTabChange, week, onWeekChange }: NavigationProps) {
  const weeks = Array.from({ length: 18 }, (_, i) => i + 1)

  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => onTabChange('standings')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'standings'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Standings
          </button>
          <button
            onClick={() => onTabChange('matchups')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'matchups'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Matchups
          </button>
        </div>
        
        {activeTab === 'matchups' && week && onWeekChange && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-300">Week:</label>
            <select
              value={week}
              onChange={(e) => onWeekChange(Number(e.target.value))}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {weeks.map(w => (
                <option key={w} value={w}>Week {w}</option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  )
}