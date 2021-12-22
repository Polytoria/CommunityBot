import { Message, MessageEmbed } from 'discord.js'

export function studToBrick(
    message: Message,
    _arguments: string[]
): Promise<Message<boolean>> {
    let studs: number = +_arguments[0]

    studs /= 15
    studs = Math.round(studs)
    let studremoved = Number(_arguments[0]) % 15
    let studshould = studs - studremoved

    const Embed: MessageEmbed = new MessageEmbed({
        title: "Stud to Brick!",
        color: "#ff5454",
        fields: [
            { name: "studs", value: _arguments[0], inline: true },
            { name: "bricks", value: `${studs}`, inline: true }
        ],
        description: `**${_arguments[0]} <:stud:905987085347983411> ↔️ ${studs} <:brick:905987077995376640>**`,
        footer: {
            text: studremoved == 0 ? "No warnings" : `⚠ ${studremoved} studs will be removed while converting.`
        }
    })

    return message.channel.send({ embeds: [Embed]})
}
