let DisplayTexts: any = {
    "Invalid username.": "I don't see the player with that username, maybe try again.. or If you're searching using ID, Try type \" id\" after your targetted user id!",
    "Invalid user ID.": "I don't see the player with that id, maybe try again.. or If you're searching using username, Try type \" username\" after your targetted user s' username!"
}

export class apiErrorHandler {
    /**
     * Check Error
     * @param response Gets request type from node-fetch
     * @param data Gets request.json from node-fetch
     * @returns Dictionary
     * {
            HasError: false,
            StatusCode: 0,
            DisplayText: "Error message visibles to user",
            ActualError: "Actual Error from server"
        }
     */
    public static CheckError(response: any,data: any) {

        let result: any = {
            HasError: false,
            StatusCode: 0,
            DisplayText: "Unknown Error.",
            ActualError: "Unknown Error."
        }

        result.StatusCode = response.status

        if (response.status.toString().startsWith("5")) {
            result.HasError = true
            result.DisplayText = "An unexpected error happen while sending request to Polytoria API. Please try again in a few minutes."
            result.ActualError = "API Error."
        } else {
            if (data["Success"] == false) {
                result.HasError = true
                result.ActualError = data.Errors[0]

                if (DisplayTexts[result.ActualError]) {
                    result.DisplayText = DisplayTexts[result.ActualError]
                }
            }
        }

        return result
    }


}