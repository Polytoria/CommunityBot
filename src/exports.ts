import { lookUp, card, level, inventory } from './commands/user.js'
import { cookie } from './commands/cookie.js'
import { help } from './commands/help.js'
import { guild } from './commands/guild/guilds.js'
import { info } from './commands/info.js'
import { status } from './commands/status.js'
import { storeSearch } from './commands/search/store-search.js'
import { userSearch } from './commands/search/user-search.js'
import { commands } from './commands/commands.js'
import { store } from './commands/store.js'
import { random } from './commands/random.js'
import { place } from './commands/place.js'
import { toolbox } from './commands/search/toolbox.js'

export default {
  lookup: lookUp,
  inventory,
  place,
  cookie,
  guild,
  store,
  friends: commands,
  avatar: commands,
  help,
  level,
  info,
  card,
  status,
  'store-search': storeSearch,
  toolbox,
  commands,
  random,
  'user-search': userSearch
}
