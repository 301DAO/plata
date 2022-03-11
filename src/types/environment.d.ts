declare namespace NodeJS {
  export interface ProcessEnv extends NodeJS.ProcessEnv {
    PLANETSCALE_PRISMA_DATABASE_URL: string
    NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY: string
    MAGIC_SECRET_KEY: string
    VERCEL_URL: string // System environment variable when deployed on Vercel: https://vercel.com/docs/environment-variables#system-environment-variables
    TOKEN_NAME: string
    TOKEN_SECRET: string
    ALCHEMY_KEY: string
    NEXT_PUBLIC_ALCHEMY_KEY: string
    NEXT_PUBLIC_ETHERSCAN_KEY: string
    NEXT_PUBLIC_INFURA_PROJECT_ID: string
    COVALENT_KEY: string
    NEXT_PUBLIC_COVALENT_KEY: string
  }
}
