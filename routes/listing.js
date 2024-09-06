const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

//Index Route
router.get(
    "/", 
    wrapAsync(async (req, res) => {
        const allListings = await Listing.find({});
        res.render("listings/index.ejs", {allListings});
}));

//New Route
router.get("/new", isLoggedIn, (req, res)=> {
    res.render("listings/new.ejs");
});

//show route
router.get(
    "/:id", 
    wrapAsync( async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })   
        .populate("owner");
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
        console.log(listing);
        res.render("listings/show.ejs", { listing });
    })
);

//Create Route
router.post(
    "/" ,
    isLoggedIn,
    validateListing,
    wrapAsync (async(req, res, next) => {
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;//represent owner id
        await newListing.save();
        req.flash("success", "New Listing Created");
        res.redirect("/listings");
    })  
);
// app.use((req, res, next) => {
//     res.locals.currUser = req.user; // Ensure current user is accessible in all views
//     next();
// });

//Edit Route
router.get(
    "/:id/edit",
    isLoggedIn,
    isOwner, 
    wrapAsync (async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", { listing });
    })
);

//Update Route
router.put(
    "/:id", 
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(async (req, res) => {
        let { id } = req.params;
        await Listing.findByIdAndUpdate(id, { ...req.body.listing });
        req.flash("success", "Listing Updated");
        res.redirect(`/listings/${id}`);
    })
);

//Delete Route
router.delete(
    "/:id", 
    isLoggedIn,
    isOwner,
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