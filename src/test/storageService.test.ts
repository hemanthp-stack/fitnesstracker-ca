import { describe, it, expect, beforeEach } from 'vitest';
import { storageService, DEFAULT_GOALS } from '../services/storageService';
import { getTodayDateString } from '../utils/formatters';

describe('StorageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes sample data on first launch', () => {
    const { activities, goals } = storageService.initialize();
    expect(activities.length).toBeGreaterThan(0);
    expect(goals).toEqual(DEFAULT_GOALS);
    expect(activities.some((a) => a.isSample)).toBe(true);
    expect(localStorage.getItem('fittrack_initialized_v1')).toBe('true');
  });

  it('persists newly added activities across storage reload', () => {
    storageService.initialize();
    const today = getTodayDateString();

    const newActivity = storageService.addActivity({
      type: 'Running',
      duration: 45,
      calories: 420,
      steps: 5200,
      date: today,
      notes: 'Test morning run',
    });

    expect(newActivity.id).toBeDefined();
    expect(newActivity.isSample).toBe(false);

    // Simulate app refresh by reading raw storage
    const loaded = storageService.loadActivities();
    expect(loaded.length).toBeGreaterThan(1);
    expect(loaded[0].id).toBe(newActivity.id);
    expect(loaded[0].calories).toBe(420);
    expect(loaded[0].duration).toBe(45);
    expect(loaded[0].steps).toBe(5200);
  });

  it('updates an existing activity correctly', () => {
    storageService.initialize();
    const today = getTodayDateString();

    const added = storageService.addActivity({
      type: 'Walking',
      duration: 30,
      calories: 120,
      steps: 3200,
      date: today,
    });

    const updated = storageService.updateActivity(added.id, {
      duration: 40,
      calories: 160,
      notes: 'Extended walk',
    });

    expect(updated).not.toBeNull();
    expect(updated?.duration).toBe(40);
    expect(updated?.calories).toBe(160);
    expect(updated?.notes).toBe('Extended walk');

    const fresh = storageService.loadActivities();
    const found = fresh.find((a) => a.id === added.id);
    expect(found?.duration).toBe(40);
  });

  it('deletes an activity cleanly', () => {
    storageService.initialize();
    const today = getTodayDateString();

    const added = storageService.addActivity({
      type: 'Gym',
      duration: 50,
      calories: 300,
      steps: 800,
      date: today,
    });

    const beforeCount = storageService.loadActivities().length;
    const success = storageService.deleteActivity(added.id);
    expect(success).toBe(true);

    const after = storageService.loadActivities();
    expect(after.length).toBe(beforeCount - 1);
    expect(after.some((a) => a.id === added.id)).toBe(false);
  });

  it('updates and persists daily goals', () => {
    const customGoals = { steps: 12000, calories: 750, workoutMinutes: 75 };
    storageService.saveGoals(customGoals);

    const loaded = storageService.loadGoals();
    expect(loaded).toEqual(customGoals);
  });

  it('clears all activities and resets to sample data on demand', () => {
    storageService.initialize();
    expect(storageService.loadActivities().length).toBeGreaterThan(0);

    storageService.clearAllActivities();
    expect(storageService.loadActivities().length).toBe(0);

    const resetted = storageService.resetToSampleData();
    expect(resetted.length).toBeGreaterThan(0);
    expect(storageService.loadActivities().length).toBe(resetted.length);
  });
});
