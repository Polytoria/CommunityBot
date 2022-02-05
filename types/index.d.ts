import {Message} from 'discord.js'

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
	Success: boolean
	ID?: number
	Name?: string
	Description?: string
	Thumbnail?: string
	CreatorID?: number
	IsActive?: true
	Visits?: number
	Likes?: number
	Dislikes?: number
	CreatedAt?: string
	UpdatedAt?: string
}

export type IConfiguration = {
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

export type IapiEndpoints = {
	/**
	 * URL of request
	 */
	url: string | undefined
	/**
	 * Request Method(Exmaple GET POST)
	 */
	method?: string | undefined
}

export type IApiResponse = {
	/**
	 * Check if the request was success
	 */
	hasError: boolean
	/**
	 * Response s' Status Code
	 */
	statusCode: number
	/**
	 * String that will be display to user
	 */
	displayText: string
	/**
	 * Actual error that api response
	 */
	actualError: string
}

export type ICreator = {
	/**
	 * Creator Type of the asset
	 */
	creatorType: 'User' | 'Guild'
	/**
	 * ID of the asset
	 */
	creatorID: number
}

export type RandomResult = {
	/**
	 * How many time the function tried
	 */
	tried: number
	/**
	 * Response data
	 */
	data: any
}