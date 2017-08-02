var express = require("express");
var router  = express.Router({mergeParams: true});
var Lodge = require("../models/lodges");
var Comment = require("../models/comments");
var middleware = require("../middleware");

router.get("/lodges/:id/comments/new",middleware.isLoggedIn,function(req,res){
    Lodge.findById(req.params.id,function(err,lodge){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new",{lodge:lodge});
        }
    })
});

router.post("/lodges/:id/comments",middleware.isLoggedIn,function(req,res){
    Lodge.findById(req.params.id, function(err, lodge) {
        if(err){
            console.log(err);
        }else{
            Comment.create(req.body.comment,function(err,comment){
                if(err){
                    console.log(err)
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    lodge.comments.push(comment);
                    lodge.save();
                    res.redirect("/lodges/" + lodge._id);
                    
                }
            })
        }
    })
})

router.get("/lodges/:id/comments/:comment_id/edit",middleware.checkCommentOwner,function(req,res){
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {lodge_id: req.params.id, comment: foundComment});
        }
    })
})

router.put("/lodges/:id/comments/:comment_id",middleware.checkCommentOwner,function(req,res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment,function(err,updatedComment){
        if(err){
            console.log(err)
        }else{
            res.redirect("/lodges/" + req.params.id)
        }
    })
})

router.delete("/lodges/:id/comments/:comment_id",middleware.checkCommentOwner,function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back")
        }else{
            res.redirect("/lodges/" + req.params.id)
        }
    })
})


module.exports = router;

