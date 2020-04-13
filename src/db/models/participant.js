import mongoose from 'mongoose';
const participantSchema = new mongoose.Schema({
    name: { type: String },
    externalId: {type: Number, unique : true, required : true}
}, { collection: 'participant' });

const Participant = mongoose.model('participant', participantSchema);
export default Participant;