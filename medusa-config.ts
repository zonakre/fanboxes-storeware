import { loadEnv, Modules, defineConfig, ModuleRegistrationName } from '@medusajs/framework/utils'

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
    path: process.env.ADMIN_PATH as '/${string}',
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  },
  modules: [
    {
      resolve: '@medusajs/file',
      key: ModuleRegistrationName.FILE,
      options: {
        providers: [
          {
            resolve: '@medusajs/file-local-next',
            id: 'local',
            options: {
              backend_url: `${process.env.MEDUSA_BACKEND_URL}/static`
            }
          }
        ]
      }
    },
    {
      resolve: "@medusajs/cache-redis",
      key: ModuleRegistrationName.CACHE,
      options: {
        redisUrl: process.env.REDIS_URL
      }
    },
    {
      resolve: "@medusajs/event-bus-redis",
      key: ModuleRegistrationName.EVENT_BUS,
      options: {
        redisUrl: process.env.REDIS_URL
      }
    },
    {
      resolve: "@medusajs/workflow-engine-redis",
      key: ModuleRegistrationName.WORKFLOW_ENGINE,
      options: {
        redis: {
          url: process.env.REDIS_URL
        }
      }
    }
  ]
})
