class stringUtils {
	/**
	 * ### Transforms number periods to comas. *Formatting*
	 * @example 2.320 => "2,320"
	 * @param number Input of which number to transform.
	 * @returns Transformed number as a string.
	 */
	public static numberToComas(number: number): string {
		return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	}
	/**
	 * ### Custom String replacer running with RegExp support
	 * @param string String to be replaced.
	 * @param keyword Keyword to replace.
	 * @param replace String to replace keywords with.
	 * @returns Replaced String.
	 */
	public static async customReplace(string: string, keyword: string, replace: string) {
		return string.replace(new RegExp(keyword, 'g'), replace)
	}
}
