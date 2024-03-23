"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const API = 'https://api.rescuegroups.org/http/v2.json';
class RG {
    constructor(accountId) {
        this.accountId = accountId;
    }
    /**
     * Login to RescueGroups using username and password to get a token and hash
     * for further API calls.
     *
     * @param username string
     * @param password string
     */
    async login(username, password) {
        const res = await fetch(API, {
            method: 'POST',
            body: JSON.stringify({
                "username": username,
                "password": password,
                "accountNumber": this.accountId,
                "action": "login"
            })
        });
        const result = await res.json();
        if (result?.data?.token && result?.data?.tokenHash) {
            this.token = result.data.token;
            this.tokenHash = result.data.tokenHash;
        }
        else {
            throw new Error('Missing token and/or hash');
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
        };
        const res = await fetch(API, {
            method: 'POST',
            body: JSON.stringify(query)
        });
        const results = await res.json();
        return Object.values(results.data);
    }
}
exports.default = RG;
//# sourceMappingURL=RG.js.map