import { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } from 'discord.js'
import axios from 'axios'
import emojiUtils from '../../utils/emojiUtils.js'

export async function fetchAvatar (userID: number) {
  const avatarResponse = await axios.get(`https://api.polytoria.com/v1/users/${userID}/avatar`, {
    validateStatus: () => true
  })
  return avatarResponse.data
}

export function buildAvatarEmbed (userData: any, avatarData: any) {
  const colors = Object.entries(avatarData.colors)
    .map(([part, color]) => `**${part.charAt(0).toUpperCase() + part.slice(1)}**: #${color}`)
    .join('\n')

  let assetsList = ''
  if (avatarData.assets) {
    assetsList = avatarData.assets
      .map((asset: { type: { toString: () => any }; name: any; id: any }) => {
        const assetType = asset.type.toString()
        const assetTypeEmoji = emojiUtils[assetType as keyof typeof emojiUtils] ?? ''
        return `${assetTypeEmoji} [${asset.name}](https://polytoria.com/store/${asset.id})`
      })
      .join('\n')
  }

  const embed = new EmbedBuilder()
    .setTitle(`${userData.username}'s Avatar`)
    .setURL(`https://polytoria.com/u/${userData.username}`)
    .setDescription(`**Currently Wearing**\n${assetsList}\n\n**Body Colors**\n${colors}`)
    .setColor('#3498db')
    .setThumbnail(userData.thumbnail?.avatar ?? '')

  return embed
}

export function buildAvatarComponents (actionRowDropdown: ActionRowBuilder<StringSelectMenuBuilder>) {
  return [actionRowDropdown]
}
