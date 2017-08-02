var express = require("express");
var router =express.Router();
var Lodge = require("../models/lodges");
var middleware =require("../middleware");
var geocoder = require("geocoder");


router.get("/lodges",function(req,res){
    Lodge.find({},function(err,allLodges){
        if(err){
            console.log(err);
        }else{
            res.render("lodges/index",{lodges:allLodges,page:'lodges'})
        }
    })
})

router.post("/lodges",middleware.isLoggedIn,function(req,res){
    var name= req.body.name;
    var price = req.body.price;
    var image = req.body.image; 
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location,function(err,data){
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newLodge = {name: name, price: price, image:image,description:description, author: author, location: location, lat: lat, lng: lng};
    Lodge.create(newLodge,function(err,newlyCreated){
        if(err){
            console.log(err);
        }else{
            res.redirect("/lodges");
            }
        });
    });
});

router.get("/lodges/new",middleware.isLoggedIn,function(req, res){
   res.render("lodges/new.ejs"); 
});

router.get("/lodges/:id",function(req, res) {
    Lodge.findById(req.params.id).populate("comments").exec(function(err,foundLodge){
        if(err){
            console.log(err);
        }else{
            res.render("lodges/show",{lodge: foundLodge});
            console.log(foundLodge.location)
        }
    })
})

router.get("/lodges/:id/edit",middleware.checkLodgeOwner,function(req, res) {
    Lodge.findById(req.params.id, function(err,foundLodge) {
        
            res.render("lodges/edit",{lodge : foundLodge})
        
    })
})

router.put("/lodges/:id",middleware.checkLodgeOwner,function(req,res){
    geocoder.geocode(req.body.location, function (err, data) {
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.name, image: req.body.image, description: req.lodge.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
    Lodge.findByIdAndUpdate(req.params.id, {$set: newData}, function(err,updatedLodge){
        if(err){
            req.flash("error",err.message);
            res.redirect("/lodges");
        }else{
            req.flash("success","Successfully Updated!");
            res.redirect("/lodges/" + req.params.id);
            }
        });
    });
});

router.delete("/lodges/:id",middleware.checkLodgeOwner,function(req,res){
    Lodge.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/lodges");
        }else{
            res.redirect("/lodges");
        }
    })
})





module.exports = router;