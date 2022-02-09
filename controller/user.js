const db = require('../models')

exports.getUser = async obj => {
    return await db.User.findOne({
        where: obj,
    });
};

exports.createUser = async (email, password, name, mobile, country) => {
    await db.User.create({email, password, name, mobile, country});
};


