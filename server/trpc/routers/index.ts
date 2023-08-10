import { z } from "zod"
import _ from "lodash"
import { publicProcedure, authenticatedProcedure, router } from "../trpc"

export const appRouter = router({
  hello: publicProcedure
    .input(
      z.object({
        text: z.string().nullish(),
      }),
    )
    .query(({ input }) => {
      return {
        greeting: `hello ${input?.text ?? "world"}`,
        time: new Date(),
      }
    }),
  getUser: authenticatedProcedure
    .query(async({ ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.session!.user?.email ?? "",
        },
      })
      return _.pick(user, "email", "name", "profilePic", "displayName")
    }),
  createUser: authenticatedProcedure
    .mutation(async({ ctx }) => {
      const { user } = ctx.session!
      // console.log(user)
      const createdUser = await ctx.prisma.user.create({
        data: {
          email: user?.email ?? "",
          name: user?.name ?? "",
          profilePic: user?.image ?? "",
          displayName: user?.name ?? "",
        },
      })
      return _.pick(createdUser, "email", "name", "profilePic", "displayName")
    }),
})

// export type definition of API
export type AppRouter = typeof appRouter
