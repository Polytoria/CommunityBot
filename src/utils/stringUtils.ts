export class stringUtils {
  /**
 * ### URL Parse
 * @param { string } URL that want to be parsed.
 * @returns { urlData: string, searchParams: URLSearchParams, splitted: string[] }
 */
  public static urlParse (url: string): {urlData: URL; searchParams: URLSearchParams; splitted: string[]} {
    const urlConstruct = new URL(url)

    return {
      urlData: urlConstruct,
      searchParams: urlConstruct.searchParams,
      splitted: url.split('/')
    }
  }

  /**
 * ### Get Numbers From URL
 * @param { string } URL that want to be parsed
 * @returns { number[] } Numbers that has been found in URL
 */
  public static getNumbersFromURL (url: string): number[] {
    const parsed = stringUtils.urlParse(url)
    const result: number[] = []

    parsed.splitted.forEach(function (item: string) {
      const value = parseInt(item)

      if (isNaN(value) === false) {
        result.push(value)
      }
    })

    return result
  }

  /**
 *
 * @param {string} string String that you want to be capitalize
 * @returns {string} capitalized string
 */
  public static capitalizeString (string: string): string {
    const arr = string.toLowerCase().split(' ')

    for (let i = 0; i < arr.length; i++) {
      arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
    }

    const result = arr.join(' ')

    return result
  }

  /**
   * numberWithCommas Function
   *
   * @summary Give number a commas
   *
   * @param {number} x
   * @returns {string} String with commas
   */
  public static numberWithCommas (x: number): string {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }

  /**
   * getLines function
   *
   * @summary Get how many lines string used, Especially for Canvas
   *
   * @param ctx
   * @param text
   * @param maxWidth
   * @returns
   */
  public static getLines (ctx: any, text: string, maxWidth: number): string[] {
    const words = text.split(' ')
    const lines = []
    let currentLine = words[0]

    for (let i = 1; i < words.length; i++) {
      const word = words[i]
      const width = ctx.measureText(currentLine + ' ' + word).width
      if (width < maxWidth) {
        currentLine += ' ' + word
      } else {
        lines.push(currentLine)
        currentLine = word
      }
    }
    lines.push(currentLine)
    return lines
  }

  /**
   * replaceAll Function
   *
   * @summary Find string and replace all
   *
   * @param {string} str Original String
   * @param {string} find String to find
   * @param {string} replace Replace string with
   * @returns {string} Replaced string
   */
  public static replaceAll (str: string, find: string | RegExp, replace: string): string {
    return str.replace(new RegExp(find, 'g'), replace)
  }
}
