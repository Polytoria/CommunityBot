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
     * @returns Dictionary
     * {
     *  URLData: origin URL result,
        searchParams: Search parms, (To get parms, use .get("key") method)
        spitted: Splitted URL (['https://','','polytoria.com'])
     * }
    */

    public static urlParse(string: string) {
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
    public static getNumbersFromURL(string: string) {
        let result = stringUtils.urlParse(string)
        let splitted = result.spitted

        let returnresult:Array<any> = []

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