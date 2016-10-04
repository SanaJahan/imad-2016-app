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
   // request.open('GET','http://sanajahan.imad.hasura-app.io/counter',true);
   //for local machine 
   request.open('GET',document.URL+'counter',true);
    request.send(null);
  
    
};
