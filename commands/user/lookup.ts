import { Message } from "discord.js";

export function lookUp(message: Message, _arguments: any[]) : void | Promise<Message<boolean>> {
    if(!_arguments) return message.channel.send("We require the username argument!");
}