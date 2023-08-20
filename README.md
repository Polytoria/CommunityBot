# Polytoria Community Bot

Polytoria's Discord community bot rewritten in TypeScript.

### Installation instructions.

**To run this bot it is recommended to use Node v16 LTS release.**

#### Clone & Install dependencies.

Clone the bot using Git

```
git clone https://github.com/Polytoria/CommunityBot.git PolytoriaCommunityBot
```

Install the necessary dependencies.

- YARN: `yarn install`
- NPM: `npm install`
- PNPM: `pnpm install`

#### Build & Run

To build and run the bot, simply build the TypeScript files using the `package.json` script `build` with your favorite command-line utility.

`npm run build`, `yarn run build` etc...

The bot requires a `.env` file as seen in `.env.example`, copy the file, rename it to `.env` and insert your discord bot token there.

Then just run with the `package.json` script `start`.

`npm run start` etc...
