import Recommendation from "../models/recommendationModel.mjs";
import UserInfo from "../models/userInfo.mjs";
import mongoose from 'mongoose';
import { distBetCoordsKM, currentTimeInMillisec } from '../utils/utilFunctions.mjs';
import prefSettings from "../models/prefSettingsModel.mjs";
import "core-js/modules/es.string.replace.js"; 
import dotenv from "dotenv";
import fetch from 'node-fetch';



dotenv.config();
const apiKey =  process.env.GOOGLE_PLACES_TYPES_API_KEY;

async function getLatLng(address) {
    
    const baseUrl = 'https://maps.googleapis.com/maps/api/geocode/json';
    const url = `${baseUrl}?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'OK') {
        const location = data.results[0].geometry.location;
        return { coordinates: [location.lat, location.lng] };
        } else {
        throw new Error(`Geocoding failed with status: ${data.status}`);
        }
    } catch (error) {
        console.error('Error fetching geocoding data:', error);
        throw error; // You can handle the error differently if needed
    }
}
async function getLatLongfixed(placeName){
    try {
        const locations = {
             "Toronto" : [43.651070, -79.347015] ,
             "Montreal" : [45.508888, -73.561668] ,
             "Vancouver" : [49.246292, -123.116226] ,
             "Calgary" : [51.049999, -114.066666] ,
             "Edmonton" : [53.631611, -113.323975] ,
             "Ottawa" : [45.424721, -75.695000] ,
             "Quebec City" : [46.813877,-71.207977] ,
             "Winnipeg" : [49.895138,-97.138374] ,
             "Halifax" : [44.648766,-63.575237] ,
             "Victoria BC" : [48.407326, -123.329773] , 
             "Los Angeles" : [34.052235, -118.243683] ,
             "Chicago" : [ 41.881832, -87.623177] ,
             "Houston" : [29.749907, -95.358421] ,
             "Phoenix" : [33.448376, -112.074036] ,
             "Philadelphia" : [39.952583, -75.165222] ,
             "San Antonio" : [29.424349, -98.491142] ,
             "San Diego" : [32.715736, -117.161087] ,
             "Dallas" : [32.779167, -96.808891] ,
             "San Jose" : [37.335480, -121.893028] ,
             "New York City" : [40.712776,-74.005974]
        };
        return locations[placeName] || [0.0,0.0]
         
    } catch (error) {
        console.log(error)
    }
}
export async function recommendedProfiles (req, res){
    try {
        const inputUserId = req.user.userId; 
        // console.log(inputUserId)
        const numberOfUsers = req.body.numberOfUsers; 
        const inputUser = await UserInfo.findOne({ _id: inputUserId });
        const inputUserPreferences = await prefSettings.findOne({ _id: inputUserId });
        const getAllUsers = await UserInfo.find({ _id: { $ne: inputUserId } });

        if (!inputUser || !inputUserPreferences || getAllUsers.length === 0) {
            return res.status(404).json({ 
                result: false, 
                message: "User not found or no other users available for recommendations." 
            });
        }
        const scores = await Promise.all(getAllUsers.map(async user => {
            let score = 0;
            // console.log(score)
            // Gender filter)
            if (inputUser.partnerPreferences.genderPreference.toLowerCase() === user.gender.toLowerCase()) {
                score += 1;
                // console.log(score)
                // Distance filter
                // console.log(inputUserPreferences.applyDistanceFilter," distance filter")
                if(inputUserPreferences.applyDistanceFilter){
                    // change this function to use homecities as constant. 
                    // take the location of the homecity from the user and convert it to location coordinates manually. 
                    const locationCoordsInputUser =  await getLatLng(inputUser.homeCity)
                    const currentLocationInputUser = locationCoordsInputUser.coordinates
                    const locationCoordsUser =  await getLatLng(user.homeCity)
                    const currentLocationUser = locationCoordsUser.coordinates
                    // console.log(currentLocationInputUser,currentLocationUser)
                    if(currentLocationInputUser[0]===currentLocationUser[0] && currentLocationInputUser[1]===currentLocationUser[1]){
                        score+=1;
                        // console.log(score,"same location")
                    }
                    else{
                    const distance = distBetCoordsKM(currentLocationInputUser[0], currentLocationInputUser[1], currentLocationUser[0], currentLocationUser[1]);
                    // const distance = distBetCoordsKM(inputUser.currentLocation[0], inputUser.currentLocation[1], user.currentLocation[0], user.currentLocation[1]);
                    if (inputUserPreferences.distance.min_distance <= distance && distance <= inputUserPreferences.distance.max_distance) {
                        score += 1;
                        // console.log(score,"qualified location")
                    }
                }
                }
                // Age filter
                if(inputUserPreferences.applyAgeFilter){
                    const birthDate = user.dateOfBirth; 
                    const currentDate = new Date();
                    let userAge = currentDate.getFullYear() - birthDate.getFullYear();
                    if (currentDate.getMonth() < birthDate.getMonth() || (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() < birthDate.getDate())) {
                        userAge--;
                    }
                    if (inputUserPreferences.age.min_age <= userAge && userAge <= inputUserPreferences.age.max_age) {
                        score += 1;
                    }
                    // console.log(score, "age")
                }
            }
            // if(score>0){
            return { 
                userId: user._id, 
                score: score 
            };
        // }
        }));

        const existingRecommendation = await Recommendation.findOneAndUpdate(
            { _id: inputUserId },
            { $set: { recommendations: scores, updatedAt: currentTimeInMillisec()} },
            { upsert: true, new: true }
        );
        console.log(scores);
        let sortedUsers = await Recommendation.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(inputUserId) } },
            { $unwind: '$recommendations' },
            { $sample: { size: Math.min(numberOfUsers, scores.length) } }, // Random sampling
            { $sort: { 'recommendations.score': -1 } },
            { $limit: Math.min(1000, scores.length) },
            { $project: { _id: 0, userId: '$recommendations.userId', score: '$recommendations.score' } }
        ]);
        // grouping by scores 
        console.log(sortedUsers);
        const groupedByScore = new Map();
        for (const user of sortedUsers) {
        if (!groupedByScore.has(user.score)) {
            groupedByScore.set(user.score, []);
        }
        groupedByScore.get(user.score).push(user);
        }

        console.log(groupedByScore);

        // Shuffling Each Group
        for (const users of groupedByScore.values()) { 
        for (let i = users.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [users[i], users[j]] = [users[j], users[i]];
        }
        }
        //  Flattening but (Maintaining Score Order)
        const shuffledUsersWithScore = Array.from(groupedByScore.entries())
        .sort((a, b) => b[0] - a[0]) // Sort entries by score (descending)
        .flatMap(([score, users]) => users);
        console.log(shuffledUsersWithScore)
        res.status(200).json({ 
            result: true, 
            message: "Successfully retrieved the list of recommended users",
            recommendedUsers: scores //shuffledUsersWithScore 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            result: false, 
            message: error.message 
        }); 
    }
};

