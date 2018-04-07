== Moving my blog to Glitch
== 04/02/2018
== blog, personal

## TLDR: I just moved my blog from my website on to Glitch!

I love what the Glitch team is doing to make coding more accessible for everyone. Their software makes it incredibly easy to hack together a quick blog engine! The best part? Anyone can [remix](https://glitch.com/edit/#!/remix/wuzlog) and create their own blog or website.

The code is pretty simple and anyone can add it. Want a feature? It shouldn't be hard to add it! The bulk of the work is done here:

```js
app.get("/", (req, res) => {
  fs.readdir(__dirname + '/posts', (err, files) => {
    res.render('index', { title: 'Not a Blog - By someone too busy to write one', posts: files.map(parseFilename) });
  });
})

app.get("/p/:name", (req, res) => {
  const filename = `/posts/${req.params.name}.md`;
  fs.readFile(__dirname + filename, 'utf8', (err, file) => {
    const [title, created, tags, ...restFile] = file.split('\n')
    res.render('post', { 
      content: restFile.join('\n'), 
      created: created.substr(2), 
      tags: tags.substr(2), 
      marked: marked, 
      title: title.substr(2)
    });
  });
});
```

Moving forward, I hope to be moving lots of my JS projects to Glitch.

Cheers!

Wuz