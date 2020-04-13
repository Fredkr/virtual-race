const fetch = require('node-fetch');

export async function get(req, res, next) {
    const url = `https://www.strava.com/api/v3/segments/explore?bounds=${req.query.bounds}&activity_type=running`;
    const result = await fetch(url, {
        method: 'get',
        headers: {
            'Authorization': `Bearer ${req.session.passport.user.token}`,
            'Content-Type': 'application/json'
        }
    });

    const segments = await result.json();

    if (segments !== null) {
        res.setHeader('Content-Type', 'application/json');
        res.json(segments);
    } else {
        next();
    }
}