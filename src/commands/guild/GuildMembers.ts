export async function fetchMembers (id: number, page: number) {
  const response = await fetch(`https://api.polytoria.com/v1/guilds/${id}/members?page=${page}&limit=15`)

  const data = await response.json()
  const memberData = data.members
  const totalMembers = data.total
  const totalPages = data.pages

  // If no members are found, return a message
  if (memberData.length === 0) {
    return 'There are no members in this guild.'
  }

  // Prepare the members' usernames list
  const memberUsernames = memberData
    .map((member: any) => `[${member.user.username}](https://polytoria.com/users/${member.user.id})`)
    .join('\n')

  // Format and return the result string
  return `> **Total Members: ${totalMembers}\n > Page ${page}/${totalPages}**\n\n${memberUsernames}`
}
