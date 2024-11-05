// Configure to ipv4 address of local machine
const API_ROOT = "http://192.168.0.110:3000"
export async function getUserInfo(userID){
    try{
    const response = await fetch(`${API_ROOT}/userInfo/${userID}`);
    const userInfo = await response.json()
    console.log(userInfo)
    
    return response;
    } catch (err){
        console.log(err);
    }
}
