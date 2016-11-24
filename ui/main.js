var button=document.getElementById('counter');
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
}

// Submit name

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
}
//Ui for login form
/*var submitlogin = document.getElementById('login_btn');
if (submitlogin !== undefined) {
submitlogin.onclick = function(){
    //make a request to server and send the names
     var request2 = new XMLHttpRequest();
    request2.onreadystatechange = function() {
      if(request2.readyState===XMLHttpRequest.DONE){
          if(request2.status===200){
            alert('Logged in succesfully');
             document.location.href = "/";
    }
    else if(request2.status===403){
        alert('Username/Password incorrect');
    }
     else if(request2.status===500){
        alert('Something went wrong with the server');
    }
          //loadLoginForm();
      }
        
          };
     var username = document.getElementById('username').value;//extract from input
     var password = document.getElementById('password').value;
     console.log(username);
     console.log(password);
     request2.open('POST','/login',true);
     //request2.open('POST','/login', true);
     request2.setRequestHeader('Content-Type', 'application/json');
     request2.send(JSON.stringify({username: username, password: password}));  
};
}*/
//Register new user
var register = document.getElementById('register_btn');
   if (submitlogin !== undefined) {
    register.onclick = function () {
        // Create a request object
        var request3 = new XMLHttpRequest();
        // Capture the response and store it in a variable
        request3.onreadystatechange = function () {
          if (request3.readyState === XMLHttpRequest.DONE) {
              if (request3.status === 200) {
                  alert('User created successfully');
                  document.location.href = "/";
              } else if(request3===403){
                  alert('Could not register the user');
                  register.value = 'Register';
              }
               
          }
           
        };
        // Make the request
        var username = document.getElementById('newusername').value;
        var uname =  document.getElementById('newuname').value;
        var email =  document.getElementById('newemail').value;
        var password = document.getElementById('newpassword').value;
        request3.open('POST','/create-user', true);
        request3.setRequestHeader('Content-Type', 'application/json');
        request3.send(JSON.stringify({username: newusername, uname: newuname, email: newemail,  password: newpassword}));  
        register.value = 'Registering...';
    };
   }


// Submit a comment
var commentbtn = document.getElementById('comment-button');
if (commentbtn !== undefined) {
commentbtn.onclick = function(){
    //Make request to server to send the comments
    var request1 = new XMLHttpRequest();
    request1.onreadystatechange = function (){
        if(request1.readyState===XMLHttpRequest.DONE){
            if(request1.status===200){
    //Store the comments and display on the page
    var comments = request1.responseText;
        comments = JSON.parse(comments);
        list_comment = '';
        for(var j = 0; j<comments.length;j++){
            list_comment += '<li>'+comments[j]+'</li>';
        }
            var ul1 = document.getElementById('commentlist');
            ul1.innerHTML = list_comment;
            }
        }
    };
    
   
    //Make request to capture the comment
    var commentInput = document.getElementById('comment');
    var comment = commentInput.value;
     request1.open('GET','http://sanajahan.imad.hasura-app.io/submit-comment?comment='+comment,true);
   //for local machine 

   request1.open('GET', window.location.protocol+'//'+window.location.host+'/submit-comment?comment='+comment, true);
   //for local machine 
   //request.open('GET',document.URL+'counter',true);
    request1.send(null);
};
}
