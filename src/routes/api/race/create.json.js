import { create } from '../../../db/race';

export async function put(req, res, next) {
    const race = {
        name: req.body.name,
        description: req.body.description,
        dateSpan: req.body.dateSpan,
        segment: req.body.segment,
        createdBy: req.session.passport.user.id
    };

    create(race).then(result => {
        if (result !== null) {
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
        } else {
            next();
        }
    });
}