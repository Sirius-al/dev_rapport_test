const User = require('../Models/UsersModel');

exports.auth = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password')

        if (!user) {
            res.status(400).json({
                success: true,
                message: `No User Found! Please Try again..`
            })
          
        }

        res.status(200).json({
            success: true,
            data: {
                user
            }
        })
        
    } catch (err) {
        // console.log(err)
        res.status(500).send("Server Error!!!")
        
    }
}