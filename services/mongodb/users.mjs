import User from "../../models/user.mjs";
import UserInfo from "../../models/userInfo.mjs";

export const searchUserById = async (userId) => {
  try {
    const userResponse = await User.findOne({ _id: userId });
    console.log(userResponse);
    return userResponse;
  } catch (error) {
    return error;
  }
};

export const searchUserInfoById = async (userId) => {
  try {
    const userResponse = await UserInfo.findOne({ _id: userId });
    return userResponse;
  } catch (error) {
    return error;
  }
};

export const updateByUserId = async (userId, setData) => {
  try {
    const userResponse = await User.updateOne(
      { _id: userId, is_active: true },
      { $set: setData }
    );
    return userResponse;
  } catch (error) {
    return error;
  }
};
