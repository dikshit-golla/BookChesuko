const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isReviewAuthor,validateReview} = require("../middleware.js");
const reviewController = require("../controllers/reviewController.js");




router.post("/",isLoggedIn,validateReview,reviewController.createReview);

//delete review route 
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,reviewController.destroyReview);

 module.exports = router;
