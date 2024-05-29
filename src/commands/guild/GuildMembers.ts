import axios from 'axios'

export async function fetchMembers (id: number, page: number) {
  const memberResponse = await axios.get(`https://api.polytoria.com/v1/guilds/${id}/members?page=${page}&limit=15`)
  const memberData = memberResponse.data.members
  const memberUsernames = memberData
    .map((member: any) => `[${member.user.username}](https://polytoria.com/u/${member.user.username})`)
    .join('\n')

  if (memberData.length === 0) {
    return 'There are no members in this guild.'
  }

  return memberUsernames
}
