import * as userCommands from './commands/user.js';
import { ping } from './commands/ping.js';
import * as currencyCommands from './commands/currency.js'
import { game  } from './commands/game.js'
const commands = {
    lookup:      userCommands.lookUp,
    ping:        ping,
    brickToStud: currencyCommands.brickToStud,
    b2s:         currencyCommands.brickToStud,
    studToBrick: currencyCommands.studToBrick,
    s2b:         currencyCommands.studToBrick,
    game:        game
}

export default commands