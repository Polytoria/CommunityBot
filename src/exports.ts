import {lookUp} from './commands/user.js'
import {ping} from './commands/ping.js'
import {brickToStud, studToBrick} from './commands/currency.js'
import {game} from './commands/game.js'
import {cookie} from './commands/cookie.js'
import {guild} from './commands/guild.js'
import {catalog} from './commands/catalog.js'

export default {
	lookup: lookUp,
	ping: ping,
	brickToStud: brickToStud,
	b2s: brickToStud,
	studToBrick: studToBrick,
	s2b: studToBrick,
	game: game,
	cookie: cookie,
	guild: guild,
	catalog: catalog
}
