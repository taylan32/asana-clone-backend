const { insert, list, modify, remove} = require("../services/Projects");
const httpStatus = require("http-status");

const create = (req, res) => {
  req.body.userId = req.user;
  insert(req.body)
    .then((response) => {
      res.status(httpStatus.CREATED).send(response);
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    });
};

const index = (req, res) => {
  list()
    .then((response) => {
      res.status(httpStatus.OK).json({
        success: true,
        message: "Listed",
        data: response,
      });
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
    });
};

const update = (req, res) => {
  if(!req.params?.id) {
    res.status(httpStatus.BAD_REQUEST).json({
      success:false,
      message:"Project id missing"
    })
  }
  modify(req.body, req.params?.id).then((updatedProject) => {
    res.status(httpStatus.OK).json({
      success:true,
      message:"Updated",
      data:updatedProject
    })
  }).catch(error => {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success:false,
      message:"An error occured while update operation.",
      error:error
    })
  })
}

const deleteProject = (req, res) => {
  if(!req.params?.id) {
    res.status(httpStatus.BAD_REQUEST).json({
      success:false,
      message:"Project id missing"
    })
  }
  remove(req.params?.id).then((deletedProject) => {
    if(!deletedProject) {
      return res.status(httpStatus.NOT_FOUND).json({
        success:false,
        message:"Project not found"
      })
    }
    res.status(httpStatus.OK).json({
      success:true,
      message:"Project deleted"
    })
  }).catch(error => {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success:false,
      message:"An error occured while delete operation.",
    })
  })
}

module.exports = {
  create,
  index,
  update,
  deleteProject
};
