declare namespace NodeJS {
  export interface ProcessEnv extends NodeJS.ProcessEnv {
    DATABASE_URL: string;
    SHADOW_DATABASE_URL: string;
    NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY: string;
    NEXT_PUBLIC_MAGIC_SECRET_KEY: string;
    VERCEL_URL: string; // System environment variable when deployed on Vercel: https://vercel.com/docs/environment-variables#system-environment-variables
  }
}
