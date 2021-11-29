import { Message } from "discord.js"
import { AnyAaaaRecord } from "dns"

declare module 'configuration' {
    /**
     * Configuration of your bot.
     */
	export type IConfiguration = {
        /**
         * Token of your bot.
         */
		token: string
        /**
         * Prefix of your bot.
         */
		prefix: string
        /**
         * Time to cool down the bot commands.
         */
		coolDown: number
	}
    /**
     * Context at which we are logging.
     */
	export type IContext = '[Bot]' | '[Client]' | '[Server]'

    /**
     * Type for the commands
     */
    export type Icommand = (message: Message, arguments: string[]) => void | any 
}
