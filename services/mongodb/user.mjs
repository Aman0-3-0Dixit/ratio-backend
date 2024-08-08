import ProfileLike from "../../models/profileLike.mjs";

const searchByUserTo = async (userId) => {
    try {
        const userResponse = await ProfileLike.find({ 
            userTo: userId 
        });
        return userResponse;
    } catch (error) {
        return error;
    }
}

export default searchByUserTo;