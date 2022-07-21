const { insert, list, modify, remove} = require("../services/Projects");
const httpStatus = require("http-status");
const CustomError = require("../errors/CustomError")

const create = (req, res, next) => {
  req.body.userId = req.user;
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((error) => {
      next(CustomError(error.message))
    });
};

const index = (req, res, next) => {
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

const update = (req, res, next) => {
  if(!req.params.id) {
    return next(CustomError("Id missing", httpStatus.OK))
  }
  modify(req.body, req.params?.id).then((updatedProject) => {
    if(!updatedProject) {
      return next(CustomError("Project not found", httpStatus.NOT_FOUND))
    }
    res.status(httpStatus.OK).json({
      success:true,
      message:"Updated",
      data:updatedProject
    })
  }).catch(error => {
    next(CustomError(error.message))
  })
}

const deleteProject = (req, res, next) => {
  if(!req.params.id) {
    return next(CustomError("Id missing", httpStatus.OK))
  }
  remove(req.params?.id).then((deletedProject) => {
    if(!deletedProject) {
      return next(CustomError("Project not found", httpStatus.NOT_FOUND))
    }
    res.status(httpStatus.OK).json({
      success:true,
      message:"Project deleted"
    })
  }).catch(error => {
    next(CustomError(error.message))
  })
}

module.exports = {
  create,
  index,
  update,
  deleteProject
};
