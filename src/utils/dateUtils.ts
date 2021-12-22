class dateUtils {
	public static monthDifference(date1: Date, date2: Date): number {
		let months
		months = (date1.getFullYear() - date2.getFullYear()) * 12
		months -= date1.getMonth()
		months += date2.getMonth()
		return months <= 0 ? 0 : months
	}
}
