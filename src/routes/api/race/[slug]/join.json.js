import race from '../../../../db/race';

export async function put(req, res, next) {
    race.join(req.params.slug, req.session.passport.user).then(race => {
        if (race !== null) {
            res.setHeader('Content-Type', 'application/json');
            res.json(race);
        } else {
            next();
        }
    });
}