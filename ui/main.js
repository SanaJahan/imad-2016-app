/*var button=document.getElementById('counter');
if (button != undefined) {
button.onclick = function() {
    //Create a request
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if(request.readyState===XMLHttpRequest.DONE){
          if(request.status===200){
              var counter=request.responseText;
              var span = document.getElementById('count');
             span.innerHTML= counter.toString();
          }
      }
        
    };
    
    
    // Capture the response and store in a variabvle
    
    
    
    //Make request
    request.open('GET','http://sanajahan.imad.hasura-app.io/counter',true);
   //for local machine 
   //request.open('GET',document.URL+'counter',true);

   request.open('GET', window.location.protocol+'//'+window.location.host+'/counter', true);

   //request.open('GET', window.location.protocol+'//'+window.location.host+'/counter', true);

    request.send(null);
  
    
};
}*/

// Submit name
/*
var submit = document.getElementById('submit_btn');
if (submit != undefined) {
submit.onclick = function(){
    //make a request to server and send the names
     var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if(request.readyState===XMLHttpRequest.DONE){
          if(request.status===200){
    
    //Capture the names and render it 
    var names = request.responseText;
    names = JSON.parse(names);
    list = '';
    for(var i = 0; i<names.length;i++){
        list += '<li>'+names[i]+'</li>';
    }
    var ul = document.getElementById('namelist');
    ul.innerHTML = list;
          }
      }
          };
     //Make request
     var nameInput = document.getElementById('name');
    var name = nameInput.value;
    request.open('GET','http://sanajahan.imad.hasura-app.io/submit-name?name='+name,true);
   //for local machine 

   request.open('GET', window.location.protocol+'//'+window.location.host+'/submit-name?name='+name, true);
   //for local machine 
   //request.open('GET',document.URL+'counter',true);
    request.send(null);
};
}*/
//function for login form
var submitlogin = document.getElementById('login_btn');
if (submitlogin != undefined) {
submitlogin.onclick = function(){
    //make a request to server
     var request2 = new XMLHttpRequest();
    request2.onreadystatechange = function() {
      if(request2.readyState===XMLHttpRequest.DONE){
          if(request2.status===200){
            alert('Logged in succesfully');
             document.location.href = "/";
    }
    else if(request2.status===403){
        alert('Username/Password incorrect');
        document.getElementById('username').value="";
        document.getElementById('password').value="";
    }
     else if(request2.status===500){
        alert('Something went wrong with the server');
    }
    loadLogin();
      }
          };
     var e_username = document.getElementById('username').value;//extract from input
     var e_password = document.getElementById('password').value;
     if (e_username === '' || e_password === '') {
        alert("Username/Password field can't be left empty");
        return;
     }
     //console.log(username);
     //console.log(password);
     request2.open('POST','/login',true);
     //request2.open('POST','/login', true);
     request2.setRequestHeader('Content-Type', 'application/json');
     request2.send(JSON.stringify({username: e_username, password: e_password}));  
     submitlogin.value='logging in..';
};
}
//Register new user
var register = document.getElementById('register_btn');
   if (register != undefined) {
    register.onclick = function () {
        // Create a request object
        var request3 = new XMLHttpRequest();
        // Capture the response and store it in a variable
        request3.onreadystatechange = function () {
          if (request3.readyState === XMLHttpRequest.DONE) {
              if (request3.status === 200) {
                  alert('User created successfully');
                  document.location.href = "/loginUser";
              } else if(request3===403){
                  alert('Could not register the user');
                  register.value = 'Register';
              }
               
          }
           
        };
        // Make the request
        var newusername = document.getElementById('newusername').value;
        var newuname =  document.getElementById('newuname').value;
        var newemail =  document.getElementById('newemail').value;
        var newpassword = document.getElementById('newpassword').value;
        if(newusername === '' || newuname === '' || newemail === '' || newpassword === ''){
           alert("PLease fill up all the fields");
           }
        request3.open('POST','/create-user', true);
        request3.setRequestHeader('Content-Type', 'application/json');
        request3.send(JSON.stringify({username: newusername, name: newuname, email: newemail,  password: newpassword}));  
        register.value = 'Registering...';
    };
   }



 /*  request1.open('GET', window.location.protocol+'//'+window.location.host+'/submit-comment?comment='+comment, true);
   //for local machine 
   //request.open('GET',document.URL+'counter',true);
    request1.send(null);
};
}*/
function loadLoggedInUser (username) {
    var loginArea = document.getElementById('loginArea');
}

function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                 loadLoggedInUser(this.responseText);
            } else {
               //document.location.href = "/loginUser";
               console.log("Login failed");
            }
        }
    };
    
    request.open('GET', '/check-login', true);
    request.send(null);
}

function loadArticles () {
        // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var articles = document.getElementById('articles');
            if (request.status === 200) {
                var content = '<ul>';
                var articleData = JSON.parse(this.responseText);
                for (var i=0; i< articleData.length; i++) {
                    content += `<html>
            <head>
                <meta name = "viewport" content = "width = device-width initial-scale=1" />
                  <link rel="SHORTCUT ICON" type="image/ico" href="" /> 
                     <style>
                        #list ul li a {
                        display: inline-block;
                        top:30px;
                        padding-left: 15px;
                        padding-right: 25px;
                        padding-bottom: 15px;
                        padding-top: 15px;
                        font-size: 15px;
                        font-weight: 400;
                        color: #CC0099;
                        font-family: "Abhaya Libre";
                        text-align: center;
                        text-decoration: none;
                        text-transform: uppercase;
                        float : left;
                        margin:auto;
                    }
                     #list ul li a:hover {
                    	background: #FFCC00;
                    	color: #000;
                    	-webkit-text-stroke:1px black;
                    }
                    ul{
                        list-style-type: none;
                    }
                    body{
                         background: red; /* For browsers that do not support gradients */
                         background: -webkit-linear-gradient(#FAF2FD,#E4BFF4); /* For Safari 5.1 to 6.0 */
                         background: -o-linear-gradient(#FAF2FD,#E4BFF4); /* For Opera 11.1 to 12.0 */
                         background: -moz-linear-gradient(#FAF2FD,#E4BFF4); /* For Firefox 3.6 to 15 */
                         background: linear-gradient(#FAF2FD,#E4BFF4); /* Standard syntax */
                    }
                     </style>
                      </head>
                        <body>
                            <nav id="list">
                            <ul>
                            <li>
                    <a href="/articles/${articleData[i].title}">${articleData[i].heading}</a>
                    </li>`;
                }
                content += "</ul></nav><br><br></body>"
                articles.innerHTML = content;
            } else {
                articles.innerHTML('Oops! Could not load all articles!')
            }
        }
    };
    
    request.open('GET', '/get-articles', true);
    request.send(null);
}


// The first thing to do is to check if the user is logged in!
loadLogin();

// Now this is something that we could have directly done on the server-side using templating too!
loadArticles();

