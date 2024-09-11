import { catchError } from "../../middleware/catchError.js";
import { User } from "../../model/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AppError } from "../../utilities/appError.js";

// signUp new user
const signUp = catchError(async (req, res, next) => {
  let user = new User(req.body);
  await user.save();
  let token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_KEY
  );
  res.json({ message: "success", token });
});

// signIn user
const signIn = catchError(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });
  if (user && bcrypt.compareSync(req.body.password, user.password)) {
    let token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY
    );
    return res.json({ message: "success", token });
  }
  next(new AppError("incorrect email or password", 401));
});

// change user password
const changeUserPassword = catchError(async (req, res, next) => {
  let user = await User.findOne({ email: req.body.email });

  if (user && bcrypt.compareSync(req.body.oldPassword, user.password)) {
    await User.findOneAndUpdate(
      { email: req.body.email },
      { password: req.body.newPassword, passwordChangedAt: Date.now() }
    );
    let token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_KEY
    );
    return res.json({ message: "success", token });
  }
  next(new AppError("incorrect email or password", 401));
});

// protected routes(authentication)
const protectedRoutes = catchError(async (req, res, next) => {
  let { token } = req.headers;
  let userPayload = null;

  if (!token) return next(new AppError("token not provided", 401));
  jwt.verify(token, process.env.JWT_KEY, (err, payload) => {
    if (err) return next(new AppError(err, 401));
    userPayload = payload;
  });

  let user = await User.findById(userPayload.userId);
  if (!user) return next(new AppError("user not found", 401));
  if (user.passwordChangedAt) {
    let time = parseInt(user.passwordChangedAt.getTime() / 1000);
    if (time > userPayload.iat)
      return next(new AppError("invalid token......login again", 401));
  }

  req.user = user;
  next();
});

// allowed to(authorization)
const allowedTo = (...roles) => {
  return catchError(async (req, res, next) => {
    if (roles.includes(req.user.role)) {
      next();
    } else {
      return next(
        new AppError("you are not authorized to access this endpoint", 401)
      );
    }
  });
};

export { signUp, signIn, changeUserPassword, protectedRoutes, allowedTo };
