const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const sanitize = require("express-sanitizer");
const app = express();

app.use(methodOverride("_method"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(sanitize());
app.use(express.static("public"));
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/beer_blog", {
    useMongoClient: true
});

// Beer Schema
let beerSchema = new mongoose.Schema({
    name: String,
    brewery: String,
    location: String,
    image: String,
    style: String,
    review: String,
    rating: Number,
    reviewDate: { type: Date, default: Date.now }
});

let Beer = mongoose.model("beer", beerSchema);

// Beer.create({
//   name: "Kiwi Blonde",
//   brewery: "Tongtongee Brewing Company",
//   location: "Seoul, Korea",
//   image:
//     "https://images.unsplash.com/photo-1501697384182-474853d67ea0?auto=format&fit=crop&w=1191&q=60&ixid=dW5zcGxhc2guY29tOzs7Ozs%3D",
//   style: "American Blonde",
//   review:
//     "Chillwave actually raclette chartreuse lomo intelligentsia beard sustainable mustache whatever pickled. Marfa pok pok gastropub yr williamsburg godard trust fund chambray cliche etsy ennui portland roof party blog pop-up. Chambray glossier roof party slow-carb. Flannel post-ironic crucifix schlitz quinoa, tofu messenger bag la croix mixtape edison bulb man braid chambray.Semiotics fixie bicycle rights cliche paleo pitchfork fanny pack VHS retro deep v slow-carb chia PBR&B. Actually try-hard hella, crucifix vexillologist hell of cronut forage mustache jean shorts af kickstarter hoodie whatever. Fixie hashtag fingerstache small batch echo park meggings, waistcoat live-edge flexitarian mlkshk air plant kale chips heirloom normcore retro. Squid sartorial celiac listicle, church-key knausgaard cronut. Yuccie tumblr ramps twee cardigan air plant lo-fi live-edge. You probably haven't heard of them tousled unicorn vegan ugh cred copper mug trust fund neutra roof party pour-over master cleanse. Craft beer hammock try-hard celiac mixtape organic, twee you probably haven't heard of them whatever."
// });

// Redirect from Root Page
app.get('/', function(req, res) {
    res.redirect("/beers");
});

// Create New Beer Review
// New Beer Form
app.get("/beers/new", function(req, res) {
    res.render("new");
});


//Render Beer Index Page
app.get('/beers', function(req, res) {
    Beer.find({}, (err, beers) => {
        if (err) {
            console.log("ERROR");
        } else {
            res.render("index", { beers: beers });
        }
    });
});

//Show Beer Page
app.get("/beers/:id", function(req, res) {
    Beer.findById(req.params.id, (err, foundBeer) => {
        if (err) {
            res.redirect("/beers");
        } else {
            res.render("show", { beer: foundBeer });
        }
    });
});

//Edit Beer Page
app.get("/beers/:id/edit", function(req, res) {
    Beer.findById(req.params.id, (err, foundBeer) => {
        if (err) {
          res.redirect("/beers");
        } else {
          res.render("edit", { beer: foundBeer });
        }
    });    
});

//Submit New Beer Page
app.post('/beers/', function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Beer.create(req.body.beer, (err, newBeer) => {
        if (err) {
            res.render("new");
        } else {
            res.redirect("/beers");
        }
    });
});

//Update Beer
app.put('/beers/:id/', function(req, res) {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Beer.findByIdAndUpdate(req.params.id, req.body.beer, (err, updatedBeer) => {
        if (err) {
            res.redirect("/beers");
        } else {
            res.redirect("/beers/" + req.params.id);
        }
    });
});

//Destroy Beer
app.delete("/beers/:id", function(req, res) {
  Beer.findByIdAndRemove(req.params.id, err => {
    if (err) {
      res.redirect("/beers");
    } else {
      res.redirect("/beers");
    }
  });
});

//Listen Server Function
app.listen(3000, function() {
    console.log('App listening on port 3000!');
});