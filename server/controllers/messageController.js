import Messages from "../models/Message.js";

export const getAll = async(req, res) => {

    try{
        const {from, to} = req.body;

        const messages = await Messages.find({
            users: {
                $all: [from, to],
            },
        }).sort({updatedAt: 1});

        const projectedMessages = messages.map((msg) => {
            return {
              fromSelf: msg.sender.toString() === from._id,
              message: msg.content.text,
            };
        });

        res.status(200).json(projectedMessages);

    }catch(err){
        console.log("error during get all messages: ", err);
        res.status(500).json(err);
    }
}

export const addMessage = async(req, res) => {

    try{
        const {from, to, message} = req.body;
        console.log("req.body: ", req.body)
        const data = await Messages.create({
            content: {text: message},
            users: [from, to],
            sender: from,
        })

        if(data){
            res.status(200).json({msg: "Message added successfully."});
        }

    }catch(err){
        console.log("Failed to add message to the db.", err)
        res.status(500).json(err);
    }
}