import searchByUserTo from "../services/mongodb/user.mjs";

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