import { Schema, model } from 'mongoose';

const PeopleSchema = new Schema({
    firstName: String,
    lastName: String,
    age: Number,
    hobbies: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Hobby'
        }
    ]
});

const People = model('People', PeopleSchema);

export default People;
