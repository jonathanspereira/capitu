import { beforeEach, afterEach, vi } from 'vitest';
import { mockReset } from 'vitest-mock-extended';
import prismaMock from './src/libs/__mocks__/prisma.lib';

beforeEach(() => {
  mockReset(prismaMock);
});

afterEach(() => {
  vi.clearAllMocks();
});

export { prismaMock};
