# Sleeper Agent

A beautiful dark-mode fantasy football dashboard built with Next.js, React, TypeScript, and Tailwind CSS. Track your Sleeper fantasy leagues, view standings, and analyze matchups with an intuitive interface.

## Features

- **User Authentication**: Enter your Sleeper username to access your leagues
- **League Management**: Toggle between multiple leagues you're part of
- **Standings View**: See team rankings with wins, losses, points for/against
- **Matchups View**: View weekly matchups with scores and team details
- **Detailed Matchup Analysis**: Click into matchups to see starter/bench breakdown
- **Week Navigation**: Browse different weeks of the season
- **Local Storage**: Your username is remembered for future visits
- **Dark Mode Design**: Beautiful dark theme optimized for extended use
- **Responsive**: Works great on desktop and mobile devices

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Usage

1. Enter your Sleeper username on the homepage
2. Select a league if you have multiple
3. Use the navigation tabs to switch between Standings and Matchups
4. In Matchups view, use the week selector to browse different weeks
5. Click on any matchup to see detailed player breakdowns

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **API**: Sleeper Fantasy API (no authentication required)

## API Integration

This app uses the [Sleeper API](https://docs.sleeper.com/) to fetch:
- User data by username
- User's fantasy leagues
- League rosters and standings
- Weekly matchups and scores
- Current NFL week information

## Project Structure

```
├── app/                 # Next.js App Router pages
├── components/          # React components
├── lib/                 # Utility functions and API client
├── types/               # TypeScript type definitions
└── public/              # Static assets
```

## Contributing

Feel free to submit issues and enhancement requests!

## License

This project is open source and available under the [MIT License](LICENSE).