import {AxiosResponse} from 'axios'

const displayTexts: Record<string, string> = {
	'Invalid username.': 'I don\'t see the player with that username, maybe try again.. or If you\'re searching using ID, Try type " id" after your targetted user id!',
	'Invalid user ID.': "I don't see the player with that id, maybe try again.. or If you're searching using username, Try type \" username\" after your targetted user s' username!"
}

export class responseHandler {
	/**
     * Check Error
     * @param response Gets request type from Axios
     * @param data Gets request.json from Axios
     * @returns
     * {
            HasError: boolean,
            StatusCode: number,
            DisplayText: string,
            ActualError: string
        }
     */
	public static checkError(response: AxiosResponse) {
		const result: {HasError: boolean; StatusCode: number; DisplayText: string; ActualError: string} = {
			HasError: false,
			StatusCode: 0,
			DisplayText: 'Unknown Error.',
			ActualError: 'Unknown Error.'
		}

		result.StatusCode = response.status

		if (response.status >= 500) {
			result.HasError = true
			result.DisplayText = 'An unexpected error happen while sending request to Polytoria API. Please try again in a few minutes.'
			result.ActualError = 'API Error.'
		} else {
			if (response.data.Success === false) {
				result.HasError = true
				result.ActualError = response.data.Errors[0]

				if (displayTexts[result.ActualError]) {
					result.DisplayText = displayTexts[result.ActualError]
				}
			}
		}

		return result
	}
}
