const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

// @desc      Get all users
// @route     GET /api/v1/auth/users
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  const users = await User.find().exec();

  res.json({
    status: "success",
    number: users.length,
    data: users,
  });

  // res.status(200).json(res.advancedResults);
});

// @desc      Get single user
// @route     GET /api/v1/auth/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Create user
// @route     POST /api/v1/auth/users
// @access    Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc      Update user
// @route     PUT /api/v1/auth/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Delete user
// @route     DELETE /api/v1/auth/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});

//Profile Photo Upload
exports.profilePhotoUploadCtrl = async (req, res, next) => {
  try {
    const userToUpdate = await User.findById(req.user.id);
    //2. check if user is found
    if (!userToUpdate) {
      return next(
        new ErrorResponse(`No user found with the id of ${req.user.id}`, 404)
      );
    }
    //3. Check if user is blocked
    if (userToUpdate.isBlocked) {
      return next(
        new ErrorResponse(`Action not allowed, your account is blocked`, 404)
      );
    }
    //4. Check if a user is updating their photo
    if (req.file) {
      //5.Update profile photo
      await User.findByIdAndUpdate(
        req.user.id,
        {
          $set: {
            profilePhoto: req.file.path,
          },
        },
        {
          new: true,
        }
      );
      res.json({
        status: "success",
        data: "You have successfully updated your profile photo",
      });
    }
  } catch (error) {
    next(new ErrorResponse(error.message, 404));
    // console.log(error.message);
    // appErr(error.message, 500));
  }
};

//who view my profile

exports.whoViewedMyProfileCtrl = async (req, res, next) => {
  try {
    //1. Find the original
    const user = await User.findById(req.params.id);
    //2. Find the user who viewed the original user
    const userWhoViewed = await User.findById(req.user.id);

    //3.Check if original and who viewd are found
    if (user && userWhoViewed) {
      //4. check if userWhoViewed is already in the users viewers array
      const isUserAlreadyViewed = user.viewers.find(
        (viewer) => viewer.toString() === userWhoViewed._id.toJSON()
      );
      if (isUserAlreadyViewed) {
        return next(new ErrorResponse("You already viewed this profile", 404));
      } else {
        //5. Push the userWhoViewed to the user's viewers array
        user.viewers.push(userWhoViewed._id);
        //6. Save the user
        await user.save();
        res.json({
          status: "success",
          data: "You have successfully viewed this profile",
        });
      }
    }
  } catch (error) {
    next(new ErrorResponse(error.message, 404));
  }
};

//following
exports.followingCtrl = async (req, res, next) => {
  try {
    //1. Find the user to follow
    const userToFollow = await User.findById(req.params.id);
    //2. Find the user who is following
    const userWhoFollowed = await User.findById(req.user.id);

    //3. Check if user and userWhoFollowed are found

    if (userToFollow && userWhoFollowed) {
      //4. Check if userWhofollowed is already in the user's followers array
      const isUserAlreadyFollowed = userToFollow.followers.find((follower) => {
        // return follower._id.toString();
        // console.log("follower", follower);
        return follower.toString() === userWhoFollowed._id.toString();
      });
      // console.log("isUserAlreadyFollowed", isUserAlreadyFollowed);
      if (isUserAlreadyFollowed) {
        return next(new ErrorResponse("You already followed this user", 404));
      } else {
        //5. Push userWhoFollowed into the user's followers array
        userToFollow.followers.push(userWhoFollowed._id);
        //push userToFollow to the userWhoFollowed's following array
        userWhoFollowed.following.push(userToFollow._id);
        //save
        await userWhoFollowed.save();
        await userToFollow.save();
        res.json({
          status: "success",
          data: "You have successfully follow this user",
        });
      }
    }
  } catch (error) {
    next(new ErrorResponse(error.message, 404));
  }
};

exports.unFollowCtrl = async (req, res, next) => {
  try {
    //1. Find the user to unfolloW
    const userToBeUnfollowed = await User.findById(req.params.id);

    //2. Find the user who is unfollowing
    const userWhoUnFollowed = await User.findById(req.user.id);
    //3. Check if user and userWhoUnFollowed are found
    if (userToBeUnfollowed && userWhoUnFollowed) {
      //4. Check if userWhoUnfollowed is already in the user's followers array
      const isUserAlreadyFollowed = userToBeUnfollowed.followers.find(
        (follower) => follower.toString() === userWhoUnFollowed._id.toString()
      );
      if (!isUserAlreadyFollowed) {
        return next(new ErrorResponse("You have not followed this user", 404));
      } else {
        //5. Remove userWhoUnFollowed from the user's followers array
        userToBeUnfollowed.followers = userToBeUnfollowed.followers.filter(
          (follower) => follower.toString() !== userWhoUnFollowed._id.toString()
        );
        //save the user
        await userToBeUnfollowed.save();
        //7. Remove userToBeInfollowed from the userWhoUnfollowed's following array
        userWhoUnFollowed.following = userWhoUnFollowed.following.filter(
          (following) =>
            following.toString() !== userToBeUnfollowed._id.toString()
        );

        //8. save the user
        await userWhoUnFollowed.save();
        res.json({
          status: "success",
          data: "You have successfully unfollowed this user",
        });
      }
    }
  } catch (error) {
    next(new ErrorResponse(error.message, 404));
  }
};

