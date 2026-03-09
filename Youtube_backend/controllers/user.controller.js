import { User } from '../models/user.models.js';
import APIResponse from '../utils/ApiResponse.js';
import AppError from '../utils/ErrorClass.js';
import { uploadAndDeleteLocal } from '../utils/cloudinary.js';
import mongoose from 'mongoose';

async function register(req, res) {
    const { username, email, password, fullName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new AppError(400, 'User already exists');
    }

    const { avatar, coverImage } = req.files;
    if (!avatar) {
        throw new AppError(400, 'avatar picture is required');
    }

    const avatarUrl = await uploadAndDeleteLocal(avatar[0].path);
    const coverImageUrl = await uploadAndDeleteLocal(coverImage[0].path);

    const user = await User.create({
        username,
        fullName,
        email,
        password,
        avatar: avatarUrl.secure_url,
        coverImage: coverImageUrl.secure_url
    });

    let response = await user.save();

    res
        .status(200)
        .json(new APIResponse(200, 'User registered successfully', response));
}

async function login(req, res) {
    const { email, password } = req.body;
    console.log(email, password)
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
        throw new AppError(401, 'Invalid credentials');
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    res
        .status(200)
        .cookie('accessToken', accessToken, { httpOnly: true })
        .cookie('refreshToken', refreshToken, { httpOnly: true })
        .json(new APIResponse(200, 'Login successful', {
            accessToken,
            refreshToken
        }));
}


async function logout(req, res) {
    console.log(req.user)
    const user = req.user;
    User.findById(user.userId)
        .then(user => user.clearRefreshToken())
        .catch(err => {
            return new AppError(500, err.message);
        });


    res
        .status(200)
        .clearCookie('accessToken')
        .clearCookie('refreshToken')
        .json(new APIResponse(200, 'Logout successful'));
}



async function refreshToken(req, res) {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
        throw new AppError(401, 'Unauthorized');
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
        throw new AppError(401, 'Unauthorized');
    }

    const accessToken = user.generateAccessToken();
    const newRefreshToken = await user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    res
        .status(200)
        .cookie('accessToken', accessToken, { httpOnly: true })
        .cookie('refreshToken', newRefreshToken, { httpOnly: true })
        .json(new APIResponse(200, 'Token refreshed', { accessToken }));
}


async function changeCurrentPassword(req, res) {
    let { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new AppError(400, 'All fields are required');
    }

    const user = await User.findById(req.user?.userId);

    if (!user) {
        throw new AppError(404, 'User not found');
    }

    if (!(await user.comparePassword(oldPassword))) {
        throw new AppError(400, 'Invalid credentials');
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });
    res.status(200).json(new APIResponse(200, 'Password changed successfully'));
}

async function getCurrentUser(req, res) {
    res.status(200).json(new APIResponse(200, 'User profile fetched', req.user));
}


async function updateAccount(req, res) {
    const { username, fullName, email } = req.body;

    if (!username || !fullName || !email) {
        throw new AppError(400, 'All fields are required');
    }

    const user = await User.findById(req.user?.userId);

    if (!user) {
        throw new AppError(404, 'User not found');
    }

    user.username = username;
    user.fullName = fullName;
    user.email = email;

    await user.save({ validateBeforeSave: false });

    let updateProfile = await User.findById(req.user?.userId).select("-password -refreshToken");

    res.status(200).json(new APIResponse(200, 'Account updated successfully', updateProfile));
}



async function updateAvatar(req, res) {
    const avatarLocalPath = req.file.path;

    if (!avatarLocalPath) {
        throw new AppError(400, 'Avatar picture is required');
    }

    const avatarUrl = await uploadAndDeleteLocal(avatarLocalPath);

    if (!avatarUrl) {
        throw new AppError(500, 'Failed to upload avatar');
    }

    const user = await User.findById(req.user?.userId).select("-password -refreshToken");

    if (!user) {
        throw new AppError(404, 'User not found');
    }

    user.avatar = avatarUrl.secure_url;
    await user.save({ validateBeforeSave: false });


    res.status(200).json(new APIResponse(200, 'Avatar updated successfully', user));

}



async function updateCoverImage(req, res) {
    const coverImageLocalPath = req.file.path;

    if (!coverImageLocalPath) {
        throw new AppError(400, 'Avatar picture is required');
    }

    const coverImageUrl = await uploadAndDeleteLocal(coverImageLocalPath);

    if (!coverImageUrl) {
        throw new AppError(500, 'Failed to upload avatar');
    }

    const user = await User.findById(req.user?.userId).select("-password -refreshToken");

    if (!user) {
        throw new AppError(404, 'User not found');
    }

    user.coverImage = coverImageUrl.secure_url;
    await user.save({ validateBeforeSave: false });


    res.status(200).json(new APIResponse(200, 'Avatar updated successfully', user));

}

async function getChannelInfo(req, res) {
  let { userId } = req.params;

  if (!userId) {
    throw new AppError(400, "UserId is required");
  }

  let user = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId)
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers"
      }
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribed"
      }
    },
    {
      $project: {
        username: 1,
        fullName: 1,
        avatar: 1,
        coverImage: 1,
        subscribers: { $size: "$subscribers" },
        subscribed: { $size: "$subscribed" },
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?.userId, "$subscribers.subscriber"] },
            then: true,
            else: false
          }
        }
      }
    }
  ]);

  if (!user.length) {
    throw new AppError(404, "User not found");
  }

  res
    .status(200)
    .json(new APIResponse(200, "User profile fetched", user[0]));
}

async function getWatchHistory(req, res) {
  const user = await User.findById(req.user?.userId)
  .populate({
      path: "watchHistory",
      populate: {
          path: "owner", // nested populate for the video owner
          model: "User",
          select: "username email" // don’t include sensitive fields
        }
    })
    .select("-password -refreshToken");
    
    console.log(user)
  if (!user) {
    throw new AppError(404, "User not found");
  }

  user.watchHistory = user.watchHistory.reverse() || [];

  res
    .status(200)
    .json(new APIResponse(200, "Watch history fetched", user));
}


export {
    register,
    login,
    logout,
    refreshToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccount,
    updateAvatar,
    updateCoverImage,
    getChannelInfo,
    getWatchHistory

};