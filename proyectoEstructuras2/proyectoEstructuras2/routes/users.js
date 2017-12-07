const crypto = require('crypto');
const secret = 'proyecto';

module.exports = function(app){

  var express = require('express');
  var db = require('../models/usuarios');
  var router = express.Router();
  
  /* GET users listing. */
  router.get('/', function(req, res, next) {
    res.send('respond with a resource');
  });
  
  loginUser = function(req, res){
    let pass = crypto.createHmac('sha256', secret).update(req.body.pass).digest('hex');
    
    db.find({userName: req.body.user },function(err, objectDB){
      if(!err) {
        if(objectDB[0].userName === req.body.user && objectDB[0].password === pass){
          res.render('chat');
        }else{
          res.json({success: false, user: objectDB });
        }
      }
      else {
        console.log('error al buscar el usuario');
      }
    });
  }

  app.post('/userl', loginUser);
}