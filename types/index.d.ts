import { Message } from "discord.js"

/**
 * Type for the commands
 */
export type ICommand = (message: Message, arguments: string[]) => void | any 

/**
 * Context at which we are logging.
 */
export type IContext = '[Bot]' | '[Client]' | '[Server]'

/**
* Configuration of your bot.
*/

export type IGame = {
    Success: boolean,
    ID?: number,
    Name?: string,
    Description?: string,
    Thumbnail?: string,
    CreatorID?: number,
    IsActive?: true,
    Visits?: number,
    Likes?: number,
    Dislikes?: number,
    CreatedAt?: string,
    UpdatedAt?: string,
}

export type  IConfiguration = {

    /**
    * Token of your bot.
    */
    token: string | undefined

    /**
    * Prefix of your bot.
    */
    prefix: string

    /**
    * Time to cool down the bot commands.
    */
    coolDown: number
}