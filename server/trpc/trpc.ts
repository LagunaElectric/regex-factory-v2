/**
 * This is your entry point to setup the root configuration for tRPC on the server.
 * - `initTRPC` should only be used once per app.
 * - We export only the functionality that we use so we can enforce which base procedures should be used
 *
 * Learn how to create protected base procedures and other things below:
 * @see https://trpc.io/docs/v10/router
 * @see https://trpc.io/docs/v10/procedures
 */
import { TRPCError, initTRPC } from "@trpc/server"
import superjson from "superjson"
import { Context } from "~/server/trpc/context"

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

/**
 * Unprotected procedure
 **/
export const publicProcedure = t.procedure
export const router = t.router
export const middleware = t.middleware

// TODO: Ask someone about this. It seems too simple.
export const authenticatedProcedure = publicProcedure
  .use(({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ message: "Session not found.", code: "UNAUTHORIZED" })
    }
    if ((new Date(ctx.session.expires)).getTime() < Date.now()) {
      throw new TRPCError({ message: "Session expired.", code: "UNAUTHORIZED" })
    }
    return next()
  })
