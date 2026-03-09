import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
        required: true
    }]
}, { timestamps: true });



export default mongoose.model("Playlist", playlistSchema);
