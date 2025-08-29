# Sleeper Agent

A beautiful dark-mode fantasy football dashboard built with Next.js, React, TypeScript, and Tailwind CSS. Track your Sleeper fantasy leagues, view standings, and analyze matchups with an intuitive interface.

🌐 **Live Demo**: https://sleeper-agent-kenacgahz-seans-projects-40ab1836.vercel.app

## ✨ Features

- **🔐 User Authentication**: Enter your Sleeper username to access your leagues
- **🏈 League Management**: Toggle between multiple leagues you're part of  
- **📊 Standings View**: See team rankings with wins, losses, points for/against
- **⚔️ Matchups View**: View weekly matchups with scores and team details
- **🔍 Detailed Matchup Analysis**: Click into matchups to see starter/bench breakdown
- **👥 Interactive Roster Views**: Click any team in standings to view their complete roster
- **📅 Week Navigation**: Browse different weeks of the season
- **🔗 Deep Linking**: Direct URLs to leagues, matchups, and specific weeks
- **💾 Local Storage**: Your username is remembered for future visits
- **🌙 Dark Mode Design**: Beautiful dark theme optimized for extended use
- **📱 Responsive**: Works great on desktop and mobile devices
- **✨ Smooth Animations**: Slide-in roster views and hover effects

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd sleeper-agent
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Usage

1. **Enter your Sleeper username** on the homepage
2. **Select a league** if you have multiple
3. **Navigate between views:**
   - **Standings**: View team rankings, click any team to see their roster
   - **Matchups**: Browse weekly matchups, click for detailed breakdowns
4. **Use week selector** to browse different weeks of the season
5. **Share direct links** to specific leagues, weeks, or matchups

## 📦 Deployment

### 🌐 Deploy to Vercel (Recommended)

#### Option 1: Vercel CLI (Fastest)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Build and deploy:**
   ```bash
   npm run build  # Test production build
   vercel --prod  # Deploy to production
   ```

3. **Your app will be live at:**
   ```
   https://your-app-name.vercel.app
   ```

#### Option 2: GitHub Integration

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy Sleeper Agent"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Deploy automatically on every push

### 🌐 Custom Domain Setup

#### Method 1: Buy Through Vercel (Easiest)

1. **Go to Vercel Dashboard** → Your Project → Settings → Domains
2. **Click "Buy Domain"** and search for your desired domain
3. **Complete purchase** - DNS is configured automatically
4. **Done!** Your app will be live at your custom domain

#### Method 2: Use External Domain Registrar

1. **Buy domain** from Namecheap, Google Domains, etc.

2. **Add DNS records** in your registrar's control panel:
   ```
   A Record:
   Host: @ (or blank)
   Value: 76.76.19.61

   CNAME Record:  
   Host: www
   Value: cname.vercel-dns.com.
   ```

3. **Add domain to Vercel:**
   ```bash
   vercel domains add yourdomain.com your-project-name
   ```

4. **Wait 5-48 hours** for DNS propagation

### 🛠️ Production Build

**Test production build locally:**
```bash
npm run build
npm start
```

**Build output analysis:**
- Main App: ~104KB first load
- League Pages: ~111KB first load
- All routes are optimized for performance

### 🔧 Environment Configuration

**Optional environment variables:**
```bash
# .env.local (if needed for custom API endpoints)
NEXT_PUBLIC_API_BASE_URL=https://api.sleeper.app/v1
```

### 📊 Deployment Checklist

- ✅ **Build succeeds**: `npm run build`
- ✅ **Linting passes**: `npm run lint`
- ✅ **All routes work**: Test deep linking
- ✅ **Mobile responsive**: Test on different screen sizes
- ✅ **Performance**: Check loading times
- ✅ **SSL certificate**: Automatic with Vercel
- ✅ **CDN distribution**: Global edge network

## 🏗️ Tech Stack

- **Framework**: Next.js 15 with App Router
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **Deployment**: Vercel with automatic deployments
- **API**: Sleeper Fantasy API (no authentication required)

## 🔌 API Integration

This app uses the [Sleeper API](https://docs.sleeper.com/) to fetch:
- User data by username
- User's fantasy leagues  
- League rosters and standings
- Weekly matchups and scores
- NFL player information
- Current NFL week and season

**No API keys required** - all endpoints are publicly accessible.

## 📁 Project Structure

```
├── app/                 # Next.js App Router pages
│   ├── user/[username]/ # User league selection
│   ├── league/          # League-specific routes
│   └── globals.css      # Global styles and animations
├── components/          # Reusable React components
│   ├── UsernameInput.tsx
│   ├── LeagueSelector.tsx
│   ├── Standings.tsx
│   ├── Matchups.tsx
│   ├── MatchupDetail.tsx
│   └── RosterView.tsx
├── lib/                 # Utility functions and API client
│   └── sleeper-api.ts
├── types/               # TypeScript type definitions
│   └── sleeper.ts
├── public/              # Static assets
└── vercel.json         # Deployment configuration
```

## 🔗 URL Structure

- `/` - Homepage with username input
- `/user/[username]` - User's leagues
- `/league/[league_id]` - League standings
- `/league/[league_id]/matchups/[week]` - Weekly matchups
- `/league/[league_id]/matchup/[week]/[matchup_id]` - Matchup details

## 🐛 Troubleshooting

### Common Issues

**Build fails:**
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

**API rate limiting:**
- The Sleeper API has a limit of 1000 calls/minute
- The app optimizes calls by caching NFL player data

**Domain not working:**
- DNS propagation can take up to 48 hours
- Check DNS settings match Vercel's requirements
- Verify domain is added in Vercel dashboard

**Performance issues:**
- Enable image optimization in `next.config.js`
- Check bundle analyzer: `npm run build && npx @next/bundle-analyzer .next`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ using Claude Code** - [Learn more about Claude Code](https://claude.ai/code)