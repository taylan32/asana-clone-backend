const httpStatus = require("http-status");
const { list, insert, modify, remove, findOne } = require("../services/Task");

const index = (req, res) => {
  if (!req.params?.projectId) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Project info missing",
    });
  }
  list({ projectId: req.params.projectId })
    .then((sections) => {
      res.status(httpStatus.OK).json({
        success: true,
        message: "Task listed",
        data: sections,
      });
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unexpected error occured.",
        error: error,
      });
    });
};
const create = (req, res) => {
  req.body.userId = req.user;
  insert(req.body)
    .then((response) => {
      return res.status(httpStatus.CREATED).json({
        success: true,
        message: "Task added",
        data: response,
      });
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unexpected error occured.",
        error: error,
      });
    });
};

const update = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Task id missing",
    });
  }
  modify(req.body, req.params?.id)
    .then((updatedTask) => {
      if (!updatedTask) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          message: "Task not found",
        });
      }
      res.status(httpStatus.OK).json({
        success: true,
        message: "Task updated",
        data: updatedTask,
      });
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unexpected error occured.",
        error: error,
      });
    });
};

const deleteTask = (req, res) => {
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Task id missing",
    });
  }
  remove(req.params?.id)
    .then((deletedTask) => {
      if (!deletedTask) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          message: "Task not found",
        });
      }
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Task deleted",
        data: deletedSection,
      });
    })
    .catch((error) => {
      res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Unexpected error occured.",
        error: error,
      });
    });
};

const addComment = (req, res) => {
  if (!req.params.id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Task id missing",
    });
  }
  findOne({ _id: req.params.id })
    .then((task) => {
      if (!task) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          message: "Task not found",
        });
      }
      task.comments.push({
        ...req.body,
        commentedAt: new Date(),
        userId: req.user?._id,
      });
      task.save().then((updatedTask) => {
        return res.status(httpStatus.OK).json({
          success: true,
          message: "Comment added",
          data: updatedTask,
        });
      });
    })
    .catch((error) => {
      return res.status.json({
        success: false,
        essage: "Unexpected error occured",
        error: error,
      });
    });
};

const deleteComment = (req, res) => {
  findOne({ _id: req.params.id })
    .then((task) => {
      if (!task) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          message: "Task not found",
        });
      }
      task.comments = task.comments.filter(
        (c) => c._id != req.params.commentId
      );
      task.save().then((updatedTask) => {
        return res.status(httpStatus.OK).json({
          success: true,
          message: "Comment Deleted",
          data: updatedTask,
        });
      });
    })
    .catch((error) => {
      return res.status.json({
        success: false,
        essage: "Unexpected error occured",
        error: error,
      });
    });
};

const addSubTask = (req, res) => {
  // check if task exists
  if (!req.params?.id) {
    return res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Task id missing",
    });
  }
  // get the task
  findOne({ _id: req.params.id })
    .then((task) => {
      if (!task) {
        return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          message: "Task not found",
        });
      }
      // create sub-task
      insert({ ...req.body, userId: req.user?._id }).then((subTask) => {
        // Show the ref of sub-task on task and update task
        task.subTasks.push(subTask);
        task.save().then((updatedTask) => {
          // send the new document to the use
          return res.status(httpStatus.OK).json({
            success: true,
            message: "Sub task added",
            data: updatedTask,
          });
        });
      });
    })
    .catch((error) => {
      return res.status.json({
        success: false,
        essage: "Unexpected error occured",
        error: error,
      });
    });
};

const fetchTask = (req, res) => {
    findOne({_id:req.params.id}, true).then((task) => {
        if (!req.params?.id) {
            return res.status(httpStatus.BAD_REQUEST).json({
              success: false,
              message: "Task id missing",
            });
          }
          if(!task) {
            return res.status(httpStatus.NOT_FOUND).json({
              success:false,
              message:"Task not found"
            })
          }
        return res.status(httpStatus.OK).json({
            success:true,
            message:"Task listed",
            data:task
        })
    }).catch((error) => {
        return res.status.json({
            success: false,
            essage: "Unexpected error occured",
            error: error,
          });
    })
}

module.exports = {
  index,
  create,
  update,
  deleteTask,
  addComment,
  deleteComment,
  addSubTask,
  fetchTask
};
