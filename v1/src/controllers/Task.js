const httpStatus = require("http-status");
const { list, insert, modify, remove, findOne } = require("../services/Task");
const CustomError = require("../errors/CustomError")

const index = (req, res, next) => {
  if (!req.params?.projectId) {
    return next(CustomError("project id missing", httpStatus.BAD_REQUEST))
  }
  list({ projectId: req.params.projectId })
    .then((sections) => {
      if(!sections) {
        return next(CustomError("Section not found", httpStatus.NOT_FOUND))
      }
      res.status(httpStatus.OK).json({
        success: true,
        message: "Task listed",
        data: sections,
      });
    })
    .catch((error) => {
      next(CustomError(error.message))
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
      next(CustomError(error.message))
    });
};

const update = (req, res) => {
  if (!req.params?.id) {
    return next(CustomError("task id missing", httpStatus.BAD_REQUEST))
  }
  modify(req.body, req.params?.id)
    .then((updatedTask) => {
      if (!updatedTask) {
        return next(CustomError("Task not found", httpStatus.NOT_FOUND))
      }
      res.status(httpStatus.OK).json({
        success: true,
        message: "Task updated",
        data: updatedTask,
      });
    })
    .catch((error) => {
      next(CustomError(error.message))
    });
};

const deleteTask = (req, res) => {
  if (!req.params?.id) {
    return next(CustomError("task id missing", httpStatus.BAD_REQUEST))
  }
  remove(req.params?.id)
    .then((deletedTask) => {
      if (!deletedTask) {
        return next(CustomError("Task not found", httpStatus.NOT_FOUND))
      }
      return res.status(httpStatus.OK).json({
        success: true,
        message: "Task deleted",
        data: deletedSection,
      });
    })
    .catch((error) => {
      next(CustomError(error.message))
    });
};

const addComment = (req, res) => {
  if (!req.params.id) {
    return next(CustomError("task id missing", httpStatus.BAD_REQUEST))
  }
  findOne({ _id: req.params.id })
    .then((task) => {
      if (!task) {
        return next(CustomError("Task not found", httpStatus.NOT_FOUND))
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
      next(CustomError(error.message))
    });
};

const deleteComment = (req, res) => {
  findOne({ _id: req.params.id })
    .then((task) => {
      if (!task) {
        return next(CustomError("Task not found", httpStatus.NOT_FOUND))
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
      next(CustomError(error.message))
    });
};

const addSubTask = (req, res) => {
  // check if task exists
  if (!req.params?.id) {
    return next(CustomError("task id missing", httpStatus.BAD_REQUEST))
  }
  // get the task
  findOne({ _id: req.params.id })
    .then((task) => {
      if (!task) {
        return next(CustomError("Task not found", httpStatus.NOT_FOUND))
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
      next(CustomError(error.message))
    });
};

const fetchTask = (req, res) => {
    findOne({_id:req.params.id}, true).then((task) => {
        if (!req.params?.id) {
          return next(CustomError("task id missing", httpStatus.BAD_REQUEST))
          }
          if(!task) {
            return next(CustomError("Task not found", httpStatus.NOT_FOUND))
          }
        return res.status(httpStatus.OK).json({
            success:true,
            message:"Task listed",
            data:task
        })
    }).catch((error) => {
      next(CustomError(error.message))
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
