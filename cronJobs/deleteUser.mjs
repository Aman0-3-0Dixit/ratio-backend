import DeleteUser from "../models/deleteUser.mjs";
import User from "../models/user.mjs";
import UserInfo from "../models/userInfo.mjs";

export const checkUserDeletion = async() => {
    const currentDate = new Date();
    const thirtyDaysAgo = currentDate.getTime() - (30 * 24 * 60 * 60 * 1000);

    try {
        const usersToDelete = await DeleteUser.find({ createdAt: { $lte: thirtyDaysAgo } });

        await DeleteUser.deleteMany({ _id: { $in: usersToDelete.map(user => user._id) } });
        await deleteMany({ _id: { $in: usersToDelete.map(user => user._id) } });
        await _deleteMany({ _id: { $in: usersToDelete.map(user => user._id) } });

        console.log(`${usersToDelete.length} users deleted.`);
    } catch (err) {
        console.error('Error while processing users:', err.message);
    }
}
