import express from 'express';
import conn from '../../data/index';
import Hobby from '../../models/Hobby';

const router = express.Router();

// get all
router.get('/', async (req, res) => {
    // connect to db
    const db = await conn();

    const data = await new Promise((resolve, reject) => {
        Hobby.find((err, docs) => {
            if (err) {
                reject(err);
                return res.status(404).send(err);
            }
            db.connection.close(); // close connection
            resolve(docs);
        });
    });
    return res.status(200).send(data);
});

// get one
router.get('/:id', async (req, res) => {
    const { id } = req.params; // get id from params
    // connect to db
    const db = await conn();

    const data = await new Promise((resolve, reject) => {
        Hobby.findById(id, (err: any, docs: any) => {
            if (err) {
                reject(err);
                return res.status(404).send(err);
            }
            db.connection.close(); // close connection
            resolve(docs);
        });
    });
    return res.status(200).send(data);
});

// insert people only
router.post('/', async (req, res) => {
    const { name } = req.body;
    if (!name) return res.status(404).send(`Please enter hobby name.`);

    // connect to db
    const db = await conn();
    // object to insert
    const hobby = { name };

    const s = new Hobby(hobby);

    // save to db
    const result: any = await new Promise((resolve, reject) => {
        s.save((err: any, data: any) => {
            if (err) {
                reject(err);
                return res.status(404).send(err);
            }
            db.connection.close(); // close connection
            resolve(data);
        });
    });
    return res.status(201).send(`Hobby inserted successfully with ID: ${result._id}`);
});

// update
router.patch('/:id', async (req, res) => {
    const { id } = req.params; // get id from params

    const { name } = req.body;
    if (!name) return res.status(404).send(`Please enter hobby name.`);

    // connect to db
    const db = await conn();
    // object to insert
    const hobby = { name };

    // save to db
    const result: any = await new Promise((resolve, reject) => {
        Hobby.findByIdAndUpdate(
            id,
            hobby,
            {
                new: true
            },
            (err: any, data: any) => {
                if (err) {
                    reject(err);
                    return res.status(404).send(err);
                }
                db.connection.close(); // close connection
                resolve(data);
            }
        );
    });
    return res.status(201).send(`Hobby updated successfully.`);
});

// delete
router.delete('/:id', async (req, res) => {
    const { id } = req.params; // get id from params

    // connect to db
    const db = await conn();

    // save to db
    const result: any = await new Promise((resolve, reject) => {
        Hobby.findByIdAndRemove(id, {}, (err: any, data: any) => {
            if (err) {
                reject(err);
                return res.status(404).send(err);
            }
            db.connection.close(); // close connection
            resolve(data);
        });
    });
    return res.status(201).send(`Hobby deleted successfully.`);
});

export = router;
