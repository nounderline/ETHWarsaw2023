import { LinkProps } from 'next/link'

export const InternalLink: Record<string, LinkProps['href']> = {
  home: '/',
  createChallenge: '/create'
} as const
export const ExternalLink = {} as const

export const AppName = 'Challenge accepted'
