import { CommandInteraction, EmbedBuilder } from 'discord.js'
import emojiUtils from '../../utils/emojiUtils.js'

export async function handleUserSummary (interaction: CommandInteraction, username: string) {
  await interaction.deferReply()

  try {
    // Fetch user ID
    const lookupResponse = await fetch(`https://api.polytoria.com/v1/users/find?username=${username}`)
    const lookupData = await lookupResponse.json()

    if (!lookupData) {
      return await interaction.editReply('User not found!')
    }

    const userID = lookupData.id

    // Fetch user stats from new API
    const statsResponse = await fetch(`https://stats.silly.mom/player_stats?id=${userID}`)
    const statsData = await statsResponse.json()

    if (!statsData || !statsData.results[0]) {
      return await interaction.editReply('No statistics found for this user.')
    }

    const stats = statsData.results[0]

    const getTeamBadge = (team: string): string => {
      if (team === 'phantoms') {
        return emojiUtils.phantoms
      } else if (team === 'cobras') {
        return emojiUtils.cobras
      }
      return ''
    }

    const teamBadge = getTeamBadge(stats.Team)
    const embedColor = stats.Team === 'phantoms' ? 0x6889FF : 0x59AA76

    // Calculate KDR
    const kills = stats.Kills
    const deaths = stats.Deaths
    const kdr = deaths > 0 ? (kills / deaths).toFixed(2) : 'N/A' // Protect against division by zero

    const embed = new EmbedBuilder()
      .setColor(embedColor)
      .setTitle(`The Great Divide - ${stats.Username}`)
      .setURL(`https://polytoria.com/users/${userID}`)
      .setThumbnail(stats.Thumbnail)
      .addFields(
        { name: 'Information', value: `> **${stats.Username} is on team ${teamBadge} ${stats.Team} and was last seen on round ${stats.LastRoundSeen}**`, inline: false },
        { name: 'Kills', value: kills.toLocaleString(), inline: true },
        { name: 'Deaths', value: deaths.toLocaleString(), inline: true },
        { name: 'KDR', value: kdr, inline: true },
        { name: 'Unique Kills', value: stats.UniqueKills.toLocaleString(), inline: true },
        { name: 'Total Points', value: `${emojiUtils.points} ${stats.PointsScored.toLocaleString()}`, inline: true },
        { name: 'Cash Earned', value: stats.CashEarned.toLocaleString(), inline: true },
        { name: 'Flags Captured', value: stats.FlagsCaptured.toLocaleString(), inline: true },
        { name: 'Flags Returned', value: stats.FlagsReturned.toLocaleString(), inline: true },
        { name: 'Airdrops Collected', value: stats.AirdropsCollected.toLocaleString(), inline: true },
        { name: 'Obelisks Destroyed', value: stats.ObelisksDestroyed.toLocaleString(), inline: true },
        { name: 'Blocks Placed', value: stats.BlocksPlaced.toLocaleString(), inline: true },
        { name: 'Blocks Destroyed', value: stats.BlocksDestroyed.toLocaleString(), inline: true },
        { name: 'Headshots', value: stats.Headshots.toLocaleString(), inline: true }
      )
      .setFooter({ text: 'This data has been provided by dargy. Thank you for your public API!', iconURL: 'https://c0.ptacdn.com/thumbnails/avatars/9dbe39b3e3aac2017aba9c37fcea63fa87800262911b556487050ecda894ab4f-icon.png' })

    await interaction.editReply({ embeds: [embed] })
  } catch (error) {
    console.error('Error fetching user statistics:', error)
    await interaction.editReply({ content: 'There was an error fetching the user statistics. Please try again later.' })
  }
}
