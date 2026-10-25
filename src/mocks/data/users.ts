import type { User } from '../../types/auth'

export interface MockUserRecord extends User {
  password: string
}

export const FIXTURE_USERS: MockUserRecord[] = [
  {
    id: 'user-1',
    name: 'Caio Dias',
    email: 'caio24092001@gmail.com',
    password: '123',
    avatar: '/assets/image2.png',
    walletAddress: '0x71C...4e89',
  },
  {
    id: 'user-alexandre',
    name: 'Alexandre Silva',
    email: 'alexandre@kurio.art',
    password: 'kurio123',
    avatar: '/assets/image2.png',
    walletAddress: '0x71C...4e89',
  },
  {
    id: 'user-2',
    name: 'Beatriz Mendes',
    email: 'beatriz@kurio.art',
    password: 'kurio123',
    avatar: '/assets/image.png',
    walletAddress: '0x3F8...2b10',
  },
]
