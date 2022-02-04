## Plata

Read more on the [Notion](https://www.notion.so/404dao/Plata-ac59498eaf1e422f8eba0da3cc686b23).

### How we BUIDL

Take a look at the [Plata project board](https://github.com/orgs/404DAO/projects/1/views/1). We run only one team meeting: the product meeting. We host meetings in [gather.town](https://gather.town/app/voVs4EFwcYQOafFE/plataHQ). More on product dev cycle soon.

### Setting up local dev environment

1. Join planetscale team
1. setup planetscale locally (read how we do db migrations with planetscale below)
setup steps:

<!-- TODO -->
1. setup PlanetScale CLI (https://github.com/planetscale/cli)
2. clone repo
3. create .env.local
4. login through CLI: `pscale auth login`
5. switch to the right org: `pscale org switch plata`
6. run `pscale connect plata <branch:plata-dev> --port <3001>`
7. go to .env.local
8. db syntax: `mysql://root@<plata-dev's IP with port>/plata`
9. go to magic.link and use `plata-dev` application
10. fill out `NEXT_PUBLIC_MAGIC_PUBLISHABLE_KEY` and `MAGIC_SECRET_KEY` listed in magic.link
11. for local development, `TOKEN_SECRET` can be set to anything.
<!-- pending triage -->

### DB migrations

1. make your updates to `prisma.schema`
1. connect to your development branch on planetscale
1. `npm run prismaDeployDev`
1. deploy db branch when ready

### Deploying your changes

For now open PR, but use judgment on whether or not you need a review from someone. We're aiming to not need to do PR reviews and instead go full `CI/CD`.
