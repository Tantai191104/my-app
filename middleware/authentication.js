function isLoggedIn(req, res, next) {
  if (!req.session.user) {
    req.session.message = {
      type: "warning",
      text: "You must be logged in to access this page.",
    };
    return res.redirect("/api/auth/login");
  }
  next();
}

function wasLoggedIn(req, res, next) {
  if (req.session.user) {
    return res.redirect("/");
  }
  next();
}

function isAdmin(req, res, next) {
  if (!req.session.user) {
    req.session.message = {
      type: "warning",
      text: "You must be logged in to access this page.",
    };
    return res.redirect("/api/auth/login");
  }

  if (!req.session.user.isAdmin) {
    req.session.message = {
      type: "warning",
      text: "You don't have permission to access this page.",
    };
    return res.redirect("/");
  }
  next();
}

module.exports = { isLoggedIn, wasLoggedIn, isAdmin };
