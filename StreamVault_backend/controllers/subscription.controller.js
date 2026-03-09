import mongoose, {isValidObjectId} from "mongoose"
import Subscription from "../models/subscription.models.js";
import wrapAsync from "../utils/wrapAsync.js";
import APIResponse from "../utils/ApiResponse.js";
import AppError from "../utils/ErrorClass.js";
import {User} from "../models/user.models.js";


const toggleSubscription = wrapAsync(async (req, res) => {
    const {channelId} = req.params

    if (!isValidObjectId(channelId)) {
        throw new AppError(400, 'Invalid channel ID');
    }

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new AppError(404, 'Channel not found');
    }

    const isAldreadySubscribed = await Subscription.findOne({subscriber: req.user.userId, channel: channelId});
    if (isAldreadySubscribed) {
        await Subscription.findByIdAndDelete(isAldreadySubscribed._id);
        return res.status(200).json(new APIResponse(200, 'Unsubscribed successfully', isAldreadySubscribed));
    } 

    const subscription = await Subscription.create({
        subscriber: req.user.userId,
        channel: channelId
    })

    if (!subscription) {
        throw new AppError(500, 'Failed to subscribe');
    }

    res.status(200).json(new APIResponse(200, 'Subscribed successfully', subscription));
})

const getUserChannelSubscribers = wrapAsync(async (req, res) => {
    const {channelId} = req.params

    if (!isValidObjectId(channelId)) {
        throw new AppError(400, 'Invalid channel ID');
    }

    const channel = await User.findById(channelId);
    if (!channel) {
        throw new AppError(404, 'Channel not found');
    }

    const subscribers = await Subscription.find({channel: channelId}).populate('subscriber', 'username email fullName');
    if (!subscribers) {
        throw new AppError(404, 'Subscribers not found');
    }

    res.status(200).json(new APIResponse(200, 'Subscribers fetched successfully', subscribers));
})

const getSubscribedChannels = wrapAsync(async (req, res) => {
    const { subscriberId } = req.params

    if (!isValidObjectId(subscriberId)) {
        throw new AppError(400, 'Invalid subscriber ID');
    }

    const subscriber = await User.findById(subscriberId);
    if (!subscriber) {
        throw new AppError(404, 'Subscriber not found');
    }

    const channels = await Subscription.find({subscriber: subscriberId}).populate('channel', 'username email fullName');
    if (!channels) {
        throw new AppError(404, 'Channels not found');
    }

    res.status(200).json(new APIResponse(200, 'Channels fetched successfully', channels));
})


export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}