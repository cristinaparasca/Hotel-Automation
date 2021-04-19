module.exports=app=>{
    const rooms=require("../controllers/room.controller.js")
    const auth=require("../controllers/auth.controller")
    const router=require('express').Router();
    const utils=require('../utils/validator.utils')
    const upload=require('../utils/uploadImage.utils')
    
    router.post("/create",rooms.validationRules('create'),utils.validate,upload.array('photos',10),rooms.create)
    router.get("/get",auth.authenticatedAdmin,rooms.findAll)
    router.get("/:type/get",auth.authenticatedAdmin,rooms.findByType)
    router.put("/:id/update",auth.authenticatedAdmin,rooms.validationRules('update'),utils.validate,upload.array('photos',10),rooms.update)
    router.delete("/:id/delete",auth.authenticatedAdmin, rooms.delete)
    
    app.use("/api/room",router);
}