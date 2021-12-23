export class stringUtils {
	/**
     * ### URL Parse
     * @param string URL that want to be parsed
     * @returns {urlData: string, searchParams: URLSearchParams, splitted: string[]}
     */
	public static urlParse(url: string): {urlData: URL; searchParams: URLSearchParams; splitted: string[]} {
		const urlConstruct = new URL(url)

		return {
			urlData: urlConstruct,
			searchParams: urlConstruct.searchParams,
			splitted: url.split('/')
		}
	}

	/**
	 * ### Get Numbers From URL
	 * @param string URL that want to be parsed
	 * @returns array Numbers that has been found in URL
	 */
	public static getNumbersFromURL(string: string): number[] {
		const parsed = stringUtils.urlParse(string)
		const result: number[] = []

		parsed.splitted.forEach(function (item: string) {
			const value = parseInt(item)

			if (isNaN(value) === false) {
				result.push(value)
			}
		})

		return result
	}
}
