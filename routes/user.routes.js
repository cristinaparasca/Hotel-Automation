module.exports=app=>{
    const users = require("../controllers/user.controller.js");
    const auth=require("../controllers/auth.controller")
    const utils=require("../utils/validator.utils.js")
    const router=require('express').Router();
    const upload=require('../utils/uploadImage.utils')
    //auth.authenticated,
    router.post('/login',auth.login) //oricine
    router.post('/create',users.validationRules('create'),utils.validate,upload.single('profile_photo'),users.create);
    router.get('/getUser',auth.authenticated,users.getUser) //oricine
    router.get('/get',auth.authenticatedAdmin,users.findAll); //admin
    router.get('/:roleId/get',auth.authenticatedAdmin,users.findByRole) //admin
    router.put('/:id/update',auth.authenticatedAdmin,users.validationRules('update'),utils.validate,users.update) //admin
    router.put('/updateProfile',auth.authenticated,users.validationRules('update'),upload.single('profile_photo'),users.updateProfile) //oricine
    router.post('/:roleId/mail',auth.authenticatedAdmin,users.sendMail)
    router.delete('/:id/delete',auth.authenticatedAdmin,users.delete) //admin
    app.use('/api/user',router);
}