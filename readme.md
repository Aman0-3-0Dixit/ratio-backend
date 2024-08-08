# Ratio Backend

This repository contains base code for ratio backend.

## Installation

1. Clone the repository:


2. Navigate to the project directory:


3. Install dependencies:


4. Set up MongoDB:
- Create a MongoDB Atlas account or use an existing one.
- Replace the connection string in `app.js` with your MongoDB Atlas connection string.

## Usage

1. Start the server: npm start ( already added in package.json)


2. Access the application on `http://localhost:3000`.

## Endpoints

- `GET /users`: Retrieves all users from the database.
- `GET /users/{id}`: Retrieves a user from the database.


- `POST /message/:userId`: messages the receipient from body
- `GET /messages/:conversationId`: gets conversation from database.
- `GET /conversations/:userId`: Retrieves all the conversations from Database

## Models


### User

The `User` model represents registered users.


## Places API Usage

The default values for various parameters are present in the `[./constants/placesConstants.js](./constants/placesConstants.js)` file, with a comment explaining the function of the default value in some detail.

### Controllers
There are three controllers implemented here, all three directly use the Google API. The three controllers are as follows:

#### `searchPlaceFromQuery`

**Necessary Params** :
- `queryText` (_Actual text regarding the query, can be the name of the place or a part of it._)
- `fields` (_List of fields to retrieve regarding the place. **Default : ['displayName', 'id', 'formattedAddress']**_)

**Optional Params** :
- `includedType` (_List of types to retrieve regarding the place. **Default : ['restaurant', 'bar', 'cafe']**_)
- `languageCode` (_Language of the search. **Default : en**_)
- `locationBias` (_Check the docs for more info._)
- `locationRestriction` (_Check the docs for more info, you typically need to return a location object with longitude and latitude, shape and dimensions.__)
- `maxResultCount` (_Maximum number of results to retrieve. (Pagination) **Default : 10**_)
- `evOptions` (_Check the docs for more info._)
- `minRating` (_Minimum rating of the place. **Default : 0**_)
- `openNow` (_Whether the place should be open now. **Default : true**_)
- `priceLevels` (_List of price levels of the place. **Default : No Range**_)
- `rankPreference` (_Rank preference of the search. **Default : POPULARITY**_)
- `regionCode` (_Region of the search. **Default : 'us'**_)
- `strictTypeFiltering` (_Whether to use strict filtering. **Default : false**_)

---
#### `searchPlacesNearby`

**Necessary Params** :
- `latitute` (_Latitude of the location._)
- `longitude` (_Longitude of the location._)
- `fields` (_List of fields to retrieve regarding the place. **Default : ['displayName', 'location', 'businessStatus']**_)

**Optional Params**
- `radius` (_Radius of the search. **Default : 5000**_)
- `includedTypes` (_List of types to retrieve regarding the place. **Default : 'restaurant'**_)
- `includedPrimaryTypes` (_List of primary types to retrieve regarding the place. **Default : None**_)
- `excludedTypes` (_List of types to exclude regarding the place. **Default : None**_)
- `excludedPrimaryTypes` (_List of primary types to exclude regarding the place. **Default : None**_)
- `languageCode` (_Language of the search. **Default : en**_)
- `maxResultCount` (_Maximum number of results to retrieve. (Pagination) **Default : 10**_)
- `rankPreference` (_Rank preference of the search. **Default : POPULARITY**_)
- `regionCode` (_Region of the search. **Default : 'us'**_)

---
#### `getPlaceDetails`

**Necessary Params** :
- `placeId` (_ID of the place._)
- `fields` (_List of fields to retrieve regarding the place. **Default : ['displayName', 'location', 'businessStatus', 'formattedAddress']**_)

**Optional Params** :
- `languageCode` (_Language of the search. **Default : en**_)
- `sessionToken` (_Check the docs for more info._)

---

> **Usage** : A typical search usage would consist of first calling either of the query methods to obtain a list of `place` objects. Then, for a selected restaurant, a call to `getPlaceDetails` should be made along with the required fields to retrieve. Only retrieve all the details of a place if really necessary, since it is a costly operation. 


#### `getPhoto`

**Necessary Params** :
- `photoInfo` (_Name param obtained from other methods._)

**Optional Params** :
- `maxWidthPx` (_Maximum width of the photo in pixels. **Default : 400**_)
- `maxHeightPx` (_Maximum height of the photo in pixels. **Default : 400**_)

All the Place controllers are implemented in [controllers/placesControllers.js](./controllers/placesControllers.js).Whereas the corresponfing routes are implemented in [routes/placesRoutes.js](./routes/placesRoutes.js).

The `place` routes are prepended in the [index.js](./app.js) with `/places`.

So, all routes are as follows : `/places/searchPlaceFromQuery`, `/places/searchPlacesNearby`, `/places/getPlaceDetails`.

For more information about some of the routes, refer to the [docs](https://developers.google.com/maps/documentation/places/web-service/op-overview).


### Sending requests
We can send curl requests to the locally hosted server, which will be running on port 3000 by default, change the port number in the following curl commands if there has been a change.

- For `searchPlaceFromQuery`

```bash
curl -X GET -H "Content-Type: application/json" http://localhost:3000/places/querySearch\?queryText\=Burger\&maxResultCount\=2 
```

- For `searchPlacesNearby`

```bash
curl -X GET -H "Content-Type: application/json" http://localhost:3000/places/searchNearby\?latitude\=38.8719\&longitude\=-77.0563\&maxResultCount\=2
```

- For `getPlaceDetails`

```bash
curl -X GET -H "Content-Type: application/json" http://localhost:3000/places/getPlaceDetails\?placeID\=ChIJj61dQgK6j4AR4GeTYWZsKWw\&languageCode\=en
```

- For `getPhoto`

```bash
curl -X GET -H "Content-Type: application/json" http://localhost:3000/places/getPhoto\?photoInfo\=places/ChIJES5rU9dmEjkR43Eg_8WicOU/photos/AUGGfZngapbFusIEbDv2UfxCNG1DcQ_25InbQmjk1g-HITKpnBkQFeN6mi8fgV1YgxMTAgV8nretmum8Lp0GZ6aBmoNlhcS701dxGeNhZrJdaIMRqalVM1qjzcaaU4rab-Bvi61JQ73VtZxjBcz5bcFurFMWkr3_XLqoBYfV\&maxWidthPx\=1920\&maxHeightPx\=1080
```
> Note : This example contains a sample image from a sample place, if the api gives an error or no response, update the parameters.


Feel free to explore more by trying out the application!






