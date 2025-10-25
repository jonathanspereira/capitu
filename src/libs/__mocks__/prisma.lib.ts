import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'vitest-mock-extended';

const prismaMock = mockDeep<PrismaClient>();

export default prismaMock;
