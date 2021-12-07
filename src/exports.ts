import * as userCommands from './commands/user.js';
import { ping } from './commands/ping.js';
import * as currencyCommands from './commands/currency.js'
const commands = {
    lookup:      userCommands.lookUp,
    ping:        ping,
    brickToStud: currencyCommands.brickToStud,
    b2s:         currencyCommands.brickToStud,
    studToBrick: currencyCommands.studToBrick,
    s2b:         currencyCommands.studToBrick
}

export default commands