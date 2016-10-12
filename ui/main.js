var button=document.getElementById('counter');
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
    request.send(null);
  
    
};
// Submit name

var submit = document.getElementById('submit-btn');
submit.onclick = function(){
    //make a request to server and send the names
     var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if(request.readyState===XMLHttpRequest.DONE){
          if(request.status===200){
    
    //Capture the names and render it 
    var names = request.responseText;
    names = JSON.parse(names);
    for(var i = 0; i<names.length;i++){
        list += '<li>'+names[i]+'</li>';
    }
    var ul = document.getElementById(namelist);
    ul.innerHTML = list;
          }
      }
          };
     //Make request
     var nameInput = document.getElementById('name');
    var name = nameInput.value;
    request.open('GET','http://sanajahan.imad.hasura-app.io/submit-name?name='+name,true);
   //for local machine 
   //request.open('GET',document.URL+'counter',true);
    request.send(null);
};