const httpStatus = require("http-status")
const { list, insert, modify, remove } = require("../services/Section")


const index = (req, res) => {
    if(!req.params?.projectId) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success:false,
            message:"Project info missing"
        })
    }
    list({projectId:req.params.projectId}).then((sections) => {
        res.status(httpStatus.OK).json({
            success:true,
            message:"Section listed",
            data:sections
        })
    }).catch(error => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"Unexpected error occured.",
            error:error
        })
    })
}
const create = (req, res) => {
    req.body.userId = req.user
    insert(req.body).then((response) => {
        return res.status(httpStatus.CREATED).json({
            success:true,
            message:"Section added",
            data:response
        })
    }).catch(error => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"Unexpected error occured.",
            error:error
        })
    })
}

const update = (req, res) => {
    if(!req.params?.id) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success:false,
            message:"Session id missing"
        })
    }
    modify(req.body, req.params?.id).then((updatedSection) => {
        res.status(httpStatus.OK).json({
            success:true,
            message:"Section updated",
            data:updatedSection
        })
    }).catch(error => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"Unexpected error occured.",
            error:error
        })
    })
}

const deleteSection = (req, res) => {
    if(!req.params?.id) {
        return res.status(httpStatus.BAD_REQUEST).json({
            success:false,
            message:"Section id missing"
        })
    }
    remove(req.params?.id).then((deletedSection) => {
        if(!deletedSection) {
            return res.status(httpStatus.NOT_FOUND).json({
                success:false,
                message:"Section not found"
            })
        }
        return res.status(httpStatus.OK).json({
            success:true,
            message:"Section deleted",
            data:deletedSection
        })
    }).catch(error => {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
            success:false,
            message:"Unexpected error occured.",
            error:error
        })
    })
}


module.exports = {
    index,
    create,
    update,
    deleteSection
}