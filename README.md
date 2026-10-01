# FitTrack — Clean & Modern Fitness Tracking App

A simple, clean, responsive, and modern fitness tracking web application built with **React 19**, **TypeScript**, **Tailwind CSS**, and **Lucide Icons**. Users can record their daily fitness activities, customize their daily targets, view real-time goal progress, and analyze 7-day performance metrics.

---

## 🚀 Key Features

### 1. 📊 Interactive Dashboard
- **Today's Fitness Summary**: Real-time counter cards for **Steps**, **Calories burned**, **Workout duration**, and **Number of workouts**.
- **Daily Goal Progress Bars**: Visual progress bars showing current values against targets (e.g., `6,500 / 10,000 steps`, `320 / 500 kcal`, `35 / 60 min`) with milestone badges and celebration indicators.
- **7-Day Trend Preview**: Mini responsive SVG chart of recent activity with easy toggling between Calories, Steps, and Workout Duration.
- **Recent Workouts**: Quick list of the most recent workouts with instant access to the full history.

### 2. ➕ Add Fitness Activity
- **Exercise Type Selection**: Quick-select grid with visual icons (Running, Walking, Cycling, Gym/Strength, Yoga, Swimming, Hiking, HIIT, and Other).
- **Flexible Fields**:
  - Workout duration (minutes) with quick preset chips (15m, 30m, 45m, 60m).
  - Calories burned with a handy **Auto-Calculate** button based on metabolic rates.
  - Steps count (with 0-step shortcut for non-step activities like Yoga or Swimming).
  - Date selector (defaults to today, quick shortcuts for Today and Yesterday).
  - Optional personal workout notes.
- **Strict Validation**:
  - Activity type is required.
  - Duration must be greater than 0 minutes (no negative duration).
  - Calories burned cannot be negative.
  - Steps cannot be negative.
  - Date is required.
  - Inline error banners with clear feedback.
- **Immediate Reactive Updates**: Automatically saves to storage, updates dashboard cards and charts immediately, triggers a success toast, and clears the form.

### 3. 📜 Activity History
- **Clean List / Card Format**: Displays type badge, formatted date, duration, calories, steps, and notes.
- **Search & Filters**:
  - Full-text search across activity types and notes.
  - Filter by activity type (All, Running, Walking, Cycling, etc.).
  - Filter by date range (All Time, Today Only, Past 7 Days, Past 30 Days).
  - Sort by date (newest/oldest), calories (high to low), duration, or steps.
- **Full CRUD Support**:
  - **Edit Activity**: Re-opens form with prefilled values, allowing users to update metrics or notes.
  - **Delete Activity**: Safe deletion with a confirmation modal showing workout details before permanent removal.

### 4. 📈 Weekly Progress & 7-Day Chart
- **Weekly Aggregates**:
  - Total Steps & Daily Average.
  - Total Calories Burned & Daily Average.
  - Total Workout Minutes & Daily Average.
  - Number of Workout Sessions.
- **Interactive 7-Day SVG Chart**:
  - Responsive SVG bar chart with smooth styling.
  - Interactive hover tooltips showing day, date, and metrics.
  - Metric switcher: Toggle between Calories, Steps, and Duration.
  - Goal target reference line showing daily benchmarks.
  - Distinct indicator for "Today".
- **Daily Breakdown Table**: Day-by-day tabular view showing workouts, steps, calories, duration, and goal achievement badges.

### 5. 🎯 Customizable Daily Goals
- Configurable daily goals for **Steps**, **Active Calories**, and **Workout Minutes**.
- Accessible anytime from the dashboard or header.
- Includes quick-selection preset buttons (e.g. 6k, 8k, 10k, 12k steps).
- Progress bars and summary cards instantly recalculate upon saving.

### 6. 💾 Local Storage Persistence & Modular Architecture
- Data is saved to `localStorage` under `fittrack_activities_v1` and `fittrack_goals_v1`.
- Preserves all records and goal settings across page reloads and browser restarts.
- **Modular Data Service Layer** (`src/services/storageService.ts`):
  - Abstracted API (`loadActivities`, `addActivity`, `updateActivity`, `deleteActivity`, `loadGoals`, `saveGoals`) designed for seamless replacement with **SQLite**, **Supabase**, or **Firebase**.

