/* eslint-disable no-var */
import { PrismaClient } from '@prisma/client'

import { env } from '@/common/utils/envConfig'

declare global {
	var prisma: PrismaClient
}

export const db = globalThis.prisma || new PrismaClient()

if (env.NODE_ENV !== 'production') globalThis.prisma = new PrismaClient()
