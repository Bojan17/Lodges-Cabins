var mongoose = require("mongoose");

var lodgeSchema = new mongoose.Schema({
    name: String,
    price: String,
    location: String,
    lat: Number,
    lng: Number,
    image: String,
    description: String,
    createdAt:{
        type: Date,
        default: Date.now        
    },
    author : {
        id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username : String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
})

module.exports= mongoose.model("Lodge",lodgeSchema);