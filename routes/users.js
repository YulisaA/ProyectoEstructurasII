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
    db.find({usuario: req.body.user},function(err, objectDB){
      if(!err) res.json({success: true, user: objectDB }); 
      else console.log('error al buscar el usuario');
    });
  }

  app.post('/userl', loginUser);
}
