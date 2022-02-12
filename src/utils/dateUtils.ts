export class dateUtils {
  /**
   * monthDifference Function
   *
   * @summary Used for calculate difference between month
   *
   * @param {Date} date1 Start Date
   * @param {Date} date2 End Date
   * @returns {number} difference between month
   */
  public static monthDifference (date1: Date, date2: Date): number {
    let months = (date1.getFullYear() - date2.getFullYear()) * 12
    months -= date1.getMonth()
    months += date2.getMonth()

    return months <= 0 ? 0 : months
  }

  /**
 * atom Time To Display Time
 * @param atomTime Atom time format
 * @returns {string} formatted date as string
 */
  public static atomTimeToDisplayTime (atomTime: string): string {
    const date = new Date(atomTime)

    let day: string | number = date.getDate()
    if (day < 10) {
      day = day.toString()
      day = '0' + day
    };

    let month: string | number = date.getMonth() + 1
    if (month < 10) {
      month = month.toString()
      month = '0' + month
    }

    const year: string | number = date.getFullYear()

    const formatted = `${day}/${month}/${year}`

    return formatted
  }
}
