const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },    
    description : String,
    image: {
        type: String,
        default: "https://media.istockphoto.com/id/1162974788/photo/tropical-paradise-beach-sunset.jpg?s=2048x2048&w=is&k=20&c=oHka_pjXImcpowOfTriuN1DQWk3_XELZv8h8aJ5Za6g=",
        set: (v) => v === "" ? "https://media.istockphoto.com/id/1162974788/photo/tropical-paradise-beach-sunset.jpg?s=2048x2048&w=is&k=20&c=oHka_pjXImcpowOfTriuN1DQWk3_XELZv8h8aJ5Za6g=" : v,
    }, 
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
    owner :{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
});


listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing){
        await Review.deleteMany({reviews: {$in: listing.reviews}});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;