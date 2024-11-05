import { searchByUserTo } from "../services/mongodb/user.mjs";
import { searchByUserFrom } from "../services/mongodb/user.mjs";

export async function profileLikesList(req, res){
    const userId = req.params.id;

    searchByUserTo(userId).then((usersResponse) => {
        if (!usersResponse || usersResponse.length === 0) {
            res.status(201).json({ 
                result: true, 
                message: "Zero profile likes" 
            });
        } else {
            const userIds = usersResponse.map(user => user.userFrom);
            res.status(200).json({ 
                result: true, 
                message: "Profile likes retrieved successfully",
                likedByUsers: userIds
            });
        }
    }).catch((error) => {
        res.status(500).json({ 
            result: false, 
            message: "Error occurred while fetching profile likes",
            error: error.message
        });
    });
};

export async function profileMutualLikesList(req, res) {
    const userId = req.params.id;
    try {
        const usersLikedToUser = await searchByUserTo(userId);
        const usersLikedByUser = await searchByUserFrom(userId);

        if (!usersLikedToUser.length || !usersLikedByUser.length) {
            return res.status(200).json({
                result: true,
                message: "No mutual profile likes",
                mutualLikes: []
            });
        }

        const usersLikedToUserIds = new Set(usersLikedToUser.map(user => user.userFrom));
        const mutualLikes = usersLikedByUser.filter(user => usersLikedToUserIds.has(user.userTo)).map(user => user.userTo);

        return res.status(200).json({
            result: true,
            message: "Mutual profile likes retrieved successfully",
            mutualLikes: mutualLikes
        });
    }catch (error) {
     return res.status(500).json({
         result: false,
         message: "Error occurred while fetching mutual profile likes",
         error: error.message
     });
    }
}