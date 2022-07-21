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

const create = async (req, res) => {
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
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error,
      });
    });
};

const index = async (req, res) => {
  list()
    .then((response) => {
      res.status(httpStatus.OK).json({
        success: true,
        message: "Listed",
        data: response,
      });
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error,
      });
    });
};

const login = async (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  loginUser(req.body)
    .then((user) => {
      if (!user) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          message: "Email or password is incorrect",
        });
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
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error,
      });
    });
};

const projectList = (req, res) => {
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
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An unexpected error occured.",
      });
    });
};

const resetPassword = (req, res) => {
  //const newPassword = uuid.v4()?.split("-")[0] || `usr-${new Data().getTime()}`
  const newPassword = crypto.randomBytes(4).toString("hex");
  modify(
    { email: req.body.email },
    { password: passwordToHash(newPassword) }
  )
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
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
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An unexpected error occured.",
      });
    });
};

const update = (req, res) => {
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      res.status(httpStatus.OK).json({
        success: true,
        message: "User updated",
        data: updatedUser,
      });
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An unexpected error occured.",
      });
    });
};

const deleteUser = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "User id missing",
    });
  }
  remove(req.params?.id)
    .then((deletedUser) => {
      if (!deletedUser) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }
      return res.status(httpStatus.OK).json({
        success: true,
        message: "User deleted",
        data: deletedUser,
      });
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An unexpected error occured.",
      });
    });
};

const changePassword = (req, res) => {
  req.body.password = passwordToHash(req.body.password);
  modify({ _id: req.user?._id }, req.body)
    .then((updatedUser) => {
      if (!updatedUser) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          message: "User not found",
        });
      }
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Your password has been changed.",
        data: updatedUser,
      });
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "An unexpected error occured.",
      });
    });
};

const updateProfileImage = (req, res) => {
  // check image
  if(!req.files?.profileImage) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success:false,
      message:"You did not uplaod any file"
    })
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
      res.status(httpStatus.INTERNAL_SERVE_ERROR).json({
        success:false,
        message:"The file upload was successful but an error occured while saving"
      })
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
