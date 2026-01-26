module.exports = {
    isLoggedIn: (req, res, next) => {
        // console.log("🚀 ~ req.isAuthenticated:", req.isAuthenticated())
        // if(req.isAuthenticated()){
        //     next();
        // } else {
        //     res.redirect("/admin/login");
        // }
        next();
    }
}