### 7. 🎁 First Launch Sample / Demo Data
- Automatically seeds realistic sample activities for the last 7 days on the very first launch.
- Every sample record is clearly badged with a **"Sample Record"** tag.
- Includes quick toolbar controls to **"Clear Sample Data Only"** or **"Reset to Demo Data"** at any time.

### 8. 🕊️ Friendly Empty States
- When all activities are cleared or none are recorded, friendly empty states appear in the Dashboard, History, and Progress views:
  > *"No activities recorded yet. Add your first workout!"*
- Includes a direct **"Add Activity"** button and an optional **"Load Demo Data"** button.

---

## 🛠️ Technology Stack

- **React 19**
- **TypeScript 5.8** (Strict mode)
- **Vite 8**
- **Tailwind CSS v4** (`@tailwindcss/vite`)
- **Lucide React** (Modern, consistent iconography)
- **Vitest & @testing-library/react** (Full automated unit & flow testing)

---

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── activity/
│   │   │   ├── ActivityForm.tsx       # Reusable Add & Edit form with validation
│   │   │   ├── ActivityModal.tsx      # Modal dialog wrapper for adding/editing
│   │   │   ├── AddActivityView.tsx    # Dedicated Add Activity screen view
│   │   │   └── DeleteModal.tsx        # Delete confirmation dialog
│   │   ├── common/
│   │   │   ├── ActivityIcon.tsx       # Activity type to Lucide icon mapper
│   │   │   └── EmptyState.tsx         # Reusable friendly empty state component
│   │   ├── dashboard/
│   │   │   ├── DashboardView.tsx      # Main dashboard page layout
│   │   │   ├── GoalProgress.tsx       # Daily target progress bars & badges
│   │   │   └── SummaryCards.tsx       # Steps, Calories, Duration, Workouts cards
│   │   ├── goals/
│   │   │   └── GoalSettingsModal.tsx  # Modal to adjust daily goals
│   │   ├── history/
│   │   │   ├── ActivityCard.tsx       # Workout card item with edit/delete triggers
│   │   │   └── ActivityList.tsx       # History screen with search, filters & sort
│   │   ├── layout/
│   │   │   ├── BottomNav.tsx          # Mobile fixed bottom navigation bar
│   │   │   ├── Header.tsx             # Top header bar with date and actions
│   │   │   ├── Sidebar.tsx            # Desktop sidebar navigation with target glance
│   │   │   └── Toast.tsx              # Toast notification container
│   │   └── progress/
│   │       ├── WeeklyChart.tsx        # Responsive SVG 7-day bar chart
│   │       └── WeeklyProgressView.tsx # Weekly performance screen & breakdown
│   ├── context/
│   │   └── FitnessContext.tsx         # Central React context & state management
│   ├── services/
│   │   └── storageService.ts          # LocalStorage abstraction & demo seeder
│   ├── test/
│   │   ├── fitnessFlow.test.tsx       # Complete user flow & validation tests
│   │   ├── setup.ts                   # Jest DOM test environment setup
│   │   └── storageService.test.ts     # Storage service unit tests
│   ├── types/
│   │   └── fitness.ts                 # TypeScript interfaces and types
│   ├── utils/
│   │   └── formatters.ts              # Date, number, calorie, and duration utilities
│   ├── App.tsx                        # Root layout component
│   ├── index.css                      # Tailwind CSS v4 entry
│   └── main.tsx                       # React application entry point
├── vitest.config.ts                   # Vitest testing configuration
└── package.json
```

---

## 🏃 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

### 3. Run Automated Tests
```bash
npm test
```
All 11 unit and flow tests will run and verify:
- Storage initialization and persistence
- Validation rules (negative and missing inputs rejected)
- Full user flow: Add Activity → Save → Dashboard updates → History updates → Weekly stats update → Refresh page → Edit → Delete
- Goal adjustment
- Empty state behavior

### 4. Build for Production
```bash
npm run build
```

### 5. Preview Production Build
```bash
npm run preview
```
