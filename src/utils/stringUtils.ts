class stringUtils {
    /**
     * ### Transforms number periods to comas. *Formatting*
     * @example 2.320 => "2,320"
     * @param number Input of which number to transform.
     * @returns Transformed number as a string.
     */
    public static numberToComas(number: number) : string {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    /**
     * ### Custom String replacer running with RegExp support
     * @param string String to be replaced.
     * @param keyword Keyword to replace.
     * @param replace String to replace keywords with.
     * @returns Replaced String.
     */
     public static async customReplace(string: string, keyword: string, replace: string) {
        return string.replace(new RegExp(keyword, "g"), replace);
    }

    /**
     * ### URL Parse
     * @param string URL that want to be parsed
     * @returns Dictionary
     * {
     *  URLData: origin URL result,
        searchParams: Search parms, (To get parms, use .get("key") method)
        spitted: Splitted URL (['https://','','polytoria.com'])
     * }
    */

    public static async URLParse(string: string) {
        let url = new URL(string);
        let searchParams_url = url.searchParams
        let spitted_url:Array<any> = string.split("/")

        return {
            URLData: url,
            searchParams: searchParams_url,
            spitted: spitted_url
        }
    }

    /**
     * ### Get Numbers From URL
     * @param string URL that want to be parsed
     * @returns array Numbers that has been found in URL
    */
    public static async GetNumbersFromURL(string: string) {
        let result = await stringUtils.URLParse(string)
        let splitted = result.spitted

        let returnresult:Array<any> = []

        splitted.forEach(function (item:string) {
            if (isNaN(parseInt(item)) == false) {
                returnresult.push(item)
            }
        })

        return returnresult

    }
}