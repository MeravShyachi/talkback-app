import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema(
  {
    content: {
      text: { type: String, required: true },
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
    }],
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Messages", MessageSchema);