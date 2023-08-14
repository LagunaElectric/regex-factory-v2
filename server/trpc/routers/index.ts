import { z } from "zod"
import _ from "lodash"
import { TRPCError } from "@trpc/server"
import { publicProcedure, authenticatedProcedure, router } from "../trpc"
import RuleSet from "utils/RuleSet"

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
  getRuleSets: authenticatedProcedure
    .query(async({ ctx }) => {
      const ruleSets = await ctx.prisma.ruleSet.findMany({
        where: {
          author: {
            email: ctx.session!.user?.email ?? "",
          },
        },
        include: {
          rules: true,
        },
      })
      return ruleSets
    }),
  createRuleSet: authenticatedProcedure
    .input(z.object({
      ruleSet: z.custom<RuleSet>((ruleSet) => {
        return ruleSet instanceof RuleSet
      }),
    })).mutation(async({ ctx, input }) => {
      const { ruleSet } = input
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: ctx.session!.user?.email ?? "",
        },
      })
      if (!user || !Object.keys(user).length) {
        throw new TRPCError({
          message: "Failed to save Rule Set: User not found",
          code: "NOT_FOUND",
        })
      }
      const createdRuleSet = await ctx.prisma.ruleSet.create({
        data: {
          title: ruleSet.title.value,
          authorId: user.id,
          rules: {
            create: ruleSet.rules.map((rule) => {
              return {
                match: rule.match,
                substitution: rule.substitution,
                isRegEx: rule.isRegEx,
                isCaseSensitive: rule.isCaseSensitive,
                isWholeWord: rule.isWholeWord,
                isReplaceAll: rule.isReplaceAll,
                authorId: user.id,
              }
            }),
          },
        },
      })
      return createdRuleSet
    }),
})

// export type definition of API
export type AppRouter = typeof appRouter
