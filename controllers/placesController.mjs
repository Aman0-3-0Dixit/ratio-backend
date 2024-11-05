import dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { placeCardFields, defaultPlaceTypes, defaultSearchRadius } from '../constants/placesConstants.mjs';
import catchAsync from '../utils/catchAsync.mjs';

const baseURL = process.env.GOOGLE_PLACES_API_BASE_URL;

export const searchPlaceFromQuery = catchAsync(async (req, res, next) => {
    const apiURL = `${baseURL}/places/:searchText`;
    // Extracting all the valid query params from the request.
    // Helpful in setting default values for params.
    const { 
        queryText,
        fields = placeCardFields,
        includedType,
        languageCode,
        maxResultCount = 2,
        minRating,
        openNow,
        priceLevels,
        regionCode,
    } = req.query;

    // Creating the request object to be sent over to Google Places API
    const data = {
        textQuery: queryText,
        ...(includedType        && {includedType:       includedType}),
        ...(languageCode        && {languageCode:       languageCode}),
        ...(maxResultCount      && {maxResultCount:     maxResultCount}),
        ...(minRating           && {minRating:          minRating}),
        ...(openNow             && {openNow:            openNow}),
        ...(priceLevels         && {priceLevels:        priceLevels}),
        ...(regionCode          && {regionCode:         regionCode}),
    }
    console.log('here is the api key', process.env.GOOGLE_PLACES_API_KEY);
    // Header for the request, as mentioned in the official docs.
    const config = {
        headers : {
            'Content-Type' : 'application/json',
            'X-Goog-Api-Key' : process.env.GOOGLE_PLACES_API_KEY,
            'X-Goog-FieldMask' : fields.map((field) => `places.${field}`).join(','),
        }
    }

    axios.post(apiURL, data, config)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.error('Axios Error:', error.message);
            res.status(500).json({ error: error.message });
        });
});


// Helper function to map cuisine types to valid values from Table A
const mapCuisineToType = (cuisineType) => {
    const typeMapping = {
        Italian: 'italian_restaurant',
        Chinese: 'chinese_restaurant',
        Indian: 'indian_restaurant',
        American: 'american_restaurant',
        Japanese: 'japanese_restaurant',
        Korean: 'korean_restaurant',
        French: 'french_restaurant',
        Mexican: 'mexican_restaurant',
        Thai: 'thai_restaurant',
        Turkish: 'turkish_restaurant',
        Lebanese: 'lebanese_restaurant',
        Greek: 'greek_restaurant',
        Viet: 'vietnamese_restaurant',
        Spanish: 'spanish_restaurant',
        Mediterranean: 'mediterranean_restaurant',
        Indonesian: 'indonesian_restaurant',
        Brazilian: 'brazilian_restaurant',
        // Add more mappings based on Table A values and cuisineType requirements
    };
    return typeMapping[cuisineType] || 'restaurant'; // Default to 'restaurant' if no match
};


// Search for places nearby a latitude, longitude
export const searchPlacesNearby = catchAsync(async (req, res, next) => {
    console.log(req.query);

    const apiURL = `${baseURL}/places/:searchNearby`;

    const {
        latitude,
        longitude,
        radius = defaultSearchRadius,
        fields = placeCardFields,
        includedTypes = defaultPlaceTypes,
        includedPrimaryTypes,
        excludedTypes,
        excludedPrimaryTypes,
        languageCode,
        maxResultCount,
        rankPreference,
        regionCode,
        cuisineType, // This could be used to map to an appropriate value in Table A
    } = req.query;

    // If cuisineType is provided, override the includedTypes with a relevant type from Table A
    const mappedType = cuisineType ? mapCuisineToType(cuisineType) : includedTypes;

    const data = {
        locationRestriction: {
            circle :{
                center:  {
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                },
                radius: radius,
            },
        },
        ...(includedTypes        && {includedTypes:       [mappedType]}),
        ...(includedPrimaryTypes && {includedPrimaryTypes:includedPrimaryTypes}),
        ...(excludedTypes        && {excludedTypes:       excludedTypes}),
        ...(excludedPrimaryTypes && {excludedPrimaryTypes:excludedPrimaryTypes}),
        ...(languageCode         && {languageCode:        languageCode}),
        ...(maxResultCount       && {maxResultCount:      maxResultCount}),
        ...(rankPreference       && {rankPreference:      rankPreference}),
        ...(regionCode           && {regionCode:          regionCode}),
    }

    console.log('here is the api key', process.env.GOOGLE_PLACES_API_KEY);
    // Header for the request, as mentioned in the official docs.
    const config = {
        headers : {
            'Content-Type' : 'application/json',
            'X-Goog-Api-Key' : process.env.GOOGLE_PLACES_API_KEY,
            'X-Goog-FieldMask' : fields.map((field) => `places.${field}`).join(','),
        }
    }

    axios.post(apiURL, data, config)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.error('Axios Error:', error.message);
            res.status(500).json({ error: error.message });
        });
});


// Get Place Details
export const getPlaceDetails = catchAsync(async (req, res) => {
    console.log(req.query);

    const {
        placeID,
        fields = placeCardFields,
        languageCode,
        regionCode,
    } = req.query;

    const apiURL = `${baseURL}/places/${placeID}`;


    const data = {
        ...(languageCode  && {languageCode: languageCode}),
        ...(regionCode    && {regionCode:   regionCode}),
    }

    console.log('here is the api key', process.env.GOOGLE_PLACES_API_KEY);
    // Header for the request, as mentioned in the official docs.
    const config = {
        headers : {
            'X-Goog-Api-Key' : process.env.GOOGLE_PLACES_API_KEY,
            'X-Goog-FieldMask' : fields.map((field) => `${field}`).join(','),
        }
    }

    //console.log(`API-Key : ${apiKey}`)
    console.log(`API-URL : ${apiURL}`)

    // Check if data is truthy, then include it in the request
    const requestOptions = data ? { params: data, ...config } : config;

    console.log(requestOptions);

    axios.get(apiURL, requestOptions)
        .then((response) => {
            console.log(response.photos);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.error('Axios Error:', error.message);
            res.status(500).json({ error: error.message });
        });
});

// Get Place Pictures.
export const getPhoto = catchAsync(async (req, res) => {
    console.log(req.query);

    const {
        photoInfo,
        maxHeightPx = 200,
        maxWidthPx = 200,
    } = req.query;

    const apiURL = `${baseURL}/${photoInfo}/media`;

    console.log(apiURL);

    const data = {
        ...(maxHeightPx && {maxHeightPx: maxHeightPx}),
        ...(maxWidthPx  && {maxWidthPx:  maxWidthPx}),
        skipHttpRedirect: true, // Instead of getting the image, get a URI.
    }

    console.log(data);

    // Header for the request, as mentioned in the official docs.
    const config = {
        headers : {
            'X-Goog-Api-Key' : process.env.GOOGLE_PLACES_API_KEY,
        }
    }

    // Check if data is truthy, then include it in the request
    const requestOptions = data ? { params: data, ...config } : config;

    axios.get(apiURL, requestOptions)
        .then((response) => {
            console.log(response.data);
            res.status(200).json(response.data);
        })
        .catch((error) => {
            console.error('Axios Error:', error.message);
            res.status(500).json({ error: error.message });
        });
});


const QueryController = {
    searchPlaceFromQuery,
    searchPlacesNearby,
    getPlaceDetails,
    getPhoto,
};

export default QueryController;