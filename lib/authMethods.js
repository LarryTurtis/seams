exports.shouldDeny = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(500)
    res.send("Not authenticated");
};

exports.shouldAllow = function(req, res, next) {
    if (req.isAuthenticated()) {
        res.setHeader("Authorization", "admin");
    }
    return next();
};
