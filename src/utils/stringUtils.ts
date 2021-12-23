const url_pattern = new RegExp('^(https?:\\/\\/)?'+
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+
    '((\\d{1,3}\\.){3}\\d{1,3}))'+
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ 
    '(\\#[-a-z\\d_]*)?$','i');

export class stringUtils {
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
     * @returns 
     * {
     *  URLData: string,
        searchParams: URLSearchParams,
        spitted: Array<string>
     * }
    */

    public static urlParse(url: string) {
        let urlConstruct = new URL(url);
        let searchParams_url = urlConstruct.searchParams
        let spitted_url: Array<string> = url.split("/")

        let returnResult: {URLData: URL, searchParams: URLSearchParams, spitted: Array<string>} = {
            URLData: urlConstruct,
            searchParams: searchParams_url,
            spitted: spitted_url
        }

        return returnResult
    }

    /**
     * ### Get Numbers From URL
     * @param string URL that want to be parsed
     * @returns array Numbers that has been found in URL
    */
    public static getNumbersFromURL(string: string) {
        let result = stringUtils.urlParse(string)
        let splitted = result.spitted

        let returnresult: Array<string> = []

        splitted.forEach(function (item:string) {
            if (isNaN(parseInt(item)) == false) {
                returnresult.push(item)
            }
        })

        return returnresult

    }

    /**
     * ### Is URL
     * @param string string that you want to checks that's url or not
     * @returns bool returns if it were url or not
     */
    public static strIsURL(string: string) {
        return !!url_pattern.test(string);
    }
}