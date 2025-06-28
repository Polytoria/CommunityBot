import { EmbedBuilder } from 'discord.js'

export const responseHandler = {
  /**
   * Check if the response has an error and return a result object.
   * @param {Response} response - The fetch response object.
   * @returns {Promise<Object>} - Error status, status code, and embed if an error exists.
   */
  async checkError (response: Response) {
    const hasError = !response.ok // response.ok is true for 200–299 status codes.
    const statusCode = response.status

    let embed = null

    if (hasError) {
      let errorMessage = `An error occurred. HTTP Status: ${statusCode}`
      let errorCode = 'UNKNOWN_ERROR'

      // Try to parse the error response body (if available)
      try {
        const errorBody = await response.json()
        if (errorBody.errors && Array.isArray(errorBody.errors) && errorBody.errors.length > 0) {
          errorCode = errorBody.errors[0].code || errorCode
          errorMessage = errorBody.errors[0].message || errorMessage
        }
      } catch (e) {
        // Do nothing if parsing fails
      }

      // Custom handling for 404 and 500 errors
      if (statusCode === 404) {
        embed = new EmbedBuilder()
          .setTitle('404 - Not Found')
          .setDescription(
            `The provided place ID couldn't be found. Please double-check the ID.\n\n**Internal Information:**\n**Status Code:** \`${statusCode}\`\n**Error Code:** \`${errorCode}\`\n**Message:** ${errorMessage}`
          )
          .setColor(0xFF5454)
      } else if (statusCode === 500) {
        embed = new EmbedBuilder()
          .setTitle('500 - Internal Server Error')
          .setDescription(
            `An internal error occurred on the Polytoria website. Please report this to the developers with the following information:\n\n**Status Code:** \`${statusCode}\`\n**Error Code:** \`${errorCode}\`\n**Message:** ${errorMessage}`
          )
          .setColor(0xFF5454)
      } else {
        // Default error handling
        embed = new EmbedBuilder()
          .setTitle('Error Occurred')
          .setDescription(
            `An error occurred while processing your request. Please try again later.\n\n**Status Code:** \`${statusCode}\`\n**Error Code:** \`${errorCode}\`\n**Message:** ${errorMessage}`
          )
          .setColor(0xFF5454)
      }
    }

    return { hasError, statusCode, embed }
  }
}
