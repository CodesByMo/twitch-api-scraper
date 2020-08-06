const _ = require('lodash')
const fs = require('fs')
const getTwitchLinks = require('../scripts/getTwitchLinks')
const getTwitterProfile = require('../scripts/getTwitterProfile')
const { result } = require('lodash')


const execute = async () => {
    const channels = ['hiimtwit']

    let twitchResponses = await Promise.all(
        _.map(channels, (channel) => {
            return getTwitchLinks(channel)
        })
    )

    let filteredTwitchResponses = _.filter(twitchResponses, (channel) => {
        // {
        //     name: String,
        //     bio: String,
        //     links: Array<Object>
        // }
        // [{
        //     name: String,
        //     link: String
        // }]

        // console.log(channel.links)

        const hasTwitter = _.find(channel.links, (item) => {
            if (!item.url) return false
            return item.url.includes('twitter.com/')
        })

        return hasTwitter
    })

    const results = await Promise.all(
        _.map(filteredTwitchResponses, async (channel) => {
            const twitterItem = _.find(channel.links, (item) => {
                if (!item.url) return false
                return item.url.includes('twitter.com/')
            })

            // console.log(twitterItem)

            const twitterName = twitterItem.url.split('twitter.com/')[1].replace('/', '')
            const twitterProfile = await getTwitterProfile(twitterName)

            channel.twitter = twitterProfile
            return channel
        })
    )
    fs.writeFileSync(`./data/output.json`, JSON.stringify(results, null, 4))

    process.exit()
}


execute()
