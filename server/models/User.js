import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    refresh_token: {
        type: String,
        required: false
    }
})

// fire a function before doc saved to db (to create a hash password before saving to the db)
userSchema.pre('save', async function (next){
    // Only hash the password if it's new or has been modified
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.set("toJSON", {
    transform: (doc, ret) => {
      delete ret.password;
      delete ret.refresh_token;
      return ret;
    }
});

export default mongoose.model("User", userSchema);
