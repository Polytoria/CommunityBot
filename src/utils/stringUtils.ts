export class stringUtils {
	/**
	 * ### URL Parse
	 * @param { string } URL that want to be parsed.
	 * @returns { urlData: string, searchParams: URLSearchParams, splitted: string[] }
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
	 * @param { string } URL that want to be parsed
	 * @returns { number[] } Numbers that has been found in URL
	 */
	public static getNumbersFromURL(url: string): number[] {
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
	 * @param string String that you want to be capitalize
	 * @returns {string} capitalized string
	 */
	public static capitalizeString(string: string): string {
		
		const arr = string.toLowerCase().split(" ");

		for (let i = 0; i < arr.length; i++) {
			arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
		}

		const result = arr.join(" ");

		return result
	}
}
