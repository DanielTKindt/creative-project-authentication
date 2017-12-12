var crypto = require('crypto');
var mongoose = require('mongoose'),
    User = mongoose.model('User');
function hashPW(pwd){
    return crypto.createHash('sha256').update(pwd).
    digest('base64').toString();
}
exports.signup = function(req, res){
    console.log("Begin exports.signup");
    var user = new User({username:req.body.username});
    console.log("after new user exports.signup");
    user.set('hashed_password', hashPW(req.body.password));
    console.log("after hashing user exports.signup");
    user.set('email', req.body.email);
    console.log("after email user exports.signup");
    user.save(function(err) {
        console.log("In exports.signup");
        console.log(err);
        if (err){
            res.session.error = err;
            res.redirect('/signup');
        } else {
            req.session.user = user.id;
            req.session.username = user.username;
            req.session.msg = 'Authenticated as ' + user.username;
            res.redirect('/');
        }
    });
};
exports.login = function(req, res){
    User.findOne({ username: req.body.username })
        .exec(function(err, user) {
            if (!user){
                err = 'User Not Found.';
            } else if (user.hashed_password ===
                hashPW(req.body.password.toString())) {
                req.session.regenerate(function(){
                    console.log("login");
                    console.log(user);
                    req.session.user = user.id;
                    req.session.username = user.username;
                    req.session.msg = 'Authenticated as ' + user.username;
                    req.session.color = user.color;
                    res.redirect('/');
                });
            }else{
                err = 'Authentication failed.';
            }
            if(err){
                req.session.regenerate(function(){
                    req.session.msg = err;
                    res.redirect('/login');
                });
            }
        });
};
exports.getUserProfile = function(req, res) {
    User.findOne({ _id: req.session.user })
        .exec(function(err, user) {
            if (!user){
                res.json(404, {err: 'User Not Found.'});
            } else {
                res.json(user);
            }
        });
};
exports.updateUser = function(req, res){
    User.findOne({ _id: req.session.user })
        .exec(function(err, user) {
            user.set('email', req.body.email);
            user.save(function(err) {
                if (err){
                    res.sessor.error = err;
                } else {
                    req.session.msg = 'User Updated.';
                }
                res.redirect('/user');
            });
        });
};
exports.addUserContact = function (req, res) {
    User.findOne({ _id: req.session.user })
        .exec(function (err, user) {
            user.contacts.push({
                name: req.body.contact_name,
                phone_number: req.body.contact_phone
            });
            user.save(function (err) {
                var alert = {};
                if (err){
                    alert["msg"] = err;
                    alert["type"] = "alert alert-danger alert-dismissable fade in";
                } else {
                    alert["msg"] = "Contact added to User.";
                    alert["type"] = "alert alert-info alert-dismissable fade in";
                }
                req.session.alert = alert;
                res.redirect('/user');
            })
        })
};
exports.updateUserContact = function (req, res) {
    // first find the User for the session.
    User.findOne({ _id: req.session.user })
        .exec(function (err, user) {
            // find the correct contact in the
            // contacts array belonging to this
            // user.
        })
};
exports.deleteUserContact = function (req, res) {
    User.findOne({ _id: req.session.user })
        .exec(function (err, user) {
            var c = user.contacts.id(req.body.contact_id);
            c.remove();
            user.save(function (err) {
                var alert = {};
                if (err) {
                    alert["msg"] = err;
                    alert["type"] = "alert alert-danger alert-dismissable fade in";
                } else {
                    alert["msg"] = "Contact deleted from User contacts.";
                    alert["type"] = "alert alert-info alert-dismissable fade in";
                }
                req.session.alert = alert;
                res.redirect('/user');
            })
        })
};
exports.deleteUser = function(req, res){
    User.findOne({ _id: req.session.user })
        .exec(function(err, user) {
            if(user){
                user.remove(function(err){
                    if (err){
                        req.session.msg = err;
                    }
                    req.session.destroy(function(){
                        res.redirect('/login');
                    });
                });
            } else{
                req.session.msg = "User Not Found!";
                req.session.destroy(function(){
                    res.redirect('/login');
                });
            }
        });
};