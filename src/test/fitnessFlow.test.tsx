import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../App';

describe('FitTrack App - Complete User Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders dashboard with summary cards, goals, and 7-day chart', async () => {
    render(<App />);

    // FitTrack brand title in header and sidebar
    expect(screen.getAllByText('FitTrack').length).toBeGreaterThan(0);

    // Summary cards exist
    expect(screen.getByText('Steps Walked')).toBeInTheDocument();
    expect(screen.getByText('Calories Burned')).toBeInTheDocument();
    expect(screen.getAllByText('Workout Time').length).toBeGreaterThan(0);
    expect(screen.getByText('Workouts Logged')).toBeInTheDocument();

    // Daily Goals section
    expect(screen.getByText('Daily Targets')).toBeInTheDocument();

    // 7-day trends chart section
    expect(screen.getByText('7-Day Activity Trends')).toBeInTheDocument();
  });

  it('validates activity form inputs against negative and missing values', async () => {
    render(<App />);

    // Click "Add Activity" tab in sidebar or header
    const addTabButtons = screen.getAllByRole('button', { name: /Add Activity/i });
    fireEvent.click(addTabButtons[0]);

    // Attempt to enter negative duration
    const durationInput = screen.getByPlaceholderText('e.g. 45');
    fireEvent.change(durationInput, { target: { value: '-10' } });

    // Attempt to enter negative calories
    const caloriesInput = screen.getByPlaceholderText('e.g. 350');
    fireEvent.change(caloriesInput, { target: { value: '-50' } });

    // Attempt to enter negative steps
    const stepsInput = screen.getByPlaceholderText('e.g. 4500');
    fireEvent.change(stepsInput, { target: { value: '-500' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /Record Activity/i });
    fireEvent.submit(submitBtn.closest('form')!);

    // Verify validation error messages appear
    await waitFor(() => {
      expect(
        screen.getByText('Duration must be greater than 0 minutes.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Calories burned cannot be negative.')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Steps cannot be negative.')
      ).toBeInTheDocument();
    });
  });

  it('executes complete flow: Add Activity -> Dashboard updates -> History updates -> Weekly stats update -> Edit -> Delete', async () => {
    const { unmount } = render(<App />);

    // 1. Open Add Activity form via header button
    const addButtons = screen.getAllByRole('button', { name: /Add Activity/i });
    fireEvent.click(addButtons[0]);

    // 2. Select Running, duration: 40 min, calories: 450, steps: 5500, notes
    const runningButtons = screen.getAllByText('Running');
    fireEvent.click(runningButtons[0]);

    const durationInput = screen.getByPlaceholderText('e.g. 45');
    fireEvent.change(durationInput, { target: { value: '40' } });

    const caloriesInput = screen.getByPlaceholderText('e.g. 350');
    fireEvent.change(caloriesInput, { target: { value: '450' } });

    const stepsInput = screen.getByPlaceholderText('e.g. 4500');
    fireEvent.change(stepsInput, { target: { value: '5500' } });

    const notesInput = screen.getByPlaceholderText(/How did the session feel/i);
    fireEvent.change(notesInput, { target: { value: 'Speed interval workout on track' } });

    // Submit form
    const recordBtn = screen.getByRole('button', { name: /Record Activity/i });
    fireEvent.submit(recordBtn.closest('form')!);

    // Verify toast notification appears
    await waitFor(() => {
      expect(screen.getByText('Activity Saved!')).toBeInTheDocument();
    });

    // 3. Switch to History tab and verify the new entry exists
    const historyTabs = screen.getAllByRole('button', { name: /^History$/i });
    fireEvent.click(historyTabs[0]);

    await waitFor(() => {
      expect(screen.getByText(/Speed interval workout on track/i)).toBeInTheDocument();
    });

    // 4. Switch to Weekly Progress tab and verify weekly stats
    const progressTabs = screen.getAllByRole('button', { name: /^Weekly Progress$/i });
    fireEvent.click(progressTabs[0]);

    expect(screen.getByText('Weekly Performance')).toBeInTheDocument();
    expect(screen.getByText('7-Day Detailed Breakdown')).toBeInTheDocument();

    // 5. Test page refresh persistence: unmount and remount App
    unmount();
    render(<App />);

    // Switch back to History to verify data remains saved
    const historyTabsAfterReload = screen.getAllByRole('button', { name: /^History$/i });
    fireEvent.click(historyTabsAfterReload[0]);

    await waitFor(() => {
      expect(screen.getByText(/Speed interval workout on track/i)).toBeInTheDocument();
    });

    // 6. Test Edit Activity
    const editButtons = screen.getAllByLabelText('Edit activity');
    fireEvent.click(editButtons[0]); // Edit the newest one

    await waitFor(() => {
      expect(screen.getByText('Edit Activity')).toBeInTheDocument();
    });

    const editDurationInput = screen.getByPlaceholderText('e.g. 45');
    fireEvent.change(editDurationInput, { target: { value: '55' } });

    const editNotesInput = screen.getByPlaceholderText(/How did the session feel/i);
    fireEvent.change(editNotesInput, { target: { value: 'Updated: 55 min speed interval' } });

    const saveChangesBtn = screen.getByRole('button', { name: /Save Changes/i });
    fireEvent.submit(saveChangesBtn.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Activity Updated')).toBeInTheDocument();
      expect(screen.getByText(/Updated: 55 min speed interval/i)).toBeInTheDocument();
    });

    // 7. Test Delete Activity
    const deleteButtons = screen.getAllByLabelText('Delete activity');
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Delete Activity/i })).toBeInTheDocument();
    });

    // Confirm delete in dialog
    const confirmDeleteBtn = screen.getByTestId('confirm-delete-btn');
    fireEvent.click(confirmDeleteBtn);

    await waitFor(() => {
      expect(screen.getByText('Activity Deleted')).toBeInTheDocument();
      expect(screen.queryByText(/Updated: 55 min speed interval/i)).not.toBeInTheDocument();
    });
  });

  it('allows adjusting daily goals and reflects progress updates', async () => {
    render(<App />);

    // Click "Set Goals"
    const setGoalsBtn = screen.getByTitle('Configure Daily Goals');
    fireEvent.click(setGoalsBtn);

    expect(screen.getByText('Set Daily Goals')).toBeInTheDocument();

    // Set new goal for steps to 12,000 using preset button
    const preset12k = screen.getByRole('button', { name: '12,000' });
    fireEvent.click(preset12k);

    // Save goals
    const saveGoalsBtn = screen.getByRole('button', { name: /Save Goals/i });
    fireEvent.submit(saveGoalsBtn.closest('form')!);

    await waitFor(() => {
      expect(screen.getByText('Goals Updated')).toBeInTheDocument();
      expect(screen.getByText(/12,000 goal/i)).toBeInTheDocument();
    });
  });

  it('displays friendly empty state when all data is cleared', async () => {
    render(<App />);

    // Click "Clear All" in sidebar
    const clearAllBtn = screen.getByRole('button', { name: /Clear All/i });
    fireEvent.click(clearAllBtn);

    await waitFor(() => {
      expect(
        screen.getByText('No activities recorded yet. Add your first workout!')
      ).toBeInTheDocument();
    });

    // Click "Load Demo Data"
    const loadDemoBtn = screen.getByRole('button', { name: /Load Demo Data/i });
    fireEvent.click(loadDemoBtn);

    await waitFor(() => {
      expect(screen.getByText('Demo Data Restored')).toBeInTheDocument();
      expect(screen.getByText('Stay active, reach your goals!')).toBeInTheDocument();
    });
  });
});
