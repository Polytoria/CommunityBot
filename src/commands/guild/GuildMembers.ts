import axios from 'axios'

export async function fetchMembers (id: number, page: number) {
  // Fetch the members data from the API
  const memberResponse = await axios.get(`https://api.polytoria.co/v1/guilds/${id}/members?page=${page}&limit=15`)
  const memberData = memberResponse.data.members
  const totalMembers = memberResponse.data.total
  const totalPages = memberResponse.data.pages

  // If no members are found, return a message
  if (memberData.length === 0) {
    return 'There are no members in this guild.'
  }

  // Prepare the members' usernames list
  const memberUsernames = memberData
    .map((member: any) => `[${member.user.username}](https://polytoria.co/users/${member.user.id})`)
    .join('\n')

  // Format and return the result string
  return `> **Total Members: ${totalMembers}\n > Page ${page}/${totalPages}**\n\n${memberUsernames}`
}
