const adminAuth = (req, res, next) => {
  const token = "xyz";
  const isAdminAuth = token === "xyz";
  if (!isAdminAuth) {
    res.status(401).send("Unauth req");
  } else {
    next();
  }
};

const userAuth = (req, res, next) => {
  const token = "xayz";
  const isAdminAuth = token === "xyz";
  if (!isAdminAuth) {
    res.status(401).send("Unauth req");
  } else {
    next();
  }
};

module.exports = {
  adminAuth,
  userAuth,
};
