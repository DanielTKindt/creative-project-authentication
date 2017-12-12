var express = require('express');
var router = express.Router();
var expressSession = require('express-session');

var users = require('../controllers/users_controller');
console.log("before / Route");
router.get('/', function(req, res){
    console.log("/ Route");
//    console.log(req);
    console.log(req.session);
    if (req.session.user) {
        console.log("/ Route if user");
        res.render('index', {username: req.session.username,
            msg:req.session.msg,
            color:req.session.color});
    } else {
        console.log("/ Route else user");
        req.session.msg = 'Access denied!';
        res.redirect('/login');
    }
});
router.get('/user', function(req, res){
    console.log("/user Route");
    if (req.session.user) {
        var params = {msg: req.session.msg};
        if (req.session.alert) {
            params["alertMSG"] = req.session.alert.msg;
            params["alertType"] = req.session.alert.type;
        } else {
            params["alertMSG"] = "";
            params["alertType"] = "";
        }
        res.render('user', params);
        if (req.session.alert) {
            req.session.alert = {};
        }
    } else {
        req.session.msg = 'Access denied!';
        res.redirect('/login');
    }
});
router.get('/signup', function(req, res){
    console.log("/signup Route");
    if(req.session.user){
        res.redirect('/');
    }
    res.render('signup', {msg:req.session.msg});
});
router.get('/login',  function(req, res){
    console.log("/login Route");
    if(req.session.user){
        res.redirect('/');
    }
    res.render('login', {msg:req.session.msg});
});
router.get('/logout', function(req, res){
    console.log("/logout Route");
    req.session.destroy(function(){
        res.redirect('/login');
    });
});
router.post('/signup', users.signup);
router.post('/user/update', users.updateUser);
router.post('/user/contacts/add', users.addUserContact);
router.post('/user/contacts/delete', users.deleteUserContact);
router.post('/user/delete', users.deleteUser);
router.post('/login', users.login);
router.get('/user/profile', users.getUserProfile);


module.exports = router;