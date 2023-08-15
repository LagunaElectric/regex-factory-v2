import { z } from "zod"
import _ from "lodash"
import { TRPCError } from "@trpc/server"
import { authenticatedProcedure, router } from "../trpc"

export const appRouter = router({
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
      title: z.string(),
      description: z.optional(z.string()),
      ruleSet: z.array(z.object({
        match: z.string(),
        substitution: z.string(),
        isRegEx: z.optional(z.boolean()),
        isCaseSensitive: z.optional(z.boolean()),
        isWholeWord: z.optional(z.boolean()),
        isReplaceAll: z.optional(z.boolean()),
      })),
    })).mutation(async({ ctx, input }) => {
      const { title, description, ruleSet } = input
      const user = await ctx.prisma.user.findUnique({
        select: {
          id: true,
        },
        where: {
          email: ctx.session!.user?.email ?? "",
        },
      })
      if (!user || !Object.keys(user).length) {
        throw new TRPCError({
          message: "Failed to save Rule Set: User not found",
          code: "UNAUTHORIZED",
        })
      }

      const existingRuleSet = await ctx.prisma.ruleSet.findFirst({
        where: {
          title,
          authorId: user.id,
        },
      })
      if (existingRuleSet && Object.keys(existingRuleSet).length) {
        throw new TRPCError({
          message: "Failed to save Rule Set: Rule Set already exists",
          code: "CONFLICT",
        })
      }

      const createdRuleSet = await ctx.prisma.ruleSet.create({
        data: {
          title,
          authorId: user.id,
          description,
          rules: {
            create: ruleSet.map((rule, i) => {
              return {
                order: i,
                rule: {
                  create: {
                    match: rule.match,
                    substitution: rule.substitution,
                    isRegEx: !!rule.isRegEx,
                    isCaseSensitive: !!rule.isCaseSensitive,
                    isWholeWord: !!rule.isWholeWord,
                    isReplaceAll: !!rule.isReplaceAll,
                    authorId: user.id,
                  },
                },
              }
            }),
          },
        },
        include: {
          rules: true,
        },
      })
      return createdRuleSet
    }),
})

// export type definition of API
export type AppRouter = typeof appRouter
