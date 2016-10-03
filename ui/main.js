var button=document.getElementById('counter');
var counter = 0;
button.onclick = function() {
    //Create a request
    counter  = counter + 1;
    var span = document.getElementById('count');
             span.innerHTML= counter.toString();
};
  /*  var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
      if(request.readyState===XMLHttpRequest.DONE){
          if(request.status===200){
              var counter=request.responseText;
              var span = document.getElementById('count');
             span.innerHTML= counter.toString();
          }
      }
        
    };
    
    
    // Capture the response and store in a variable
    
    
    
    //Make request
    request.open('GET','http://sanajahan.imad.hasura-app.io/counter',true);
    request.send(null);
  
    
};*/
// submit name
/*var inputName = document.getElementById('name');
var submit = document.getElementById('submit_btn');
submit.onlclick = function(){
    //
    var names= ['name1','name2','name3'];
    var list = '';
    for(var i = 0; i <names.length; i++){
        list+='<li>'+names[i]+'</li>';
    }
    var ul = document.getElementById('namelist');
    ul.innerHTML = list;
};*/