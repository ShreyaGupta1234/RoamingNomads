const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const {listingSchema} = require("../schema.js");
const expressError = require("../utils/expressError");
const Listing = require("../models/listing.js");

const validateListing =(req, res , next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
};

//Index Route
router.get(
    "/", 
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", {allListings});
}));

//New Route
router.get(
    "/new", (req, res)=> {
        res.render("listings/new.ejs");
});

//show route
router.get("/:id", 
    wrapAsync( async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

//Create Route
router.post("/" ,
    wrapAsync (async(req, res, next) => {
        // let result = listingSchema.validate(req.body);
        // consosle.log(result);
        // if(result.error) {
        //     throw new expressError(400, result.err);
        // }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    })  
);

//Edit Route
router.get("/:id/edit", 
    wrapAsync (async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", { listing });
    })
);

//Update Route
router.put(
    "/:id", 
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, {...req.body.listing });
        res.redirect(`/listings/${id}`);
    })
);

//Delete Route
router.delete(
    "/:id", 
    wrapAsync( async (req, res) => {
        let { id } = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        res.redirect("/listings");
    })
);

const validateReview =(req, res , next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else {
        next();
    }
};
module.exports = router;