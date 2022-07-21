const httpStatus = require("http-status");
const { insert, list, loginUser, modify, remove } = require("../services/User");
const {
  passwordToHash,
  generateRefreshToken,
  generateAccessToken,
} = require("../scripts/utils/helper");
const projectService = require("../services/Projects");
const crypto = require("crypto");
const uuid = require("uuid");
const eventEmitter = require("../scripts/events/eventEmitter");
const path = require("path")
const CustomError = require("../errors/CustomError")

const create =  (req, res, next) => {
  req.body.password = passwordToHash(req.body.password);
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).json({
        success: true,
        message: "Added",
        data: response,
      });
    })
    .catch((error) => {
      next(CustomError(error.message))
    });
};

const index =  (req, res, next) => {
  list()
    .then((response) => {
      res.status(httpStatus.OK).json({
        success: true,
        message: "Listed",
        data: response,
      });
    })
    .catch((error) => {
      next(CustomError(error.message))
    });
};

const login =  (req, res, next) => {
  req.body.password = passwordToHash(req.body.password);
  loginUser(req.body)
    .then((user) => {
      if (!user) {
        return next(CustomError("Email or password is incorrect", httpStatus.BAD_REQUEST))
      }
      user = {
        ...user.toObject(),
        tokens: {
          accesToken: generateAccessToken(user),
          refreshToken: generateRefreshToken(user),
        },
      };
      delete user.password;
      res.status(httpStatus.OK).json({
        success: true,
        message: "Signed in",
        data: user,
      });
    })
    .catch((error) => {
      next(CustomError(error.message))
    });
};

const projectList = (req, res, next) => {
  projectService
    .list({ userId: req.user?._id })
    .then((projects) => {
      res.status(httpStatus.OK).json({
        success: true,
        message: "Listed",
        data: projects,
      });
    })
    .catch((error) => {
      next(CustomError(error.message))
    });
};

const resetPassword = (req, res, next) => {
  //const newPassword = uuid.v4()?.split("-")[0] || `usr-${new Data().getTime()}`
  const newPassword = crypto.randomBytes(4).toString("hex");
  modify(
    { email: req.body.email },
    { password: passwordToHash(newPassword) }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(CustomError("User not found", httpStatus.NOT_FOUND))
      }
      eventEmitter.emit("send_mail", {
        to: updatedUser.email,
        subject: "Password reset",
        html: `Your password has been reset upon your request.<br /> Do not forget to change your password after you login <br/> Your new password is ${newPassword}`,
      });
      res.status(httpStatus.OK).json({
        success: true,
        message: "Password has been reset. Please check your email.",
      });
    })
    .catch((error) => {
      next(CustomError(error.message))
    });
};

const update = (req, res, next) => {
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(CustomError("User not found", httpStatus.NOT_FOUND))
      }
      res.status(httpStatus.OK).json({
        success: true,
        message: "User updated",
        data: updatedUser,
      });
    })
    .catch((error) => {
      next(CustomError(error.message))
    });
};

const deleteUser = (req, res, next) => {
  if (!req.params?.id) {
    return next(CustomError("id missing", httpStatus.BAD_REQUEST))
  }
  remove(req.params?.id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return next(CustomError("User not found", httpStatus.NOT_FOUND))
      }
      return res.status(httpStatus.OK).json({
        success: true,
        message: "User deleted",
        data: deletedUser,
      });
    })
    .catch((error) => {
      next(CustomError(error.message))
    });
};

const changePassword = (req, res, next) => {
  req.body.password = passwordToHash(req.body.password);
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      if (!updatedUser) {
        return next(CustomError("User not found", httpStatus.NOT_FOUND))
      }
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Your password has been changed.",
        data: updatedUser,
      });
    })
    .catch((error) => {
      next(CustomError(error.message))
    });
};

const updateProfileImage = (req, res, next) => {
  // check image
  if(!req.files?.profileImage) {
    return next(CustomError("No files uploaded", httpStatus.BAD_REQUEST))
  }

  // upload image
  const fileExtension = path.extname(req.files.profileImage.name)
  const fileName = `${req.user?._id}${fileExtension}`
  const folderPath = path.join(__dirname, "../","uploads/users", fileName)

  req.files.profileImage.mv(folderPath, (error) => {
    if(error) {
      return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        succes:false,
        message:"Unexpected error occured while uploading the file.",
        error:error
      })
      
    }
    // db save
    modify({_id:req.user?._id}, {profileImage:fileName}).then((updatedUser) => {
      // response
      return res.status(httpStatus.OK).json({
        success:true,
        message:"Profile image has been updated successfully",
        data:updatedUser
      })
    }).catch((error) => {
      next(CustomError(error.message))
    })
  })
}


module.exports = {
  create,
  index,
  login,
  projectList,
  resetPassword,
  update,
  deleteUser,
  changePassword,
  updateProfileImage,
};
