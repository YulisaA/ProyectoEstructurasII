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
        console.log('se encontro el usuario');
        res.json({success: true, user: objectDB });
      }
      else {
        console.log('error al buscar el usuario');
        res.json({success: false, user: objectDB });
      }
    };
  

  app.post('/userl', loginUser);
}
