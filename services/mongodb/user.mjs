import ProfileLike from "../../models/profileLike.mjs";

export const searchByUserTo = async (userId) => {
    try {
        const userResponse = await ProfileLike.find({ 
            userTo: userId 
        });
        return userResponse;
    } catch (error) {
        return error;
    }
}

export const searchByUserFrom = async (userId) => {
    try {
        const userResponse = await ProfileLike.find({
            userFrom: userId
        });
        return userResponse;
    } catch (error) {
        return error;
    }
}

