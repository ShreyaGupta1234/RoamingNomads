const Listing = require("./models/listing.js");
const Review = require("./models/review.js"); 
const expressError = require("./utils/expressError.js");
const { listingSchema,reviewSchema } = require("./schema.js");

module.exports.isLoggedIn = (req, res, next) => {
  // console.log(req.path, "..", req.originalUrl);
  if(!req.isAuthenticated()){
      req.session.redirectUrl = req.originalUrl;//changed
      req.flash("error", "you must be logged in to create listing");
      return res.redirect("/login");
  }
  next();
};


//changed
module.exports.saveRedirectUrl = (req, res, next) => {
  if(req.session.redirectUrl) {
      res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isOwner = async (req, res, next) => {
  try {
      let { id } = req.params;
      let listing = await Listing.findById(id);
      if (!listing.owner._id.equals(res.locals.currUser._id)) {
          req.flash("error", "You are not the owner of this listing");
          return res.redirect(`/listings/${id}`);
      }
      next();
  } catch (err) {
      next(err); // Pass the error to the global error handler
  }
};

module.exports.validateListing = (req, res, next) => {
  try {
    let {error} = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else 
      next();
  } catch (error) {
      next(err);
  }
};

module.exports.validateReview = (req, res, next) => {
  try {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new expressError(400, errMsg);
    } else
      next();
  } catch (error) {
      next(err);
  }
};

module.exports.isReviewAuthor = async(req, res, next) => {
  try {
    let { reviewId, id } = req.params;
    let listing = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)) {
        req.flash("error", "You did not create this review");
        return res.redirect(`/listings/${id}`);
    }
    next();
  } catch (error) {
      next(err);
  }
};


