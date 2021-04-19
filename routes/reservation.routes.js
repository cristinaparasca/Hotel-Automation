module.exports=app=>{
    const reservation=require("../controllers/reservation.controller");
    const auth=require("../controllers/auth.controller")
    const router=require('express').Router();
    const utils=require("../utils/validator.utils.js")

    router.post('/create',auth.authenticated,reservation.validationRules('create'),utils.validate,reservation.create);
    router.get('/:check_in_date/:check_out_date/available',reservation.validationRules('available'),utils.validate,reservation.findRoomsAvailable)
    router.get('/get',auth.authenticatedAdmin,reservation.findAll) //Admin
    //delete a reservation by id
    router.delete('/:id/delete',auth.authenticatedAdmin,reservation.delete) //Admin
    //delete a reservation by roomId Guest
    router.delete('/:id/deleteMy',auth.authenticated,reservation.deleteMy) //IdToken <checkIn
    router.get("/getMyReservations",auth.authenticated,reservation.findByUser) //Token
    router.put("/:id/checkIn",auth.authenticated,reservation.checkIn)
    router.put("/:id/checkOut",auth.authenticated,reservation.checkOut)
    app.use('/api/reservation',router)
}