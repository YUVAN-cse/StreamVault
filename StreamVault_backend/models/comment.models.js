import mongoose from "mongoose";
import aggregatePaginate from "mongoose-aggregate-paginate-v2";

const commentSchema = new mongoose.Schema({
    content:{
        type: String,
        required: true,
        trim: true
    },    
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    }
}, { timestamps: true });

// ✅ Apply the plugin
commentSchema.plugin(aggregatePaginate);

export default mongoose.model("Comment", commentSchema);
