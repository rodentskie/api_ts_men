import { Schema, model } from 'mongoose';

const HobbySchema = new Schema({
    name: String
});

const Hobby = model('Hobby', HobbySchema);

export default Hobby;
