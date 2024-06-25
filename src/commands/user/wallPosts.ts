import { EmbedBuilder } from 'discord.js'
import emojiUtils from '../../utils/emojiUtils.js'
import { dateUtils } from '../../utils/dateUtils.js'

export function buildWallPostsEmbed (wallPostsData: any[]): EmbedBuilder {
  const wallPostsEmbed = new EmbedBuilder()
    .setTitle('Wall Posts')
    .setColor('#3498db')

  const wallPostsContent = wallPostsData.map((post: any) => {
    const pinnedEmoji = post.isPinned ? emojiUtils.pin : ''
    const pinnedMessageText = post.isPinned ? '**Pinned Message**' : ''
    const postedAt = dateUtils.atomTimeToDisplayTime(post.postedAt)

    return ` ${pinnedEmoji} ${pinnedMessageText}\n${post.content}\n*Posted by [${post.author.username}](https://polytoria.co/users/${post.author.id})* at ${postedAt}`
  })

  wallPostsEmbed.setDescription(wallPostsContent.join('\n'))
  return wallPostsEmbed
}
