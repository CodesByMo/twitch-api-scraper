const axios = require('axios')
const _ = require('lodash')
const fs = require('fs')
const moment = require('moment')

const directory = `./data/twitch-social-links`
if (!fs.existsSync(directory)) fs.mkdirSync(directory)

const execute = async (channel_name) => {
    const gqlQuery = [{
        "operationName": "HomeOfflineCarousel",
        "variables": {
            "channelLogin": channel_name,
            "includeTrailerUpsell": false,
            "trailerUpsellVideoID": "601752619",
            "endorsedChannelsEnabled": false
        },
        "extensions": {
            "persistedQuery": {
                "version": 1,
                "sha256Hash": "c913b10f449ac1094087a80aed2a21962cc9bd7b5be3b5b924df00fd671b2832"
            }
        }
    }]

    let response

    try {
        response = await axios.post(`https://gql.twitch.tv/gql`, gqlQuery, {
            headers: {
                'client-id': 'kimne78kx3ncx6brgo4mv6wki5h1ko'
            }
        })
    } catch (error) {
        console.error(`Error fetching social links`, error)
        return
    }

    let links = _.map(response.data[0].data.user.channel.socialMedias, (link) => {
        return {
            name: link.name,
            url: link.url,
        }
    })

    let bio = response.data[0].data.user.description

    return {
        name: channel_name,
        bio,
        links
    }
}

module.exports = execute
