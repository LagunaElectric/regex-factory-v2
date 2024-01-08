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
          rules: {
            include: {
              rule: true,
            },
          },
        },
      })

      return ruleSets
    }),
  createRuleSet: authenticatedProcedure
    .input(z.object({
      id: z.optional(z.string()),
      title: z.string(),
      description: z.optional(z.string()),
      ruleSet: z.array(z.object({
        id: z.optional(z.string()),
        match: z.string(),
        substitution: z.string(),
        isRegEx: z.optional(z.boolean()),
        isCaseSensitive: z.optional(z.boolean()),
        isWholeWord: z.optional(z.boolean()),
        isReplaceAll: z.optional(z.boolean()),
      })),
    }))
    .mutation(async({ ctx, input }) => {
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
        return {
          status: 401,
          message: "Failed to save Rule Set: User not found",
        }
      }

      const existingRuleSet = input.id
        ? await ctx.prisma.ruleSet.findFirst({
          where: {
            id: input.id,
          },
          include: {
            rules: true,
          },
        })
        : null
      if (existingRuleSet && Object.keys(existingRuleSet).length) {
        return {
          status: 409,
          message: "Failed to save Rule Set: Rule Set already exists",
          ruleSet: existingRuleSet,
        }
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

      const rules = []

      for (const rule of createdRuleSet.rules) {
        const newRule = await ctx.prisma.rule.findUnique({
          where: {
            id: rule.ruleId,
          },
        })
        if (newRule && Object.keys(newRule).length) {
          rules.push(_.omit(newRule, "authorId", "createdAt", "updatedAt"))
        }
      }

      return {
        status: 200,
        ruleSetId: createdRuleSet.id,
        rules,
      }
    }),
  updateRuleSet: authenticatedProcedure
    .input(z.object({
      id: z.string(),
      title: z.string().optional(),
      description: z.string().optional(),
      ruleSet: z.array(z.object({
        id: z.string().optional(),
        match: z.string(),
        substitution: z.string(),
        isRegEx: z.boolean(),
        isCaseSensitive: z.boolean(),
        isWholeWord: z.boolean(),
        isReplaceAll: z.boolean(),
      })).optional(),
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
          message: "Failed to update Rule Set: User not found",
          code: "UNAUTHORIZED",
        })
      }

      const existingRuleSet = await ctx.prisma.ruleSet.findFirst({
        where: {
          id: input.id,
        },
      })
      if (!existingRuleSet || !Object.keys(existingRuleSet).length) {
        throw new TRPCError({
          message: "Failed to update Rule Set: Rule Set not found",
          code: "NOT_FOUND",
        })
      }

      let updatedRuleSet = await ctx.prisma.ruleSet.update({
        where: { id: existingRuleSet.id },
        data: {
          title,
          description,
        },
        include: {
          rules: true,
        },
      })

      await ctx.prisma.rulesInSets.deleteMany({
        where: {
          ruleSetId: updatedRuleSet.id,
        },
      })

      if (!ruleSet || !ruleSet.length) {
        return updatedRuleSet
      }

      // const ruleSetWithIds: {
      //   id: string | undefined
      //   match: string
      //   substitution: string
      //   isRegEx: boolean
      //   isCaseSensitive: boolean
      //   isWholeWord: boolean
      //   isReplaceAll: boolean
      // }[] = []

      // for (const rule of ruleSet) {
      //   const existingRule = await ctx.prisma.rule.findFirst({
      //     where: {
      //       match: rule.match,
      //       substitution: rule.substitution,
      //       isRegEx: rule.isRegEx,
      //       isCaseSensitive: rule.isCaseSensitive,
      //       isWholeWord: rule.isWholeWord,
      //       isReplaceAll: rule.isReplaceAll,
      //       authorId: user.id,
      //     },
      //   })
      //   if (existingRule && Object.keys(existingRule).length) {
      //     ruleSetWithIds.push({
      //       ...rule,
      //       id: existingRule.id,
      //     })
      //   } else {
      //     ruleSetWithIds.push({
      //       ...rule,
      //       id: undefined,
      //     })
      //   }
      // }

      for (let i = 0; i < ruleSet.length; i++) {
        const rule = ruleSet[i]
        await ctx.prisma.rule.upsert({
          where: { id: rule.id || "" },
          update: {
            match: rule.match,
            substitution: rule.substitution,
            isRegEx: !!rule.isRegEx,
            isCaseSensitive: !!rule.isCaseSensitive,
            isWholeWord: !!rule.isWholeWord,
            isReplaceAll: !!rule.isReplaceAll,
            ruleSet: {
              create: {
                order: i,
                ruleSet: {
                  connect: {
                    id: updatedRuleSet.id,
                  },
                },
              },
            },
          },
          create: {
            match: rule.match,
            substitution: rule.substitution,
            isRegEx: !!rule.isRegEx,
            isCaseSensitive: !!rule.isCaseSensitive,
            isWholeWord: !!rule.isWholeWord,
            isReplaceAll: !!rule.isReplaceAll,
            authorId: user.id,
            ruleSet: {
              create: {
                order: i,
                ruleSet: {
                  connect: {
                    id: updatedRuleSet.id,
                  },
                },
              },
            },
          },
        })
      }

      updatedRuleSet = await ctx.prisma.ruleSet.findUnique({
        where: { id: updatedRuleSet.id },
        include: {
          rules: true,
        },
      }) || updatedRuleSet

      const rules = []

      for (const rule of updatedRuleSet.rules) {
        const newRule = await ctx.prisma.rule.findUnique({
          where: {
            id: rule.ruleId,
          },
        })
        if (newRule && Object.keys(newRule).length) {
          rules.push(_.omit(newRule, "authorId", "createdAt", "updatedAt"))
        }
      }

      return rules
    }),
  ruleSetTitleExists: authenticatedProcedure
    .input(z.object({
      title: z.string(),
    })).query(async({ ctx, input }) => {
      const { title } = input
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
          message: "Failed to verify RuleSet: User not found",
          code: "UNAUTHORIZED",
        })
      }

      const existingRuleSet = await ctx.prisma.ruleSet.findFirst({
        where: {
          title,
          authorId: user.id,
        },
      })
      return !!existingRuleSet
    }),
})

// export type definition of API
export type AppRouter = typeof appRouter
