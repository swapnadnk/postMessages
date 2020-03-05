const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Post = require('./models/post');

const app = express();

mongoose.connect(
    "mongodb+srv://swapnadnk:SaPiSqaOyFpJ829w@cluster0-uyfw3.mongodb.net/node-angular?retryWrites=true&w=majority", 
    { useNewUrlParser: true,
        useUnifiedTopology: true
    })
.then(()=>{
    console.log("Connected to MongoDB");
})
.catch(()=>{
    console.log("Connection failed!");
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept'
        );
    res.setHeader(
    'Access-Control-Allow-Methods', 
    'POST, GET, PATCH, DELETE, OPTIONS'
    );
    next();
});

app.post('/api/posts', (req, res, next)=>{
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save()
    .then(result=>{
        res.status(201).json({
            postId: result._id,
            message: "Post added successfully"
        })
    });
    
})

app.get('/api/posts',(req, res, next)=>{
    Post.find()
    .then(documents=>{
        res.status(200).json({
            message: 'Posts fetched sucessfully',
            posts: documents
        });
    });
    
});

app.delete('/api/posts/:id', (req,res,next)=>{
    Post.deleteOne({
        _id: req.params.id
    })
    .then((result)=>{
        console.log(result);
        res.status(200).json({
            message: "Post deleted!"
        });
    })
})

module.exports = app;