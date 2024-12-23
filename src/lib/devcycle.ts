import { initializeDevCycle } from '@devcycle/nodejs-server-sdk'

export const devcycle = initializeDevCycle(
  process.env.DEVCYCLE_SERVER_SDK_KEY || '',
  {
    enableEdgeDB: true,
  }
)

