import { CommandInteraction, EmbedBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, ActionRowBuilder } from 'discord.js'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export async function blog (interaction: CommandInteraction) {
  const sessionUuid = uuidv4()
  let currentPage = 1

  try {
    const getData = async () => {
      const response = await axios.get(`https://blog.polytoria.com/ghost/api/content/posts/?key=ac0766ccda2a1b1cc23ab02ebd&fields=title,url,meta_description,feature_image,published_at&include=tags,authors&limit=1&page=${currentPage}`)
      const data = response.data
      const posts = data.posts
      return posts[0]
    }

    const embedFromPost = (post: any) => {
      return new EmbedBuilder()
        .setTitle(post.title)
        .setURL(post.url)
        .setDescription(post.meta_description)
        .setColor(0xFF5454)
        .setImage(post.feature_image)
        .addFields(
          { name: 'Author', value: post.authors.map((author: { name: any; }) => author.name).join(', '), inline: true },
          { name: 'Tags', value: post.tags.map((tag: { name: any; }) => tag.name).join(', '), inline: true },
          { name: 'Published At', value: new Date(post.published_at).toLocaleString(), inline: true }
        )
    }

    const post = await getData()
    let embed = embedFromPost(post)

    const previousButton = new ButtonBuilder()
      .setLabel('Previous')
      .setStyle(ButtonStyle.Danger)
      .setCustomId(`${sessionUuid}-previous`)

    const nextButton = new ButtonBuilder()
      .setLabel('Next')
      .setStyle(ButtonStyle.Success)
      .setCustomId(`${sessionUuid}-next`)

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(previousButton, nextButton)

    const replyOptions = { embeds: [embed], components: [row] }

    if (interaction.channel) {
      await interaction.reply(replyOptions)
      const filter = (i: { customId: string; }) => i.customId.startsWith(`${sessionUuid}`)
      const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 })

      collector.on('collect', async (i: ButtonInteraction) => {
        if (i.customId.endsWith('-previous')) {
          if (currentPage > 1) {
            currentPage--
          }
        } else if (i.customId.endsWith('-next')) {
          currentPage++
        }

        const post = await getData()
        embed = embedFromPost(post)
        await i.update({ embeds: [embed], components: [row] })
      })

      collector.on('end', () => {
        row.components.forEach((c: { setDisabled: (arg0: boolean) => any; }) => c.setDisabled(true))
        interaction.editReply({ embeds: [embed], components: [row] })
      })
    }
  } catch (error) {
    console.error(error)
    await interaction.reply('Failed to fetch blog posts.')
  }
}
