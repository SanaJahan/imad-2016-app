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
                <link rel="stylesheet"
                 href="https://fonts.googleapis.com/css?family=Baloo Tamma|David Libre|Open Sans Condensed|Ubuntu|Pavanam|Pacifico">
            </head>
            <body>
                <div id="articles">
                </div>
                <br><br>
                <center><h1>${heading}</h1></center>
                <div>
                    <p align="right">${date.toDateString()}</p><br><br>
                </div>
                <div style="font-family: Pacifico;font-size: 1.5em">
                   ${content}
                </div>
                <br><hr>
                <i><h4>Comments</h4></i>
              <div id="comment_form">
               <p id="isLogged"></p>
              </div>
              <div id="comments">
                <center>Loading comments...</center>
              </div>
          </div>
          <script type="text/javascript" src="/ui/article.js"></script>
          <script type="text/javascript" src="/ui/main.js"></script>
      </bod>
            
        </html> ` ;
        return htmlTemplate;
}
        
function createFormTemplate(){
        var htmlFormTemplate =  `<html>
            <head>
                <title>Login</title>
                <meta name = "viewport" content = "width = device-width initial-scale=1" />
                  <link rel="SHORTCUT ICON" type="image/ico" href="" /> 
               <style>
.button {
  display: inline-block;
  padding: 15px 25px;
  font-size: 24px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  outline: none;
  color: #fff;
  background-color: #4CAF50;
  border: none;
  border-radius: 15px;
  box-shadow: 0 9px #999;
}

.button:hover {background-color: #3e8e41}

.button:active {
  background-color: #3e8e41;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}
input[type=text] {
    border: 2px solid red;
    border-radius: 4px;
    width: 50%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    border: 1px solid #555;
    outline: none;
}
input[type=text]:focus {
    background-color: #D0CCCB;
}
input[type=password] {
    border: 2px solid red;
    border-radius: 4px;
    width: 50%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    border: 1px solid #555;
    outline: none;
}
input[type=password]:focus {
    background-color: #D0CCCB ;
}
 #main ul li a {
    display: block;
    top:30px;
    padding-left: 15px;
    padding-right: 25px;
    padding-bottom: 15px;
    padding-top: 15px;
    font-size: 15px;
    font-weight: 400;
    color: #080808;
    font-family: "Abhaya Libre";
    text-align: center;
    text-decoration: none;
    text-transform: uppercase;
    float : right;
    margin:auto;
}
 #main ul li a:hover {
	background: #fff;
	color: #000;
	-webkit-text-stroke:1px black;
}
ul{
    list-style-type: none;
}
</style>
                
            </head>
            <body bgcolor= "#F4F4F1">
                <nav id="main">
                <ul>
                <li><a href="index.html">Home</a></li>
                <li><a href="#">Contact</a></li>
                <li><a href="#">Articles</a></li>
                <li><a href="#">Profile</a></li>
                </ul>
                </nav>
                <br><br>
                <h1><center><u>Welcome to IMAD</u></center></h1><br>
                    <div id="loginArea">
                     <center> <label for="username"><font size ="+2">Enter UserName :  </font></label><br>
                     <input type="text" id ="username" placeholder="Enter user name"/><br><br/>
                     <label for="password"><font size ="+2">Enter Password : </font></label><br>
                     <input type="password" id ="password" placeholder = "Enter password"/><br><br>
                     <button class = "button " id ="login_btn"> Login </button>  </center>                            
            <br>
                    <center><a href = "/newUser">New User? Sign Up </a> </center>
                <br><hr></div>
               <script type="text/javascript" src="/ui/main.js">
        </script>
            </body>
        </html> ` ;
        return htmlFormTemplate;
}
function createNewFormTemplate(){
        var htmlNewFormTemplate =  `<html>
            <head>
                <title>Sign Up</title>
                <meta name = "viewport" content = "width = device-width initial-scale=1" />
                  <link rel="SHORTCUT ICON" type="image/ico" href="" /> 
                     <style>
.button {
  display: inline-block;
  padding: 15px 25px;
  font-size: 24px;
  cursor: pointer;
  text-align: center;
  text-decoration: none;
  outline: none;
  color: #fff;
  background-color: #4CAF50;
  border: none;
  border-radius: 15px;
  box-shadow: 0 9px #999;
}

