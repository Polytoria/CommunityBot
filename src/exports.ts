import * as userCommands from './commands/user.js';
import { ping } from './commands/ping.js';

const commands = {
    lookup: userCommands.lookUp,
    ping: ping

}

export default commands