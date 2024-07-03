import { CommandInteraction, EmbedBuilder } from 'discord.js'
import axios from 'axios'
import { dateUtils } from '../../utils/dateUtils.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function handleUserSummary (interaction: CommandInteraction, username: string) {
  await interaction.deferReply()

  try {
    // Fetch user ID
    const lookupResponse = await axios.get(`https://api.polytoria.co/v1/users/find?username=${username}`, {
      validateStatus: (status) => status === 200
    })
    const lookupData = lookupResponse.data

    if (!lookupData) {
      return await interaction.editReply('User not found!')
    }

    const userID = lookupData.id

    // Fetch user stats from new API
    const statsResponse = await axios.get(`https://stats.silly.mom/player_stats?id=${userID}`, {
      validateStatus: () => true
    })
    const statsData = statsResponse.data.results[0]

    if (!statsData) {
      return await interaction.editReply('No statistics found for this user.')
    }

    // Fetch points from Polytoria API
    const polytoriaPointsResponse = await axios.get(`https://api.polytoria.co/v1/users/${userID}/greatdivide`, {
      validateStatus: () => true
    })
    const polytoriaData = polytoriaPointsResponse.data

    const getTeamBadge = (team: string): string => {
      if (team === 'phantoms') {
        return emojiUtils.phantoms
      } else if (team === 'cobras') {
        return emojiUtils.cobras
      }
      return ''
    }

    const teamBadge = getTeamBadge(statsData.Team)
    const embedColor = statsData.Team === 'phantoms' ? 0x6889FF : 0x59AA76

    // Calculate KDR
    const kills = statsData.Kills
    const deaths = statsData.Deaths
    const kdr = deaths > 0 ? (kills / deaths).toFixed(2) : 'N/A' // Protect against division by zero

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle(`The Great Divide - ${statsData.Username}`)
      .setURL(`https://polytoria.co/users/${userID}`)
      .setThumbnail(statsData.Thumbnail)
      .addFields(
        { name: 'Information', value: `> **${statsData.Username} was last seen on round ${statsData.LastRoundSeen} is currently rank ${polytoriaData.rank} and joined the ${teamBadge} ${statsData.Team} on ${dateUtils.atomTimeToDisplayTime(polytoriaData.joinedAt)}**`, inline: false },
        { name: 'Kills', value: kills.toLocaleString(), inline: true },
        { name: 'Deaths', value: deaths.toLocaleString(), inline: true },
        { name: 'KDR', value: kdr, inline: true },
        { name: 'Unique Kills', value: statsData.UniqueKills.toLocaleString(), inline: true },
        { name: 'Total Points', value: `${emojiUtils.points} ${polytoriaData.points.toLocaleString()}`, inline: true },
        { name: 'Cash Earned', value: statsData.CashEarned.toLocaleString(), inline: true },
        { name: 'Flags Captured', value: statsData.FlagsCaptured.toLocaleString(), inline: true },
        { name: 'Flags Returned', value: statsData.FlagsReturned.toLocaleString(), inline: true },
        { name: 'Airdrops Collected', value: statsData.AirdropsCollected.toLocaleString(), inline: true },
        { name: 'Obelisks Destroyed', value: statsData.ObelisksDestroyed.toLocaleString(), inline: true },
        { name: 'Blocks Placed', value: statsData.BlocksPlaced.toLocaleString(), inline: true },
        { name: 'Blocks Destroyed', value: statsData.BlocksDestroyed.toLocaleString(), inline: true },
        { name: 'Headshots', value: statsData.Headshots.toLocaleString(), inline: true }
      )
      .setFooter({ text: 'This data has been provided by Dragonism. Thank you for your public API!', iconURL: 'https://c0.ptacdn.com/thumbnails/avatars/609b3d372095b3fa1d7c1ecd6ed41f0eb05ec3f3ba6ba581191b83f17828bf94-icon.png' })

    await interaction.editReply({ embeds: [embed] })
  } catch (error) {
    console.error('Error fetching user statistics:', error)
    await interaction.editReply({ content: 'There was an error fetching the user statistics. Please try again later.' })
  }
}
