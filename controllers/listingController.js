const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");

module.exports.index = wrapAsync(async (req,res)=>{
    const allLs = await Listing.find({});
    res.render("listings/index.ejs",{allLs});   
});

module.exports.renderNewForm = (req,res)=>{
    
    res.render("listings/new.ejs");
};

module.exports.editListing = wrapAsync(async (req,res)=>{
    let {id} = req.params;

    let listing = null;
     listing = await Listing.findById(id);

     if(!listing){
        req.flash("error","Listing you requested for edit does not exist!!");
        res.redirect("listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl  = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing, originalImageUrl});
});

module.exports.showListing = wrapAsync(async (req,res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews",populate:{path:"author"},}).populate("owner");
    if(!listing){
        req.flash("error","Listing you requested does not exist!!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
});

module.exports.createListing = wrapAsync(async (req,res)=>{

        let url = req.file.path;
        let filename = req.file.filename;
    
         const newLS = new Listing(req.body.listing);
         newLS.owner = req.user._id;
         newLS.image = {url,filename};
        await newLS.save();

            req.flash("success","New Listing Created!!");
        res.redirect("/listings");

});

module.exports.updateListing = wrapAsync(async (req,res)=>{
     let {id} = req.params;
   let listing =  await Listing.findByIdAndUpdate(id,{...req.body.listing});
        if(typeof req.file !== undefined){
           let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url, filename};
        await listing.save();
        }
    req.flash("success","Listing Updated!!");
     res.redirect(`/listings/${id}`);
});

module.exports.destroyListing = wrapAsync(async (req,res)=>{
    let {id} = req.params;
    let deleteLs = await Listing.findByIdAndDelete(id);
    console.log(deleteLs);
    req.flash("success"," Listing Deleted!!");
    res.redirect("/listings");
});


