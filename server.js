var express = require('express');
var morgan = require('morgan');
var path = require('path');
var session = require('express-session');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var config = {
    user : 'sanajahan',
    database: 'sanajahan',
    host: 'db.imad.hasura-app.io',
    port: '5432',
    password: process.env.DB_PASSWORD
};
var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret: 'someRandomtext',
    cookie: {maxAge: 1000*60*60*24*30}
}));


function createTemplate(data){
    var title = data.title;
    var heading = data.heading;
    var date = data.date;
    var content = data.content;

        var htmlTemplate =  `<html>
            <head>
                <title>${title}</title>
                <meta name = "viewport" content = "width = device-width initial-scale=1" />
                  <link rel="SHORTCUT ICON" type="image/ico" href="" /> 
                <link href="/ui/style.css" rel="stylesheet" />
            </head>
            <body>
                <div class=container-articles>
                    <a href="/">Home</a>
                </div>
                <hr />
                <h1>${heading}</h1>
                <div>
                    ${date.toDateString()}
                </div>
                <div>
                   ${content}
                </div>
                <br><hr>
                  <div class = "commentbox">
                <ul id="commentlist">
                    
                </ul>
               <p align = "center"> <textarea id = "comment" rows = "8" tabindex = "4" placeholder = "Add a public comment" ></textarea> </p>
               <br>
               <p align = "center"><button id = "comment-button" >Submit</button></p>
            </div> 
               <script type="text/javascript" src="/ui/main.js">
        </script>
            </body>
            
            
        </html> ` ;
        return htmlTemplate;
}
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
// Testing connection to the database
var pool = new Pool(config);
/*app.get('/test',function(req,res){
   //make a select request and return result set
   pool.query('SELECT * FROM test',function(err,result){
       if(err){
           res.status(500).send(err.toString());
       }
       else{
           res.send(JSON.stringify(result.rows));
       }
       });
       403 is the FORBIDDEN STATUS

});*/
//CREATING FUNCTION TO HASH THE PASSWORD
function hash(input,salt){
  var hashed = crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
 return ["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
 //return hashed.toString('hex');
}
app.get('/hash/:input', function(req, res) {
   var hashedString = hash(req.params.input, 'this-is-some-random-string');
   res.send(hashedString);
});

//INSERTING THE USERNAME PASSWORD N DETAILS FOR REGISTRATION


app.post('/create-user',function(req,res){
  var username = req.body.username;
  var uname = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var salt = crypto.randomBytes(128).toString('hex');
  var dbString = hash(password,salt);
  pool.query('INSERT INTO "user" (username,name,email,password) VALUES ($1,$2,$3,$4)',[username,uname,email,dbString],function(err,result){
     if(err){
           res.status(500).send(err.toString());
       }
       else{
        res.send('User created succesfully '+ username);
     }
  });
});
app.post('/login',function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  pool.query('SELECT * FROM "user" WHERE username = $1',[username],function(err,result){
    if(err){
      res.status(500).send(err.toString());
    }
    else{
      if(result.rows.length===0){
        res.status(403).send('Username/Password invalid');
      }
      else{
        var dbString = result.rows[0].password;
        var salt = dbString.split('$')[2];
        var hashedPassword = hash(password,salt);
        if(hashedPassword===dbString){
          req.session.auth = {userId: result.rows[0].id};
          res.send('Credentials correct !');
        }
        else{
          res.status(403).send('Credentials incorrect');
    
    }
      }
    }
  });
});

app.get('/check-login',function(req,res){
   if(req.session && req.session.auth && req.session.auth.userId){
       res.send('You are logged in :'+req.session.auth.name.toString());
   }
   else{
       res.send('You are not logged in');
   }
});

app.get('/logout',function(req,res){
    delete req.session.auth;
    res.send('Yourare logged out successfully');
});


app.get('/articles/:articleName',function(req,res){
   //make a select request and return result set
   pool.query("SELECT * FROM article WHERE title = $1",[req.params.articleName],function(err,result){
       if(err){
           res.status(500).send(err.toString());
       }
       else{
        if(result.rows.length===0){
          res.status(404).send('Article not found');
        }
        else{
          var articleData = result.rows[0];
          res.send(createTemplate(articleData));
       }
     }
       });
       

});

var counter=0;
app.get('/counter',function(req,res) {
    counter = counter + 1;
    res.send(counter.toString());
});

var names = [];
app.get('/submit-name',function(req,res){
   var name = req.query.name;//query does  is -> url ://submit-name?name=xxxxx;
   
   names.push(name);
   
   res.send(JSON.stringify(names));
});
//  HANDLING COMMENTS REQUEST RESPONSE
var comments = [];
app.get('/submit-comment',function(req,res){
   var comment = req.query.comment;//query does  is -> url ://submit-comment?comment=xxxxx;
    if (comments == undefined)
  comments = [];  
  comments.push(comment);
   res.send(JSON.stringify(comments));
});
app.get('/fetchcomments', function(req, res) {
  var comment = req.query.comment;
  if (comments != undefined)
    res.send(JSON.stringify(comments));
  else {
    res.send("null");
  }
});
app.get('/ui/main.js', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});
//When not using database then creating end-point to handle articel request response
/*app.get('/:articleName', function (req, res) {
    var articleName=req.params.articleName;
  res.send(createTemplate(articles[articleName]));
});*/



app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
app.get('/favicon.ico', function(req, res){
    res.sendFile(path.join(__dirname, 'ui', 'favicon.ico'));
});


var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
