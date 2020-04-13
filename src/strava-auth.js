const fetch = require('node-fetch');

const getToken = (token) => {
    const url = `https://www.strava.com/oauth/token?client_id=${process.env.STRAVA_CLIENT_ID}&client_secret=${process.env.STRAVA_CLIENT_SECRET}&code=${token}`;
    console.log(url);
    const result = fetch(url, { method: 'post'});
    return result.json();
};

module.exports = {
    getToken
};