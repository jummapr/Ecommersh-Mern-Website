
//! create token and saving token in cookie
const sendToken = async(user, statusCode,message, res) => {
    const token = await user.generateToken();

    //! option for Cookie
    const options = {
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly: true,
    }

    res.status(statusCode).cookie('token', token, options).json({
        success: true,
        message: message,
    })
}


export default sendToken;