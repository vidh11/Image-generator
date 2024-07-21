import express, { response } from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://api.unsplash.com";
const apiKey = "5tbv8_A_1vOhREw79doNswk3K3sXaOjkKxrLnqBon28";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.render("index.ejs");
})
app.get("/about", (req, res) => {
    res.render("about.ejs");
});
app.get("/contact", (req, res) => {
    res.render("contact.ejs");
})

app.post("/search", async (req, res) => {
    try {
        const result = await axios.get(API_URL + "/search/photos", {
            params: {
                client_id: apiKey,
                query: req.body.searchWord,
                //orientation: "squarish", /*takes forever to load, couldn't find enough images for a less popular query*/
            }
        });

        const photos = result.data.results;
        if(photos.length===0){
            const val="NoImage";
            res.render("index.ejs", { link: val });
        }
        const randomSmallURL = new Set();
        const maxUniqueItems = 6;

        while (randomSmallURL.size < maxUniqueItems) {
            const randomIndex = Math.floor(Math.random() * photos.length);
            const smallURL = photos[randomIndex].urls.regular;

            // Add the smallURL to the Set if it's not already in the Set
            randomSmallURL.add(smallURL);
        }

        // Convert the Set back to an array if needed
        const randomSmallURLArray = Array.from(randomSmallURL);

        //console.log(randomSmallURLArray);
        res.render("index.ejs", { link: randomSmallURLArray, searchWord: req.body.searchWord });
    }
    catch (error) {
        console.log(error);
    }
})


app.get("/load-more", async (req, res) => {
    try {
        const page = req.query.page || 1; // Get the requested page from query params
        const result = await axios.get(API_URL + "/search/photos", {
            params: {
            client_id: apiKey,
            query: req.query.searchWord,
            page: page, // Use the requested page number
            },
        });
        //check
        //console.log("Howdy!");
  
        // Extract and return new image URLs
        const photos = result.data.results;
        const randomSmallURL = new Set();
        const maxUniqueItems = 6;

        while (randomSmallURL.size < maxUniqueItems) {
            const randomIndex = Math.floor(Math.random() * photos.length);
            const smallURL = photos[randomIndex].urls.regular;

            // Add the smallURL to the Set if it's not already in the Set
            randomSmallURL.add(smallURL);
        }

        // Convert the Set back to an array if needed
        const randomSmallURLArray = Array.from(randomSmallURL);

        res.json(randomSmallURLArray);
    }
    catch (error) {
        console.log(error);
    }
}); 

app.post("/random", async (req, res) => {
    try {
        const result = await axios.get(API_URL + "/photos/random", {
            params: {
                client_id: apiKey,
                count: 6,
                orientation: "landscape",
            }
        });

        // Create an empty array to store the "small" image URLs
        const smallImageUrls = [];

        // Loop through each photo object and extract the "small" image URL
        result.data.forEach((photo) => {
            // Check if the "small" URL exists in the photo object
            if (photo.urls && photo.urls.small) {
                // Add the "small" URL to the smallImageUrls array
                smallImageUrls.push(photo.urls.small);
            }
        });

        //console.log(smallImageUrls);
        res.render("index.ejs", { link: smallImageUrls });
    }
    catch (error) {
        console.log(error);
    }
})

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})