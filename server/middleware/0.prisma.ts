import { PrismaClient } from "@prisma/client"

let prisma: PrismaClient

declare module "h3" {
  interface H3EventContext {
    prisma: PrismaClient
  }
}

export default eventHandler((event) => {
  if (!prisma) {
    prisma = new PrismaClient({
      // log: ["query", "info", "warn", "error"],
    })
  }
  event.context.prisma = prisma
})
