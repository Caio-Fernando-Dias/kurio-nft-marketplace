import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'
import { socketIoHandler } from './socketMock'

export const worker = setupWorker(...handlers, socketIoHandler)
