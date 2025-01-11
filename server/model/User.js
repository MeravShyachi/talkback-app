const mongoose = require('mongoose');
const bcrypt = require('bcrypt')


const schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique : true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
})

// fire a function before doc saved to db (to create a hash password before saving to the db)
schema.pre('save', async function (next){
    this.password = await bcrypt.hash(this.password, 10)
    next();
});

module.exports = mongoose.model("User", schema)
