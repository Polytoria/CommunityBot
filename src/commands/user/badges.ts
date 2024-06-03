import axios from 'axios'
import { EmbedBuilder } from 'discord.js'

export async function fetchUserBadges (userID: number): Promise<{ badges: any[], total: number }> {
  const response = await axios.get(`https://api.polytoria.com/v1/users/${userID}/badges?limit=25`, {
    validateStatus: () => true








    
  })
  return {
    badges: response.data.badges,
    total: response.data.total
  }
}

export function buildBadgesEmbed (userData: any, badgesData: any[], total: number): EmbedBuilder {
  let description
  if (total === 0) {
    description = 'This user has no badges on Polytoria.'
  } else {
    const badgesList = badgesData.map(badge => {
      const levelText = badge.level !== null ? ` (Level ${badge.level})` : ''
      return `**${badge.name}${levelText}**\n${badge.description}`
    }).join('\n\n')
    description = badgesList
  }

  const embed = new EmbedBuilder()
    .setTitle(`${userData.username}'s Badges`)
    .setURL(`https://polytoria.com/users/${userData.id}`)
    .setDescription(description)
    .setColor('#3498db')
    .setThumbnail(userData.thumbnail.avatar)
    .setFooter({ text: `Total badges: ${total}` })

  return embed
}
