import '@testing-library/jest-dom/vitest';
import { beforeEach } from 'vitest';

// Ensure localStorage is clean between tests
beforeEach(() => {
  localStorage.clear();
});
