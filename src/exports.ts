import { lookUp, card, level } from './commands/user.js'
import { ping } from './commands/ping.js'
import { cookie } from './commands/cookie.js'
import { help } from './commands/help.js'
import { guild } from './commands/guild.js'
import { info } from './commands/info.js'
import { status } from './commands/status.js'
import { catalogSearch } from './commands/catalog-search.js'
import { toolbox } from './commands/toolbox.js'
import { commands } from './commands/commands.js'
import { store } from './commands/store.js'
import { randomUser, randomPlace, randomGuild, randomStore } from './commands/random.js'
import { place } from './commands/place.js'

export default {
  lookup: lookUp,
  inventory: commands,
  ping: ping,
  place: place,
  cookie: cookie,
  guild: guild,
  store: store,
  friends: commands,
  avatar: commands,
  'random-place': randomPlace,
  'random-user': randomUser,
  'random-guild': randomGuild,
  'random-store': randomStore,
  help: help,
  level: level,
  info: info,
  card: card,
  status: status,
  'catalog-search': catalogSearch,
  toolbox: toolbox,
  commands: commands
}
