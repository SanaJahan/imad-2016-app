var button=document.getElementById('counter');
var counter = 0;
button.onClick = function() {
    //Make request to counter endpoint
    
    
    // Capture the response and store in a variabvle
    
    
    
    //Render the variable in correct span
    
    counter =  counter + 1;
    var span = document.getElementById('count');
    span.innerHTML=counter.toString();
};
