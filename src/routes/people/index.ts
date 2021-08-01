import express from 'express';
import conn from '../../data/index';
import People from '../../models/People';

const router = express.Router();

// get all
router.get('/', async (req, res) => {
    // connect to db
    const db = await conn();

    const data = await new Promise((resolve, reject) => {
        People.find((err, docs) => {
            if (err) {
                reject(err);
                return res.status(400).send(err);
            }
            db.connection.close(); // close connection
            resolve(docs);
        });
    });
    return res.status(200).send(data);
});

// get all with hobby
router.get('/with-hobby/:id', async (req, res) => {
    const { id } = req.params; // get id from params

    // connect to db
    const db = await conn();
    // init model

    const data = await new Promise((resolve, reject) => {
        People.findOne({ _id: id }, (err: any, data: any) => {
            if (err) {
                reject(err);
                return res.status(400).send(err);
            }
            db.connection.close(); // close connection
            resolve(data);
        }).populate('hobbies');
    });
    return res.status(200).send(data);
});

// get one
router.get('/:id', async (req, res) => {
    const { id } = req.params; // get id from params
    // connect to db
    const db = await conn();

    const data = await new Promise((resolve, reject) => {
        People.findById(id, (err: any, docs: any) => {
            if (err) {
                reject(err);
                return res.status(400).send(err);
            }
            db.connection.close(); // close connection
            resolve(docs);
        });
    });
    return res.status(200).send(data);
});

// insert people only
router.post('/', async (req, res) => {
    const { firstName, lastName, age } = req.body;
    if (!firstName) return res.status(400).send(`Please enter first name.`);
    if (!lastName) return res.status(400).send(`Please enter last name.`);
    if (!age || age <= 0) return res.status(400).send(`Please a valid age.`);

    // connect to db
    const db = await conn();
    // object to insert
    const people = { firstName, lastName, age };

    // init model
    const s = new People(people);

    // save to db
    const result: any = await new Promise((resolve, reject) => {
        s.save((err: any, data: any) => {
            if (err) {
                reject(err);
                return res.status(400).send(err);
            }
            db.connection.close(); // close connection
            resolve(data);
        });
    });
    return res.status(201).send(`People inserted successfully with ID: ${result._id}`);
});

// update
router.patch('/:id', async (req, res) => {
    const { id } = req.params; // get id from params

    const { firstName, lastName, age } = req.body;
    if (!firstName) return res.status(400).send(`Please enter first name.`);
    if (!lastName) return res.status(400).send(`Please enter last name.`);
    if (!age || age <= 0) return res.status(400).send(`Please a valid age.`);

    // connect to db
    const db = await conn();
    // object to insert
    const people = { firstName, lastName, age };

    // save to db
    const result: any = await new Promise((resolve, reject) => {
        People.findByIdAndUpdate(
            id,
            people,
            {
                new: true
            },
            (err: any, data: any) => {
                if (err) {
                    reject(err);
                    return res.status(400).send(err);
                }
                db.connection.close(); // close connection
                resolve(data);
            }
        );
    });
    return res.sendStatus(204);
});

// patch hobby to person
router.patch('/hobby/:id', async (req, res) => {
    const { id } = req.params; // get id from params

    const { hobbies } = req.body; // hobbies of person
    if (hobbies.length == 0) return res.status(400).send(`Please enter hobbies.`);

    // connect to db
    const db = await conn();

    // save to db
    const result: any = await new Promise((resolve, reject) => {
        People.findOneAndUpdate({ _id: id }, { hobbies: hobbies }, { new: true }, (err: any, data: any) => {
            if (err) {
                reject(err);
                return res.status(400).send(err);
            }
            db.connection.close(); // close connection
            resolve(data);
        });
    });
    return res.sendStatus(204);
});

// delete
router.delete('/:id', async (req, res) => {
    const { id } = req.params; // get id from params

    // connect to db
    const db = await conn();

    // save to db
    const result: any = await new Promise((resolve, reject) => {
        People.findByIdAndRemove(id, {}, (err: any, data: any) => {
            if (err) {
                reject(err);
                return res.status(400).send(err);
            }
            db.connection.close(); // close connection
            resolve(data);
        });
    });
    // if result is null means no data was deleted
    if (!result) return res.status(400).send(`No data was deleted.`);
    return res.sendStatus(204);
});

export = router;
