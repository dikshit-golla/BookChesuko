const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listingController.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({storage}); 




//New Route 
router.get("/new", isLoggedIn, listingController.renderNewForm);


//Edit Route 
router.get("/:id/edit",isLoggedIn,listingController.editListing);


router.route("/").get(listingController.index)
.post(isLoggedIn,upload.single('listing[image]'),validateListing,listingController.createListing);

//Show Route
router.route("/:id")
        .get(listingController.showListing)
        .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,listingController.updateListing)
        .delete(isOwner,isLoggedIn,listingController.destroyListing);



module.exports = router;
