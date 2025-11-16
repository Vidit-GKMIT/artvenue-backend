export const authorizeRole = (role) => {
  return (req, res, next) => {
     if(!req.user){
      return res.status(401).json({ message: "Unauthorized. Please login again.", success: false });
     }

     console.log(req.user)
     console.log(role)

     if(req.user.role !== role){
      return res.status(403).json({ message: "Sorry you are not authorised to access this resource.", success: false });
     }
     console.log(req.user.role);
     next();
  }
}