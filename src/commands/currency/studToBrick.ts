import { Message, MessageEmbed } from 'discord.js'

export function studToBrick(
    message: Message,
    _arguments: string[]
): Promise<Message<boolean>> {
    let studs: number = +_arguments[0]

    studs /= 15

    const Embed: MessageEmbed = new MessageEmbed({
        title: "Brick to Stud!",
        fields: [
            { name: "studs", value: _arguments[0], inline: true },
            { name: "bricks", value: `${studs}`, inline: true }
        ],
        description: `**${_arguments[0]} <:stud:905987085347983411> ↔️ ${studs} <:brick:905987077995376640>**`
    })

    return message.channel.send({ embeds: [Embed]})
}
