const mongodb=require('mongodb')
const dotenv=require('dotenv')
dotenv.config()
mongodb.connect(process.env.CONNECTIONSTRING,{useUnifiedTopology:true},function(err,client){
    module.exports=client
    const app=require('./app')
    app.listen(process.env.PORT)
})