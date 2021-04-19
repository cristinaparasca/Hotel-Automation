const {validationResult} = require('express-validator');
const fs = require('fs');
exports.validate = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        const extractedErrors = []
  errors.array({ onlyFirstError: true }).map(err => extractedErrors.push({ [err.param]: err.msg }));
        //const err = errors.array().map(object => {return  {msg: `${object.param}: ${object.msg}`}});
        res.status(422).json({ errors: extractedErrors});
        return;
    }
    next();
    return;
};