.button:hover {background-color: #3e8e41}

.button:active {
  background-color: #3e8e41;
  box-shadow: 0 5px #666;
  transform: translateY(4px);
}
input[type=text] {
    border: 2px solid red;
    border-radius: 4px;
    width: 50%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    border: 1px solid #555;
    outline: none;
}
input[type=text]:focus {
    background-color: lightblue;
}
input[type=password] {
    border: 2px solid red;
    border-radius: 4px;
    width: 50%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    border: 1px solid #555;
    outline: none;
}
input[type=password]:focus {
    background-color: lightblue;
}
input[type=email] {
    border: 2px solid red;
    border-radius: 4px;
    width: 50%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    border: 1px solid #555;
    outline: none;
}
input[type=email]:focus {
    background-color: lightblue;
}
</style>
                
            </head>
            <body>
                <div class=container-articles>
                    <a href="/">Home</a>
                </div>
                <hr />
                <h1>Welcome to IMAD</h1>
                <div id="login_area">
                   <p align = "center"><label> ENTER YOUR USERNAME: </label><br>
                    <input type="text" id="newusername" placeholder="Your user name" /><br /><br/>
                    <label> ENTER YOUR NAME: </label><br>
                    <input type="text" id="newuname" placeholder="Your good name" /></br><br>
                    <label> ENTER YOUR EMAIL:   </label><br>
                    <input type="email" id="newemail" placeholder="Your email" /><br /><br/>
                    <label> ENTER PASSWORD: </label><br>
                    <input type="password" id="newpassword" placeholder = "Create a new password" /></p>
        <br/><br/>
        <p align = "center"><button class="button" id="register_btn"/>Register</button> </p>                             
            <br>
                    <center><a href = "/loginUser">Already have an account? Sign In </a> </center>
                </div>
                <br><hr>
               <script type="text/javascript" src="/ui/main.js">
        </script>
            </body>
        </html> ` ;
        return htmlNewFormTemplate;
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
        res.status(403).send('No such user exists');
      }
      else{
        var dbString = result.rows[0].password;
        var salt = dbString.split('$')[2];
        var hashedPassword = hash(password,salt);
        if(hashedPassword===dbString){
          req.session.auth = {userId: result.rows[0].id,username: result.rows[0].username};
          res.send('Credentials correct !');
        }
        else{
          res.status(403).send('Credentials incorrect');
    
    }
      }
    }
  });
});
app.get('/loginUser',function(req,res){
    res.send(createFormTemplate());
       });
app.get('/newUser',function(req,res){
    res.send(createNewFormTemplate());
       });
app.get('/check-login',function(req,res){
   if(req.session && req.session.auth && req.session.auth.userId){
       res.send(req.session.auth.username.toString());
   }
   else{
       res.send('You are not looged in');
   }
});

app.get('/logout',function(req,res){
    delete req.session.auth;
    res.send('<html><body>Logged out successfully!<br/><br/><a href="/">Back to home</a></body></html>');
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
app.get('/get-articles',function(req,res){
    pool.query('SELECT * FROM article ORDER BY date DESC' , function (err,result){
    if(err){
        res.status(500).send(err.toString());
    }
    else {
        res.send(JSON.stringify(result.rows));
    }
   });
});
app.get('/get-comments/:articleName',function(req,res){
    // make a select request
   // return a response with the results
   pool.query('SELECT comment.*, "user".username FROM article, comment, "user" WHERE article.title = $1 AND article.id = comment.article_id AND comment.user_id = "user".id ORDER BY comment.timestamp DESC', [req.params.articleName], function (err, result) {
      if (err) {
          res.status(500).send(err.toString());
      } else {
          res.send(JSON.stringify(result.rows));
      }
   });
});

app.post('/submit-comment/:articleName', function (req, res) {
   // Check if the user is logged in
    if (req.session && req.session.auth && req.session.auth.userId) {
        // First check if the article exists and get the article-id
        pool.query('SELECT * from article where title = $1', [req.params.articleName], function (err, result) {
            if (err) {
                res.status(500).send(err.toString());
            } else {
                if (result.rows.length === 0) {
                    res.status(400).send('Article not found');
                } else {
                    var articleId = result.rows[0].id;
                    // Now insert the right comment for this article
                    pool.query(
                        "INSERT INTO comment (comment, article_id, user_id) VALUES ($1, $2, $3)",
                        [req.body.comment, articleId, req.session.auth.userId],
                        function (err, result) {
                            if (err) {
                                res.status(500).send(err.toString());
                            } else {
                                res.status(200).send('Comment inserted!')
                            }
                        });
                }
            }
       });     
    } else {
        res.status(403).send('Only logged in users can comment');
    }
});

        
/* Creating the counter button
var counter=0;
app.get('/counter',function(req,res) {
    counter = counter + 1;
    res.send(counter.toString());
});
*/
/* Creating the name storing and retrieving function 
var names = [];
app.get('/submit-name',function(req,res){
   var name = req.query.name;//query does  is -> url ://submit-name?name=xxxxx;
   
   names.push(name);
   
   res.send(JSON.stringify(names));
});*/
/*  HANDLING COMMENTS REQUEST RESPONSE
var comments = [];
app.get('/submit-comment',function(req,res){
   var comment = req.query.comment;//query does  is -> url ://submit-comment?comment=xxxxx;
   var time = Date.now();
    if (comments === undefined)
        comments = [];  
        comments.push(comment);
        res.send(JSON.stringify(comments));
    
    /*
   
  pool.query('INSERT INTO "comment" (article_id,user_id,comment,timestamp) VALUES ($1,$2,$3,$4)',[username,uname,comment,time],function(err,result){
     if(err){
           res.status(500).send(err.toString());
       }
       else{
        res.send('User created succesfully '+ username);
     }
  });
});
    
});
app.get('/fetchcomments', function(req, res) {
  var comment = req.query.comment;
  if (comments !== undefined)
    res.send(JSON.stringify(comments));
  else {
    res.send("null");
  }
});*/
app.get('/ui/main.js', function (req, res) {
res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});
//When not using database then creating end-point to handle articel request response
/*app.get('/:articleName', function (req, res) {
    var articleName=req.params.articleName;
  res.send(createTemplate(articles[articleName]));
});*/

/*app.get('/ui/login.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'login.html'));
});*/
app.get('/ui/article.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'article.js'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});
app.get('/favicon.ico', function(req, res){
    res.sendFile(path.join(__dirname, 'ui', 'favicon.ico'));
});
app.get('/ui/stock-vector-vector-illustration-of-paper-scroll-with-feather-pen-and-ink-pot-on-white-background-103939787.jpg',function(req,res){
    res.sendFile(path.join(__dirname,'ui','stock-vector-vector-illustration-of-paper-scroll-with-feather-pen-and-ink-pot-on-white-background-103939787.jpg'));
});

var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`blog app listening on port ${port}!`);
});
