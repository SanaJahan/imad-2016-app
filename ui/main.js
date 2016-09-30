var button=document.getElementById('counter');
button.onclick = function() {
    //Create a request
    
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if(request.readystate===XMLHttpRequest.DONE){
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
    request.send(null);
  
    
};
// submit name
var inputName = document.getElementById('name');
var submit = document.getElementById('submit_btn');
submit.onlclick = function(){
    //
};