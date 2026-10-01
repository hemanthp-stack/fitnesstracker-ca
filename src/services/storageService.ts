import type { DailyGoals, FitnessActivity } from '../types/fitness';


const STORAGE_KEYS = {
  ACTIVITIES: 'fittrack_activities_v1',
  GOALS: 'fittrack_goals_v1',
  INITIALIZED: 'fittrack_initialized_v1',
};

export const DEFAULT_GOALS: DailyGoals = {
  steps: 10000,
  calories: 500,
  workoutMinutes: 60,
};

function getDateOffset(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function generateSampleActivities(): FitnessActivity[] {
  const now = new Date().toISOString();
  
  return [
    {
      id: 'sample-1',
      type: 'Running',
      duration: 35,
      calories: 380,
      steps: 4500,
      date: getDateOffset(0), // Today
      time: '07:30',
      notes: 'Morning run in the neighborhood, felt energized!',
      isSample: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'sample-2',
      type: 'Yoga',
      duration: 25,
      calories: 90,
      steps: 0,
      date: getDateOffset(0), // Today
      time: '18:15',
      notes: 'Evening flexibility & recovery flow',
      isSample: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'sample-3',
      type: 'Gym',
      duration: 50,
      calories: 340,
      steps: 1500,
      date: getDateOffset(-1), // Yesterday
      time: '17:45',
      notes: 'Chest and shoulders dumbbell session',
      isSample: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'sample-4',
      type: 'Walking',
      duration: 40,
      calories: 190,
      steps: 4600,
      date: getDateOffset(-2),
      time: '12:30',
      notes: 'Post-lunch brisk walk around the campus',
      isSample: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'sample-5',
      type: 'Cycling',
      duration: 45,
      calories: 410,
      steps: 0,
      date: getDateOffset(-3),
      time: '08:00',
      notes: 'Scenic bike ride along the river trail',
      isSample: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'sample-6',
      type: 'HIIT',
      duration: 30,
      calories: 350,
      steps: 2800,
      date: getDateOffset(-4),
      time: '19:00',
      notes: 'Tabata interval sprints and bodyweight circuits',
      isSample: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'sample-7',
      type: 'Hiking',
      duration: 65,
      calories: 460,
      steps: 6800,
      date: getDateOffset(-5),
      time: '10:00',
      notes: 'Nature park trail hike with friends',
      isSample: true,
      createdAt: now,
      updatedAt: now,
    },
    {
      id: 'sample-8',
      type: 'Swimming',
      duration: 40,
      calories: 360,
      steps: 0,
      date: getDateOffset(-6),
      time: '16:30',
      notes: 'Laps in community pool (freestyle + backstroke)',
      isSample: true,
      createdAt: now,
      updatedAt: now,
    },
  ];
}

class StorageService {
  /**
   * Initializes storage with sample data if it's the very first app launch.
   */
  public initialize(): { activities: FitnessActivity[]; goals: DailyGoals } {
    try {
      const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
      let activities: FitnessActivity[];
      let goals: DailyGoals;

      if (!isInitialized) {
        // First launch: seed sample data
        activities = generateSampleActivities();
        goals = { ...DEFAULT_GOALS };
        this.saveActivities(activities);
        this.saveGoals(goals);
        localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
      } else {
        activities = this.loadActivities();
        goals = this.loadGoals();
      }

      return { activities, goals };
    } catch (err) {
      console.warn('LocalStorage error or unavailable, falling back to memory/defaults:', err);
      return {
        activities: generateSampleActivities(),
        goals: { ...DEFAULT_GOALS },
      };
    }
  }

  public loadActivities(): FitnessActivity[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error('Failed to parse activities from localStorage:', err);
      return [];
    }
  }

  public saveActivities(activities: FitnessActivity[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
    } catch (err) {
      console.error('Failed to save activities to localStorage:', err);
    }
  }

  public addActivity(
    data: Omit<FitnessActivity, 'id' | 'createdAt' | 'updatedAt'>
  ): FitnessActivity {
    const activities = this.loadActivities();
    const now = new Date().toISOString();
    const newActivity: FitnessActivity = {
      ...data,
      id: `act_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      createdAt: now,
      updatedAt: now,
      isSample: false,
    };

    // Prepend new activity so it appears first
    const updated = [newActivity, ...activities];
    this.saveActivities(updated);
    return newActivity;
  }

  public updateActivity(
    id: string,
    updates: Partial<Omit<FitnessActivity, 'id' | 'createdAt'>>
  ): FitnessActivity | null {
    const activities = this.loadActivities();
    const index = activities.findIndex((a) => a.id === id);
    if (index === -1) return null;

    const updatedActivity: FitnessActivity = {
      ...activities[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    activities[index] = updatedActivity;
    this.saveActivities(activities);
    return updatedActivity;
  }

  public deleteActivity(id: string): boolean {
    const activities = this.loadActivities();
    const filtered = activities.filter((a) => a.id !== id);
    if (filtered.length === activities.length) return false;

    this.saveActivities(filtered);
    return true;
  }

  public loadGoals(): DailyGoals {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.GOALS);
      if (!raw) return { ...DEFAULT_GOALS };
      const parsed = JSON.parse(raw);
      return {
        steps: Number(parsed.steps) || DEFAULT_GOALS.steps,
        calories: Number(parsed.calories) || DEFAULT_GOALS.calories,
        workoutMinutes: Number(parsed.workoutMinutes) || DEFAULT_GOALS.workoutMinutes,
      };
    } catch (err) {
      console.error('Failed to load goals:', err);
      return { ...DEFAULT_GOALS };
    }
  }

  public saveGoals(goals: DailyGoals): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
    } catch (err) {
      console.error('Failed to save goals:', err);
    }
  }

  public resetToSampleData(): FitnessActivity[] {
    const sample = generateSampleActivities();
    this.saveActivities(sample);
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    return sample;
  }

  public clearAllActivities(): void {
    this.saveActivities([]);
  }

  public clearSampleActivitiesOnly(): FitnessActivity[] {
    const activities = this.loadActivities();
    const userOnly = activities.filter((a) => !a.isSample);
    this.saveActivities(userOnly);
    return userOnly;
  }
}

export const storageService = new StorageService();