//block
exports.blockUsersCtrl = async (req, res, next) => {
  try {
    //1. Find the user to be blocked
    const userToBeBlocked = await User.findById(req.params.id);
    //2. Find the user who is blocking
    const userWhoBlocked = await User.findById(req.user.id);
    //3. Check if userToBeBlocked and userWhoBlocked are found
    if (userWhoBlocked && userToBeBlocked) {
      //4. Check if userWhoUnfollowed is already in the user's blocked array
      const isUserAlreadyBlocked = userWhoBlocked.blocked.find(
        (blocked) => blocked.toString() === userToBeBlocked._id.toString()
      );
      if (isUserAlreadyBlocked) {
        return next(new ErrorResponse("You already blocked this user", 404));
      }
      //7.Push userToBleBlocked to the userWhoBlocked's blocked arr
      userWhoBlocked.blocked.push(userToBeBlocked._id);
      //8. save
      await userWhoBlocked.save();
      res.json({
        status: "success",
        data: "You have successfully blocked this user",
      });
    }
  } catch (error) {
    next(new ErrorResponse(error.message, 404));
  }
};

//unblock
exports.unblockUserCtrl = async (req, res, next) => {
  try {
    //1. find the user to be unblocked
    const userToBeUnBlocked = await User.findById(req.params.id);
    //2. find the user who is unblocking
    const userWhoUnBlocked = await User.findById(req.user.id);
    //3. check if userToBeUnBlocked and userWhoUnblocked are found
    if (userToBeUnBlocked && userWhoUnBlocked) {
      //4. Check if userToBeUnBlocked is already in the arrays's of userWhoUnBlocked
      const isUserAlreadyBlocked = userWhoUnBlocked.blocked.find(
        (blocked) => blocked.toString() === userToBeUnBlocked._id.toString()
      );
      if (!isUserAlreadyBlocked) {
        return next(new ErrorResponse("You have not blocked this user", 404));

        //  return next(appErr("You have not blocked this user"));
      }
      //Remove the userToBeUnblocked from the main user
      userWhoUnBlocked.blocked = userWhoUnBlocked.blocked.filter(
        (blocked) => blocked.toString() !== userToBeUnBlocked._id.toString()
      );
      //Save
      await userWhoUnBlocked.save();
      res.json({
        status: "success",
        data: "You have successfully unblocked this user",
      });
    }
  } catch (error) {
    next(new ErrorResponse(error.message, 404));
  }
};

//admin-block
exports.adminBlockUserCtrl = async (req, res, next) => {
  try {
    //1. find the user to be blocked
    const userToBeBlocked = await User.findById(req.params.id);
    //2. Check if user found
    if (!userToBeBlocked) {
      return next(appErr("User not Found"));
    }
    //Change the isBlocked to true
    userToBeBlocked.isBlocked = true;
    //4.save
    await userToBeBlocked.save();
    res.json({
      status: "success",
      data: "You have successfully blocked this user",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

//admin-unblock
exports.adminUnblockUserCtrl = async (req, res, next) => {
  try {
    //1. find the user to be unblocked
    const userToBeunblocked = await User.findById(req.params.id);
    //2. Check if user found
    if (!userToBeunblocked) {
      return next(appErr("User not Found"));
    }
    //Change the isBlocked to false
    userToBeunblocked.isBlocked = false;
    //4.save
    await userToBeunblocked.save();
    res.json({
      status: "success",
      data: "You have successfully unblocked this user",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};

exports.updatePasswordCtrl = async (req, res, next) => {
  const { password } = req.body;
  try {
    //Check if user is updating the password
    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      //update user
      await User.findByIdAndUpdate(
        req.userAuth,
        { password: hashedPassword },
        { new: true, runValidators: true }
      );
      res.json({
        status: "success",
        data: "Password has been changed successfully",
      });
    } else {
      return next(appErr("Please provide password field"));
    }
  } catch (error) {
    next(appErr(error.message));
  }
};

//delete account
exports.deleteUserAccountCtrl = async (req, res, next) => {
  try {
    //1. Find the user to be deleted
    const userTodelete = await User.findById(req.userAuth);
    //2. find all posts to be deleted
    await Post.deleteMany({ user: req.userAuth });
    //3. Delete all comments of the user
    await Comment.deleteMany({ user: req.userAuth });
    //4. Delete all category of the user
    await Category.deleteMany({ user: req.userAuth });
    //5. delete
    await userTodelete.delete();
    //send response
    return res.json({
      status: "success",
      data: "Your account has been deleted successfully",
    });
  } catch (error) {
    next(appErr(error.message));
  }
};
