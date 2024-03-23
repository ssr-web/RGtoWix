import { RGDog } from "./RG"

interface FetchOpts extends Omit<RequestInit, 'body'> {
  body?: string | Record<any, any>
}

interface WIXDog {
  "adoptionFee": string,
  "animalId": number,
  "breed": string,
  "description": string,
  "descriptionNoHtml": string,
  "dogsRescueId": string,
  "exactBirthdate": string,
  "generalAge": string,
  "location": string,
  "locationPublic": string,
  "name": string,
  "needsAFoster": boolean,
  "picture1": string,
  "picture1Url": string,
  "picture2": string,
  "picture2Url": string,
  "picture3": string,
  "picture3Url": string,
  "picture4": string,
  "picture4Url": string,
  "relativeAge": string,
  "rescueId": string,
  "sex": string,
  "gallery": Array<
    {
      "description": string,
      "slug": string,
      "alt": string,
      "src": string,
      "title": string,
      "type": string,
      "settings": {
        "focalPoint": [
          number,
          number
        ],
        "imageInfo": {
          "width": number,
          "height": number,
          "filename": string
        }
        "width": number,
        "height": number
      }
    }
  >,
}

class WIX {
  collection: string
  token: string
  headers: RequestInit['headers']
  constructor(token: string, collection: string) {
    this.collection = collection
    this.token = token
    this.headers = {
      "Authorization": this.token,
      "wix-site-id": "a005323b-ae58-4d14-b5d3-91e4d30f5421",
      "Content-Type": "application/json"
    }
  }

  /**
   * Create a fetch utility to make requests to WIX with the preset
   * authentication headers.
   *  
   * @param url string 
   * @param opts string 
   * @returns fetch results 
   */
  fetch(url: string, opts: FetchOpts) {
    const opt: RequestInit = {
      method: 'POST',
      headers: this.headers
    }
    Object.assign(opt, opts)
    opt.body = JSON.stringify(opts.body)
    return fetch(url, opt)
  }

  /**
   * Strip out the width url param to get the full image size
   *  
   * @param url string
   * @returns string | undefined
   */
  stripWidth(url: string) {
    try {
      const u = new URL(url)
      u.searchParams.delete('width')
      return u.toString()
    } catch {
      return undefined
    }
  }

  /**
   * Remap the RG data to the WIX data names for each dog
   * 
   * @param dog 
   */
  mapDogs(dog: RGDog): Partial<WIXDog> {
    return {
      "animalId": Number(dog.animalID),
      "breed": dog.animalBreed,
      "description": dog.animalDescription,
      "descriptionNoHtml": dog.animalDescription,
      "exactBirthdate": dog.animalBirthdateExact,
      "generalAge": dog.animalGeneralAge,
      "location": dog.animalLocationCitystate,
      "locationPublic": 'Yes',
      "name": dog.animalName,
      "needsAFoster": dog.animalNeedsFoster === 'Yes' ? true : false,
      "picture1": this.stripWidth(dog.animalThumbnailUrl),
      "picture1Url": this.stripWidth(dog.animalThumbnailUrl),
      "relativeAge": dog.animalAgeString,
      "rescueId": dog.animalRescueID,
      "sex": dog.animalSex,
      "gallery": dog.animalPictures.map(p => this.createMediaGalleryImage(p.urlSecureFullsize, p.fileNameFullsize, dog.animalName, Number(p.resolutionX), Number(p.resolutionY)))   
    }
  }

  /**
   * Format all pet images into a wix media galary object
   * 
   * @param url 
   * @param filename 
   * @param name 
   * @param width 
   * @param height 
   * @returns 
   */
  createMediaGalleryImage(url: string, filename: string, name: string, width: number, height: number): WIXDog['gallery'][0] {
    return {
      "description": name,
      "slug": filename,
      "alt": name,
      "src": url,
      "title": name,
      "type": "image",
      "settings": {
        "focalPoint": [0.5, 0.5],
        "imageInfo": {
          "width": width,
          "height": height,
          "filename": filename
        },
        "width": width,
        "height": height
      }
    }
  }

  
  /**
   * Empty the collection before trying to upload new pets.
   */
  async truncate() {
    const res = await this.fetch(
      'https://www.wixapis.com/wix-data/v2/items/truncate',
      {
        body: {
          dataCollectionId: this.collection,
        }
      }
    )
    const results = await res.json()
    return results
  }

  /**
   * Insert the newly mapped RG dogs
   */
  async insert(dogs: Array<RGDog>) {
    const mappedDogs = dogs.map(dog => {
      return {
        data: this.mapDogs(dog)
      }
    })
    const res = await this.fetch(
      'https://www.wixapis.com/wix-data/v2/bulk/items/insert',
      {
        body: {
          dataCollectionId: this.collection,
          dataItems: mappedDogs
        }
      }
    )
    const results = await res.json()
    return results
  }
}

export default WIX