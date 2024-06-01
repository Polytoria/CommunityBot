import { EmbedBuilder } from 'discord.js'
import axios from 'axios'

export async function fetchUserBadges (userID: number): Promise<any[]> {
  const response = await axios.get(`https://api.polytoria.com/v1/users/${userID}/badges`, {
    validateStatus: () => true
  })
  return response.data.badges
}

export function buildBadgesEmbed (userData: any, badgesData: any[]): EmbedBuilder {
  const badgeNames = badgesData.map((badge) => badge.name).join('\n')

  const embed = new EmbedBuilder()
    .setTitle(`${userData.username}'s Badges`)
    .setURL(`https://polytoria.com/users/${userData.id}`)
    .setDescription(`**Badges**\n${badgeNames}`)
    .setColor('#3498db')
    .setThumbnail(userData.thumbnail.avatar)

  return embed
}
