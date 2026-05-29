# 🏠 Puing House - Cozy Couple Productivity Web App

A beautiful, warm, and cozy web application for couples to manage their household tasks, care for their beloved cat, share notes, and track their daily moods together.

## ✨ Features

### 🎯 Core Features

- **🔐 PIN Authentication** - Simple 4-digit household PIN (no account needed)
- **🏡 Beautiful Dashboard** - Real-time overview of household status
- **✅ Shared Task Management** - Create, assign, and track tasks together
- **😸 Cat Care Tracking** - Monitor feeding, water, grooming, and health
- **💕 Shared Notes** - Leave love notes and reminders for each other
- **😊 Mood Tracker** - Daily mood tracking for both partners
- **🌙 Time-Based Theming** - Ambient experience that changes based on time of day

### 🎨 Design Philosophy

- Cozy minimalist aesthetic
- Warm, calming color palette
- Smooth Framer Motion animations
- Mobile-first responsive design
- Inspired by Apple Reminders, Notion, and cozy games

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom Design System
- **Animations**: Framer Motion
- **Backend**: Firebase (Firestore + Cloud Messaging)
- **State Management**: Zustand
- **Icons**: Lucide React
- **Utilities**: date-fns, clsx

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase project (optional for demo mode)

### Installation

1. Clone or download the project
2. Install dependencies:

```bash
npm install
```

3. Create `.env.local` file (optional for Firebase):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

**Demo PIN: `1234`**

### Build for Production

```bash
npm run build
npm start
```

### Firebase Setup


1. Create a Firebase project
2. Enable Firestore, Storage, and Cloud Messaging
3. Add your env vars to `.env.local`
4. Deploy the provided rules:

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

5. Seed the demo household (optional):

```bash
FIREBASE_SERVICE_ACCOUNT_PATH=./service-account.json npm run seed:firestore
```

## 📁 Project Structure

```
mochi-house/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main entry point
│   └── globals.css          # Global styles
├── components/
│   ├── auth/
│   │   └── PINAuth.tsx      # PIN authentication screen
│   ├── dashboard/
│   │   ├── Dashboard.tsx    # Main dashboard router
│   │   └── HomePage.tsx     # Home page
│   ├── tasks/
│   │   └── TasksPage.tsx    # Tasks management
│   ├── mochi/
│   │   └── MochiPage.tsx    # Cat care tracking
│   ├── notes/
│   │   └── NotesPage.tsx    # Shared notes
│   ├── settings/
│   │   └── SettingsPage.tsx # Settings page
│   └── layout/
│       └── BottomNav.tsx    # Mobile navigation
├── lib/
│   ├── firebase.ts          # Firebase config
│   ├── firestore-hooks.ts   # Firestore hooks
│   ├── stores.ts            # Zustand stores
│   ├── theme-context.tsx    # Theme provider
│   └── types.ts             # TypeScript types
├── package.json
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json
└── README.md
```

## 🎨 Design System

### Color Palette

- **Cream**: `#FFF9F5` - Primary background
- **Beige**: `#F5E6D3` - Secondary background
- **Warm**: `#E8D5C4` - Accent
- **Brown**: `#8B7355` - Text
- **Sage**: `#A4B5A0` - Primary action
- **Accent**: `#D4A574` - Highlights

### Typography

- **Font**: Inter (via Google Fonts)
- **Headings**: Bold 2xl-4xl
- **Body**: Regular 16px
- **Spacing**: Large, breathing space

### Border Radius

- Default: `16px`
- Small: `8px`
- Large: `20px`
- Extra Large: `24px`

## 📱 Pages & Features

### 1. **PIN Authentication**

- Clean 4-digit keypad
- Visual feedback
- Demo mode (PIN: 1234)
- Responsive on mobile

### 2. **Home Dashboard**

- Daily greeting based on time
- Partner mood status
- Today's tasks overview
- Mochi's care status
- Quick notes section
- Beautiful card layout

### 3. **Tasks Page**

- View all tasks
- Filter by person, priority, or status
- Mark tasks complete with animation
- Create new tasks
- Delete tasks
- Progress bar

### 4. **Mochi Care Page**

- Cute cat header
- Quick stats (Fed, Water, Health)
- Care action buttons
- Timeline of care logs
- Log new care events

### 5. **Shared Notes**

- Leave love notes for partner
- Color-coded by author
- Timestamps
- Delete notes
- Emoji support

### 6. **Settings**

- Toggle notifications
- Appearance settings
- Household PIN management
- About section
- Logout button

## 🔄 Real-Time Sync

The app uses Firebase Firestore for real-time data synchronization:

```typescript
// Collections structure
household/
├── tasks/
├── cat_logs/
├── moods/
├── notes/
├── notifications/
```

Integrate with your Firestore by:

1. Setting up Firebase project
2. Creating the collections above
3. Adding your credentials to `.env.local`
4. Updating the `firestore-hooks.ts` with real queries

## 🌙 Ambient Experience

The app changes appearance based on time of day:

- **Morning (5-12)**: Bright, warm beige gradient
- **Afternoon (12-17)**: Light, calm palette
- **Evening (17-21)**: Warm, sunset-inspired
- **Night (21-5)**: Dark mode with cozy atmosphere

## 🎬 Animations

Smooth animations powered by Framer Motion:

- Page transitions
- Task completion celebration
- Floating elements
- Hover effects
- Modal appearances
- Smooth color transitions

## 📱 Mobile Responsive

- Mobile-first design
- Bottom navigation for easy thumb access
- Touch-friendly buttons
- Adaptive layouts
- Full-screen experience on mobile

## 🚀 Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy

```bash
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... add all other env vars
vercel
```

### Deploy Anywhere

Next.js can be deployed to:

- Vercel (recommended)
- Netlify
- Railway
- AWS Amplify
- Docker containers

## 🔐 Security Considerations

- PIN is stored in localStorage (for demo)
- For production, implement backend PIN validation
- Enable Firestore security rules
- Use environment variables for secrets
- Consider adding real authentication
- Keep Firebase service account JSON out of the repo

## 🛣️ Future Enhancements

- [ ] Real Firebase integration with proper auth
- [ ] Photo upload for cat gallery
- [ ] Recurring task templates
- [ ] Calendar view
- [ ] Recurring mood reminders
- [ ] Monthly reports
- [ ] Push notifications
- [ ] Recurring task automation
- [ ] Budget tracking
- [ ] Dark mode toggle

## 🤝 Contributing

This is a personal project, but feel free to fork and customize!

## 📝 License

This project is open source and available under the MIT License.

---

**Remember:** The best productivity app is one you'll actually use. Make it cozy, make it fun, make it yours! 🏠✨
