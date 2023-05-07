import { clerkClient } from '@clerk/nextjs'
import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '~/server/api/trpc'
import { filterUserForClient } from '~/server/helpers/filterUserForClient'

export const profileRouter = createTRPCRouter({
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = (
        await clerkClient.users.getUserList({
          username: [input.username],
        })
      ).at(0)

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'User not found',
        })
      }

      return filterUserForClient(user)
    }),
})
