import { Message, MessageEmbed } from 'discord.js'

export function brickToStud(
    message: Message,
    _arugments: string[]
): Promise<Message<boolean>> {

    let bricks: number = +_arugments[0]

    bricks *= 15

    const Embed: MessageEmbed = new MessageEmbed({
        title: "Brick to Stud!",
        color: "#ff5454",
        fields: [
            { name: "bricks", value: _arugments[0], inline: true },
            { name: "studs", value: bricks.toString(), inline: true }
        ],
        description: `**${_arugments[0]} <:brick:905987077995376640> ↔️ ${bricks} <:stud:905987085347983411>**`
    })
    return message.channel.send({embeds: [Embed]})
}
