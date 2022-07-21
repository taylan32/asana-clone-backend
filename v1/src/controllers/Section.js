const httpStatus = require("http-status")
const { list, insert, modify, remove } = require("../services/Section")
const CustomError = require("../errors/CustomError")

const index = (req, res, next) => {
    if(!req.params?.projectId) {
        return next(CustomError("project id missing", httpStatus.BAD_REQUEST))
    }
    list({projectId:req.params.projectId}).then((sections) => {
        res.status(httpStatus.OK).json({
            success:true,
            message:"Section listed",
            data:sections
        })
    }).catch(error => {
        next(CustomError(error.message))
    })
}
const create = (req, res, next) => {
    req.body.userId = req.user
    insert(req.body).then((response) => {
        return res.status(httpStatus.CREATED).json({
            success:true,
            message:"Section added",
            data:response
        })
    }).catch(error => {
        next(CustomError(error.message))
    })
}

const update = (req, res, next) => {
    if(!req.params?.id) {
        return next(CustomError("section id missing", httpStatus.BAD_REQUEST))
    }
    modify(req.body, req.params?.id).then((updatedSection) => {
        if(!updatedSection) {
            return next(CustomError("Section not found", httpStatus.NOT_FOUND))
        }
        res.status(httpStatus.OK).json({
            success:true,
            message:"Section updated",
            data:updatedSection
        })
    }).catch(error => {
        next(CustomError(error.message))
    })
}

const deleteSection = (req, res, next) => {
    if(!req.params?.id) {
        return next(CustomError("section id missing", httpStatus.BAD_REQUEST))

    }
    remove(req.params?.id).then((deletedSection) => {
        if(!deletedSection) {
            return next(CustomError("Section not found", httpStatus.NOT_FOUND))
        }
        return res.status(httpStatus.OK).json({
            success:true,
            message:"Section deleted",
            data:deletedSection
        })
    }).catch(error => {
        next(CustomError(error.message))
    })
}


module.exports = {
    index,
    create,
    update,
    deleteSection
}