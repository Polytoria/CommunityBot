import { Message, MessageEmbed } from 'discord.js'

export function studToBrick(
    message: Message,
    _arugments: string[]
): Promise<Message<boolean>> {

    let studs: number = +_arugments[0]

    studs /= 15

    const Embed: Partial<MessageEmbed> = new MessageEmbed({
        title: "Brick to Stud!",
        fields: [
            { name: "studs", value: _arugments[0], inline: true },
            { name: "bricks", value: studs.toString(), inline: true }
        ],
        description: `**${_arugments[0]} <:stud:905987085347983411> ↔️ ${studs} <:brick:905987077995376640>**`
    })
    // @ts-expect-error
    return message.channel.send({ embeds: Embed })
}
