const express=require('express')
const session=require('express-session')
const bodyParser= require('body-parser')
const MongoStore=require('connect-mongo')(session)
const flash=require('connect-flash')
const app=express()
const fileUpload = require('express-fileupload')

let sessionOptions=session({
    secret:"Javascript is cool",
    store:new MongoStore({client:require('./db')}),
    resave: false,
    saveUnitialized:false,
    cookie:{maxAge:1000*60*60*24,httpOnly:true}
})
const router=require('./router')

app.use(sessionOptions)
app.use(flash())

app.use(function(req,res,next){
    if(req.session.user){req.visitorId=req.session.user._id} else{req.visitorId=0}
    res.locals.user= req.session.user
    next()
})
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use(fileUpload())
app.use(bodyParser.urlencoded({extended:true}))

app.use(express.static('public'))
app.set('views','views')
app.set('view engine','ejs')

app.use('/',router)


module.exports=app