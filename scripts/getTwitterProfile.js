const axios = require('axios')
const _ = require('lodash')
const fs = require('fs')
const moment = require('moment')
const { first } = require('lodash')

const directory = `./data/twitter`
if (!fs.existsSync(directory)) fs.mkdirSync(directory)

const execute = async (channel_name) => {
    let response

    try {
        response = await axios.get(`https://api.twitter.com/graphql/-xfUfZsnR_zqjFd-IfrN5A/UserByScreenName?variables=%7B%22screen_name%22%3A%22${channel_name}%22%2C%22withHighlightedLabel%22%3Atrue%7D`, {
            headers: {
                Authorization: 'Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA'
            },
        })
    } catch (error) {
        console.error(`Error fetching description`, error)
        return
    }

    let data = response.data.data.user

    const bioLinks = _.map(data.legacy.entities.url.urls, (item) => {
        return {
            display_url: item.display_url,
            url: item.expanded_url,
            shortened_url: item.url,
            extra_links: data.legacy.entities.description.urls,
        }
    })


    // pull description via bio
    let bio = data.legacy.description;
    bioEmailValidate = ["Business Inquiries" || "biz" || "Biz" || "Business" || "Business Email" || "Contact" || "Email" || "Inquiry" || "Inquiries"];
    //push string to array?
    bioToArray = (str) => {
        return bio.trim().split(" ")
    };
    //check if array contains @email.com OR bioEmailValidate
    console.log(bioToArray().filter(function (item) {
        var finder = ".com";
        return eval('/' + finder + '/').test(item);
    }));
    //push email to array[0]
    //set var to array[0] value
    //output var in twitter contact



    let twitterBio = {
        bio: data.legacy.description,
        bioLinks: bioLinks,
        contact: "bizEmail"
    }

    return twitterBio
}

// execute('timthetatman')

module.exports = execute

// twitter bio
// UserByScreenName?variables=%7B%22screen_name%22%3A%22keekeexbabyy%22%2C%22withHighlightedLabel%22%3Atrue%7D



// https://api.twitter.com/1.1/search/tweets.json?q=from%3Atwitterdev&result_type=mixed&count=2
