import { loadEnv, Modules, defineConfig, ModuleRegistrationName } from '@medusajs/framework/utils'
import { resolve } from 'path'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    },
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
    redisUrl: process.env.REDIS_URL
  },
  admin: {
    path: process.env.MEDUSA_ADMIN_PATH as `/${string}`,
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  },
  modules: [
    {
      resolve: "@medusajs/medusa/payment",
      key: ModuleRegistrationName.PAYMENT,
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/payment-stripe",
            id: "stripe",
            options: {
              apiKey: process.env.STRIPE_API_KEY,
              webhookSecret: process.env.STRIPE_WEBHOOK_SECRET
            }
          }
        ]
      }
    },
    {
      resolve: "@medusajs/medusa/cache-redis",
      key: ModuleRegistrationName.CACHE,
      options: {
        redisUrl: process.env.REDIS_URL
      }
    },
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      key: ModuleRegistrationName.EVENT_BUS,
      options: {
        redisUrl: process.env.REDIS_URL
      }
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      key: ModuleRegistrationName.WORKFLOW_ENGINE,
      options: {
        redis: {
          url: process.env.REDIS_URL
        }
      }
    }
  ]
})