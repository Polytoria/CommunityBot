import { CommandInteraction, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuInteraction, ComponentType, TextChannel } from 'discord.js'
import axios from 'axios'
import emojiUtils from '../../utils/emojiUtils.js'

export const statsOptions = [
  { label: 'Kills', value: 'kills' },
  { label: 'Deaths', value: 'deaths' },
  { label: 'KDR', value: 'kdr' },
  { label: 'Unique Kills', value: 'uniquekills' },
  { label: 'Points Scored', value: 'pointsscored' },
  { label: 'Cash Earned', value: 'cashearned' },
  { label: 'Flags Captured', value: 'flagscaptured' },
  { label: 'Flags Returned', value: 'flagsreturned' },
  { label: 'Airdrops Collected', value: 'airdropscollected' },
  { label: 'Obelisks Destroyed', value: 'obelisksdestroyed' },
  { label: 'Blocks Placed', value: 'blocksplaced' },
  { label: 'Blocks Destroyed', value: 'blocksdestroyed' },
  { label: 'Headshots', value: 'headshots' }
]

export async function handleLeaderboard (interaction: CommandInteraction) {
  try {
    // Fetch default leaderboard data sorted by "kills"
    const response = await axios.get('https://stats.silly.mom/sortPlayers?type=kills&sort=DESC&limit=10')
    const data = response.data.results

    // Create an embed for the default leaderboard
    const embed = new EmbedBuilder()
      .setTitle('The Great Divide - Top 10 Players by Kills')
      .setDescription(formatLeaderboard(data, 'Kills'))
      .setFooter({ text: 'This data has been provided by dargy. Thank you for your public API!', iconURL: 'https://c0.ptacdn.com/thumbnails/avatars/9dbe39b3e3aac2017aba9c37fcea63fa87800262911b556487050ecda894ab4f-icon.png' })

    // Create the dropdown menu
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('leaderboard_select')
      .setPlaceholder('Choose a statistic...')
      .addOptions(statsOptions)

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(selectMenu)

    // Send the embed and the dropdown menu
    await interaction.reply({ embeds: [embed], components: [row] })

    if (interaction.channel && interaction.channel instanceof TextChannel) {
      const collector = interaction.channel.createMessageComponentCollector({
        componentType: ComponentType.StringSelect,
        time: 60000 // Collector timeout: 60 seconds
      })

      collector.on('collect', async (menuInteraction: StringSelectMenuInteraction) => {
        if (menuInteraction.customId === 'leaderboard_select') {
          await handleSelectMenuInteraction(menuInteraction)
        }
      })
    }
  } catch (error) {
    console.error('Error fetching leaderboard data:', error)
    await interaction.reply({ content: 'Error fetching leaderboard data. Please try again later.', ephemeral: true })
  }
}

async function handleSelectMenuInteraction (interaction: StringSelectMenuInteraction) {
  const selectedOption = interaction.values[0]
  const selectedLabel = statsOptions.find(option => option.value === selectedOption)?.label || 'Kills'

  try {
    // Fetch new leaderboard data based on the selected option
    const response = await axios.get(`https://stats.silly.mom/sortPlayers?type=${selectedOption}&sort=DESC&limit=10`)
    let data = response.data.results

    if (selectedOption === 'kdr') {
      // Calculate KDR for each player and sort by KDR in descending order
      data = data.map((player: any) => ({
        ...player,
        kdr: (player.Kills / (player.Deaths || 1)).toFixed(2) // Avoid division by zero
      })).sort((a: any, b: any) => parseFloat(b.kdr) - parseFloat(a.kdr))
    }

    // Update the embed with new leaderboard data
    const embed = new EmbedBuilder()
      .setTitle(`The Great Divide - Top 10 Players by ${selectedLabel}`)
      .setDescription(formatLeaderboard(data, selectedLabel))
      .setFooter({ text: 'This data has been provided by dargy. Thank you for your public API!', iconURL: 'https://c0.ptacdn.com/thumbnails/avatars/9dbe39b3e3aac2017aba9c37fcea63fa87800262911b556487050ecda894ab4f-icon.png' })

    await interaction.update({ embeds: [embed] })
  } catch (error) {
    console.error('Error fetching new leaderboard data:', error)
    await interaction.followUp({ content: 'Error fetching new leaderboard data. Please try again later.', ephemeral: true })
  }
}

function formatLeaderboard (data: any[], statLabel: string): string {
  return data.map((player: any) => {
    const emoji = player.Team === 'cobras' ? emojiUtils.cobras : emojiUtils.phantoms
    const statValue = statLabel === 'KDR' ? player.kdr : player[statLabel.replace(/ /g, '')]
    return `${emoji} **${player.Username}** - ${statLabel}: ${statValue.toLocaleString()}`
  }).join('\n')
}
