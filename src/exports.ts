import { lookUp, card, level, inventory } from './commands/user.js'
import { cookie } from './commands/cookie.js'
import { help } from './commands/help.js'
import { guild } from './commands/guild.js'
import { info } from './commands/info.js'
import { status } from './commands/status.js'
//import { storeSearch } from './commands/store-search.js'
import { commands } from './commands/commands.js'
import { store } from './commands/store.js'
import { random } from './commands/random.js'
// import { randomUser, randomPlace, randomGuild, randomStore } from './commands/random.js'
import { place } from './commands/place.js'
import { toolbox } from './commands/toolbox.js'

export default {
  lookup: lookUp,
  inventory,
  place,
  cookie,
  guild,
  store,
  friends: commands,
  avatar: commands,
  // 'random-place': randomPlace,
  // 'random-user': randomUser,
  // 'random-guild': randomGuild,
  // 'random-store': randomStore,
  help,
  level,
  info,
  card,
  status,
  // 'store-search': storeSearch,
  toolbox,
  commands,
  random
}
