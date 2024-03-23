import RG from "./RG"
import WIX from "./WIX"

interface wixToRGArgs {
    username: string
    password: string
    accountId: string
    token: string
    collection: string
}

const wixToRG = async (args: wixToRGArgs) => {
    console.log('Setting up RG conenction')
    const rg = new RG(args.accountId)
    await rg.login(args.username, args.password)
    console.log("Logged in to RG")
    const dogs = await rg.getDogs()
    console.log(`${dogs.length} found in RG`)
    const wix = new WIX(args.token, args.collection)
    await wix.truncate()
    console.log('Truncated wix collection!')
    const items = await wix.insert(dogs)
    console.log(`${items?.bulkActionMetadata?.totalSuccesses} uploaded to wix collection.`)
}

export default wixToRG