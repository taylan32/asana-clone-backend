const mongoose = require("mongoose")
const Schema = mongoose.Schema
const logger = require("../scripts/loggers/Section")

const SectionSchema = new Schema({
    name:String,
    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    projectId: {
        type:mongoose.Types.ObjectId,
        ref:"Project"
    },
    order:Number
}, {timestamps:true, versionKey:false})

SectionSchema.post("save", (doc) => {
    logger.log({
        level:"info",
        message:doc
    })
})

module.exports = mongoose.model("Section", SectionSchema)