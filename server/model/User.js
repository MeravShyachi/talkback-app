import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


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
    },
    isConnected: {
        type: Boolean,
        default: false
    }
})

// fire a function before doc saved to db (to create a hash password before saving to the db)
schema.pre('save', async function (next){
    // Only hash the password if it's new or has been modified
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

schema.set("toJSON", {
    transform: (doc, ret) => {
      delete ret.password;
      return ret;
    }
});

export default mongoose.model("User", schema)
