import mongoose from 'mongoose';
const raceSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    dateSpan: {
        from: { type: String },
        to: { type: String }
    },
    segment: mongoose.Mixed,
    createdBy: { type: Number },
    participants: [{ type : mongoose.Types.ObjectId, ref: 'participant' }]
}, { collection: 'race' });

const Race = mongoose.model('race', raceSchema);
export default Race;