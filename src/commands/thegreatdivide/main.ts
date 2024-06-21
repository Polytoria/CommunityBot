import { CommandInteraction } from 'discord.js'
import { handleLeaderboard } from './leaderboard.js'
import { handleUserSummary } from './userstats.js'
import { handleSummary } from './summary.js'
import { handleRoundStats } from './roundstats.js'
import { handleRecentRounds } from './recentrounds.js'

export async function thegreatdivide (interaction: CommandInteraction) {
  // @ts-expect-error
  const roundID = interaction.options.getInteger('id')
  // @ts-expect-error
  const username = interaction.options.getString('username')
  // @ts-expect-error
  const isSummary = interaction.options.getSubcommand() === 'summary'
  // @ts-expect-error
  const isLeaderboard = interaction.options.getSubcommand() === 'leaderboard'
  // @ts-expect-error
  const isRound = interaction.options.getSubcommand() === 'round'

  if (isSummary) {
    await handleSummary(interaction)
  } else if (roundID) {
    await handleRoundStats(interaction, roundID)
  } else if (isRound) {
    await handleRecentRounds(interaction)
  } else if (username) {
    await handleUserSummary(interaction, username)
  } else if (isLeaderboard) {
    await handleLeaderboard(interaction)
  }
}
