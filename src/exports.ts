import { lookUp } from './commands/user.js'
import { ping } from './commands/ping.js'
import { cookie } from './commands/cookie.js'
import { help } from './commands/help.js'
import { info } from './commands/info.js'
import { status } from './commands/status.js'
import { catalogSearch } from './commands/catalog-search.js'
import { toolbox } from './commands/toolbox.js'
import { commands } from './commands/commands.js'

export default {
  lookup: lookUp,
  inventory: commands,
  ping: ping,
  game: commands,
  cookie: cookie,
  guild: commands,
  catalog: commands,
  friends: commands,
  avatar: commands,
  'random-game': commands,
  'random-user': commands,
  'random-guild': commands,
  'random-catalog': commands,
  'random-banner': commands,
  help: help,
  level: commands,
  info: info,
  card: commands,
  status: status,
  'catalog-search': catalogSearch,
  toolbox: toolbox,
  commands: commands
}
