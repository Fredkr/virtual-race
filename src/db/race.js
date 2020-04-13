
const Race = require('./models/race');
const Participant = require('./models/participant');

const create = (race) => {
    const newRace = new Race({
        name: race.name,
        description: race.description,
        dateSpan: race.dateSpan,
        segment: race.segment,
        createdBy: race.createdBy
    });
    return newRace.save();
};

const join = (raceId, user) => {
    const update = {
        name: user.displayName,
        externalId: user.id
    };

    return Participant.findOneAndUpdate(
            { externalId: update.externalId },
            update,
            { upsert: true, new : true }
        )
        .then(participant => {
            return Race.findOneAndUpdate(
                { _id: raceId },
                { $addToSet: { "participants": participant.id }},
                { upsert: true, new : true, useFindAndModify: false }
            ).populate('participants')
        })
};

const get = (id) => {
    return Race
        .findById(id)
        .populate('participants')
        .lean()
        .exec();
};

const getAllByUser = (userId) => {
    return Race.find({ createdBy: userId }).lean().exec();
};

module.exports = {
    get,
    create,
    join,
    getAllByUser
};
