import { PrismaClient } from '@prisma/client'
import { beforeEach } from 'vitest'
import { mockDeep, mockReset, DeepMockProxy } from 'vitest-mock-extended'

const prisma = mockDeep<PrismaClient>()

beforeEach(() => {
  mockReset(prisma)
})

export default prisma as unknown as DeepMockProxy<PrismaClient>
