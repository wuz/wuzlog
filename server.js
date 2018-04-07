/* SETUP */
// Let's get our requires in order 
// We're using express as our server backend, with pug to render html.
// markdown is rendered using the marked plugin
// we also need fs (filesystem) to interact with the posts/ folder
const express = require('express');
const fs = require('fs');
const marked = require('marked');
const pug = require('pug');

// create our app
const app = express();

// set our view engine to pug
// this makes express's .render function use pug
app.set('view engine', 'pug');

// we use expresses static middleware to serve the public folder
// this lets us use prism.js for code highlighting and serve our style.css file
app.use(express.static('public'));

/* UTILS */

// this function parses our .md files into titles. 
// This isn't the _greatest_ way to do this, but it works.
// There are a lot of breaking possibilities here (like hyphenated words in the title)
const parseFilename = (file) => {
  const filename = file.slice(0, -3);
  return {
    path: filename,
    name: filename.split('-').map(word => word.toUpperCase()).join(' ')
  }
}

// Our drafts system just starts a draft with a leading '.'
// Simple and unix-y
const filterDrafts = (file) => file[0] !== '.';

/* ROUTING */

// This is the blog's index page.
// We want to serve our views/index.pug page and
// populate it with some data
app.get("/", (req, res) => {
  fs.readdir(__dirname + '/posts', (err, files) => {
    // Get all the posts in a nice functional way.
    // First filter out all the drafts,
    // then we parse all the file names
    const posts = files.filter(filterDrafts).map(parseFilename);
    // Pass in the template file and a config
    // We set the title of the blog here and send the posts variable
    res.render('index', { title: 'Not a Blog - By someone too busy to write one', posts });
  });
})

// This is the individual page for each post
app.get("/p/:name", (req, res) => {
  // First get the file associated with the page
  // Right now, there is no 404 or error page. That needs to be made
  const filename = `/posts/${req.params.name}.md`;
  // Use fs.readFile to get the contents of the file
  fs.readFile(__dirname + filename, 'utf8', (err, file) => {
    // use array desctruturing to pull out some meta data and keep the rest of the content
    const [title, created, tags, ...content] = file.split('\n')
    // now we render the post using the views/post.pug template. 
    // All our metadata is passed in and our content is served
    // the substrs remove the == from our metadata (see a post to see how this works)
    res.render('post', { 
      content: content.join('\n'), 
      created: created.substr(2), 
      tags: tags.substr(2), 
      marked: marked, 
      title: title.substr(2)
    });
  });
});

/* HOST */
// finally, we set up the application for on the PORT provided by Glitch
const listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`)
})
