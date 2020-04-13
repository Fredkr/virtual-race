import db from '../../../../db/race';

export async function get(req, res, next) {
    db.get(req.params.slug).then(race => {
        if (race !== null) {
            res.setHeader('Content-Type', 'application/json');
            console.log('----------', race);
            res.json(race);
        } else {
            next();
        }
    });
}