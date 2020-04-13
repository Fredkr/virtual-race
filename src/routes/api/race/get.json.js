import { getAllByUser } from '../../../db/race';

export async function get(req, res, next) {
    //console.log(req.session.passport);
    getAllByUser(req.session.passport.user.id).then(races => {
        if (races !== null) {
            res.setHeader('Content-Type', 'application/json');
            res.json(races);
        } else {
            next();
        }
    });
}