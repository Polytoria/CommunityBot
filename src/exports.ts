import { lookUp, inventory, friends, avatar } from './commands/user.js'
import { randomGame, randomUser, randomGuild, randomCatalog, deletedRandomCatalog, randomBanner } from './commands/random.js'
import { ping } from './commands/ping.js'
import { brickToStud, studToBrick } from './commands/currency.js'
import { game } from './commands/game.js'
import { cookie } from './commands/cookie.js'
import { guild } from './commands/guild.js'
import { catalog } from './commands/catalog.js'
import { leaderboard } from './commands/leaderboard.js'
import { help } from './commands/help.js'

export default {
  lookup: lookUp,
  inventory: inventory,
  ping: ping,
  brickToStud: brickToStud,
  b2s: brickToStud,
  studToBrick: studToBrick,
  s2b: studToBrick,
  game: game,
  cookie: cookie,
  guild: guild,
  catalog: catalog,
  friends: friends,
  avatar: avatar,
  leaderboard: leaderboard,
  'random-game': randomGame,
  'random-user': randomUser,
  'random-guild': randomGuild,
  'random-catalog': randomCatalog,
  '404-random-catalog': deletedRandomCatalog,
  'random-banner': randomBanner,
  help: help
}
