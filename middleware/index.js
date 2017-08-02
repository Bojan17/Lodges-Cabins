var Lodge = require("../models/lodges");
var Comment = require("../models/comments");

var middlewareObj= {};

middlewareObj.checkLodgeOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Lodge.findById(req.params.id,function(err,foundLodge){
            if(err){
                req.flash("error","Lodge not found");
                res.redirect("back");
            }else{
                if(foundLodge.author.id.equals(req.user._id) || req.user.isAdmin){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back")
                }
            }
        })
    }else{
        req.flash("error","You need to be logged in to do that");
        res.redirect("back")
    }
}

middlewareObj.checkCommentOwner = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back")
            }else{
                if(foundComment.author.id.equals(req.user._id) ||  req.user.isAdmin){
                    next();
                }else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back")
                }
            }
        })
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back")
    }
}

 middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that");
    res.redirect("/login");
}

module.exports = middlewareObj;