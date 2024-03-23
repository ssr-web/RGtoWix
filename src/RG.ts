
const API = 'https://api.rescuegroups.org/http/v2.json'

interface RGDog {
  animalID: string,
  animalOrgID: string,
  animalRescueID: string,
  animalAgeString: string,
  animalBirthdateExact: string,
  animalBreed: string,
  animalDescription: string,
  animalGeneralAge: string,
  animalLocationCitystate: string,
  animalMicrochipped: string,
  animalName: string,
  animalNeedsFoster: string,
  animalPrimaryBreed: string,
  animalSex: string,
  animalSummary: string,
  animalThumbnailUrl: string,
  animalUpdatedDate: string,
  animalUrl: string,
  animalPictures: Array<{
    "mediaID": string,
    "mediaOrder": string,
    "lastUpdated": string,
    "fileSize": string,
    "resolutionX": string,
    "resolutionY": string,
    "fileNameFullsize": string,
    "fileNameThumbnail": string,
    "urlSecureFullsize": string,
    "urlSecureThumbnail": string,
    "urlInsecureFullsize": string,
    "urlInsecureThumbnail": string,
    "original": {
      "type": string,
      "fileSize": string,
      "resolutionX": string,
      "resolutionY": string,
      "url": string
    },
    "large": {
      "type": string,
      "fileSize": string,
      "resolutionX": string,
      "resolutionY": string,
      "url": string
    },
    "small": {
      "type": string,
      "fileSize": string,
      "resolutionX": number,
      "resolutionY": number,
      "url": string
    }
  }>,
}

class RG {
  token: string | undefined
  tokenHash: string | undefined
  accountId: string
  constructor(accountId: string) {
    this.accountId = accountId
  }

  /**
   * Login to RescueGroups using username and password to get a token and hash
   * for further API calls.
   * 
   * @param username string
   * @param password string
   */
  async login(username: string, password: string) {
    const res = await fetch(API, {
      method: 'POST',
      body: JSON.stringify({
        "username": username,
        "password": password,
        "accountNumber": this.accountId,
        "action": "login"
      })
    })
    const result = await res.json()
    if (result?.data?.token && result?.data?.tokenHash) {
      this.token = result.data.token
      this.tokenHash = result.data.tokenHash
    } else {
      throw new Error('Missing token and/or hash')
    }
  }

  /**
   * Search RescueGroups for all dogs with the status "Available" under the
   * provided account ID.
   */
  async getDogs() {
    const query = {
      "token": this.token,
      "tokenHash": this.tokenHash,
      "objectType": "animals",
      "objectAction": "publicSearch",
      "search": {
        "resultStart": "0",
        "resultLimit": "500",
        "filters": [
          {
            "fieldName": "animalStatus",
            "operation": "equal",
            "criteria": "Available"
          },
          {
            "fieldName": "animalOrgID",
            "operation": "equal",
            "criteria": this.accountId
          }
        ],
        "fields": [
          "animalID",
          "animalOrgID",
          "animalRescueID",
          "animalAgeString",
          "animalBirthdateExact",
          "animalBreed",
          "animalDescription",
          "animalGeneralAge",
          "animalLocationCitystate",
          "animalMicrochipped",
          "animalName",
          "animalNeedsFoster",
          "animalPrimaryBreed",
          "animalSex",
          "animalSummary",
          "animalThumbnailUrl",
          "animalUpdatedDate",
          "animalUrl",
          "animalPictures",
          "animalVideos",
          "animalVideoUrls"
        ]
      }
    }
    const res = await fetch(API, {
      method: 'POST',
      body: JSON.stringify(query)
    })
    const results = await res.json()
    return Object.values(results.data) as Array<RGDog>
  }
}

export default RG
export { RGDog }
