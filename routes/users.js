const crypto = require('crypto');
const secret = 'hjkl';

module.exports = function(app){

  var express = require('express');
  var db = require('../models/user');
  var router = express.Router();
  
  /* GET users listing. */
  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });
  

  
  
  loginUser = function(req, res){
    console.log('usuario logeandose' + req.body.user);
    db.find({usuario: req.body.user, pass: crypto.createHmac('sha256', secret).update(req.body.pass).digest('hex') }); },function(err, objectDB){
      if(!err) {
        res.json({success: true, user: objectDB }); 
        res.json({success: true, pass: objectDB }); 
      }
      else {
        res.json({success: false, pass: objectDB });
        console.log('error al buscar el usuario');
      }
    };
  

  app.post('/userl', loginUser);
}
