const express=require('express')
const request = require('request')
const fs = require('fs')
const nodemailer = require('nodemailer')

const router= express.Router()
const userController=require('./Controllers/userControllers')
const postController=require('./controllers/postControllers')

router.get('/',userController.home)
router.get('/loginM',userController.home_guest)
router.get('/product',userController.products)
router.post('/register',userController.register)
router.post('/login',userController.login)
router.post('/logout',userController.logout)

router.get('/profile/:username',userController.ifUserExists,userController.profilePostsScreen)
//post related routes
router.get('/create-post',userController.mustBeLoggedIn,postController.viewCreateScreen)
router.get('/error',function(req,res){
    req.flash("errors","You must logged In to perform that activity")
        res.redirect('/loginM')
})
router.get('/api',function(req,res){
    res.render('api')
})
router.get('/hire',function(req,res){
    res.render('job')
})
router.post('/create-post',userController.mustBeLoggedIn,postController.create)
router.get('/post/:id',postController.viewSingle)
router.get('/post/:id/edit',postController.viewEditScreen)
router.get('/post/:id/edit',postController.edit)
router.post('/uploads', function(req, res) {
  if (!req.files || Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let sampleFile = req.files.samplefile;

// Use the mv() method to place the file somewhere on your server
sampleFile.mv('./upfiles/'+sampleFile.name+'.pdf', function(err) {
  if (err){
    return res.status(500).send(err);}
  res.render('job.ejs')
  })
})
router.post('/uploadfile', function(req, res) {
  if (!req.files || Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.samplefile;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./upfiles/'+sampleFile.name+'.pdf', function(err) {
    if (err)
      return res.status(500).send(err);

    var formData = {
      file: fs.createReadStream('./upfiles/'+sampleFile.name+'.pdf'),
      apikey: '12406e3a880ff167289409a8f8d1a694767e59d2e4610a9a515e424220c0b77e'
    };
    
    var options = {
      url: 'https://www.virustotal.com/vtapi/v2/file/scan',
      formData: formData
    };
    
    request.post(options, function(err, response, body) {
      var data=JSON.parse(body);
      res.redirect(data['permalink']);
      
    });

    
    
  });

})
router.post('/sendmail',function(req,res) {
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'wearewolfpack5@gmail.com',
        pass: 'wolfpack!@#'
      }
    });
  var name=req.body.name;
  var email=req.body.email;
  var cnum=req.body.cnum;
  var prob=req.body.prob;
    
  var mailOptions = {
      from: 'wearewolfpack5@gmail.com',
      to: 'wearewolfpack5@gmail.com',
      subject: 'Query from '+name,
      text: `Name:`+name+`Email:`+email+`Contact Number:`+cnum+`Problem:`+prob
  };
    
  transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
        res.render('home.ejs');
      }
  });  
  

})

module.exports=router