var express = require('express');
var router = express.Router();
var multer = require('multer');
var path = require('path');
var edge = require('edge');
var logout = require('express-passport-logout');  

var CompressWithDll = edge.func({
    assemblyFile: "dlls/Lab1-Compresion-de-Datos.dll",
    typeName: "Lab1_Compresion_de_Datos.Utilities.Compress",
    methodName: "CompressForP"
});
var DecompressWithDll = edge.func({
    assemblyFile: "dlls/Lab1-Compresion-de-Datos.dll",
    typeName: "Lab1_Compresion_de_Datos.Utilities.Compress",
    methodName: "DecompressForP"
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log("is here");
  res.status(200).end();
});

router.get('/logout', function(req, res, next) {
    console.log("cerrando sesion....");
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
    localStorage.clear();
    res.render('login');
    res.status(200).end();
});

router.get('/cerrar', function(req, res, next) {
    res.render('login');
});

router.get('/download/:id', function(req, res, next) {
    var file = 'uploads/'+req.params.id;
    console.log("test");
    console.log(req.params.id);
    if(req.params.id)
    {
        path = req.params.id;
        desc();
        res.download(file, function(err){
            if(err) console.log('ERROR: '+err);
            else console.log('Archivo descargado!');

            comp();
        });
    }
});

router.get('/downloadFile:id', function(req, res, next) {
    console.log('descargado');
    var pathFile = path.join(__dirname,'..','/uploads/',req.params.id);
    console.log("path"+pathFile);
    res.download(pathFile, function(err){
        if(err) console.log('ERROR: '+err);
        else console.log('Archivo descargado');
    });
    res.status(200).end();
});


router.post('/upload', function(req, res, next) {
	var upload = multer({
        storage: storage
    }).single('fileName');

    upload(req, res, function(err) {
        res.end('File is uploaded')
        console.log("test");
        path =req.file.originalname;
        console.log("end");
        comp();
    });
});

router.post('/logout', function(req, res, next) {
    console.log("cerando sesion....");
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
    localStorage.clear();
    res.render('login', { title: 'Express' });
    res.status(401).end();
});

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads')
    }, filename: function (req, file, callback) {
        console.log(file)
        callback(null, file.originalname)
    }
});
var path = "Empty"; 
function comp (){
    console.log("  DLL>>>>")
    console.log("  File name => "+path);
    CompressWithDll( "./uploads/" + path, function (error, result) {
        if(error) console.log(error);
        console.log("  compress result: ");
        console.log(result);
    });
    console.log("  END");
}
function desc(){
    console.log("  DLL>>>>")
    console.log("  File name => "+ "./uploads/" + path +".rlex");
    DecompressWithDll( "./uploads/" + path +".rlex", function (error, result) {
        if(error) console.log(error);
        console.log("  decompress result: ");
        console.log(result);
    });
    console.log("  END");
}
 var upload = multer({ storage: storage });//nop
 
/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log("is here");
    res.status(200).end();
  });

module.exports = router;