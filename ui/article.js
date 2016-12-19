// Eg: sanajahan.imad.hasura-app.io/articles/article-one will result in article-one
var currentArticleTitle = window.location.pathname.split('/')[2];

function loadCommentForm () {
    var commentFormHtml = `
        <textarea id="comment_text" rows="6" cols="60" placeholder="Enter your comment here..."></textarea>
        <br/><br/>
       <style>#submit{
              display: inline-block;
              padding: 10px 15px;
              font-size: 20px;
              cursor: pointer;
              text-align: center;
              text-decoration: none;
              outline: none;
              color: #fff;
              background-color: #CC00FF;
              border: none;
              border-radius: 15px;
              box-shadow: 0 9px #999;
            }
            
            #submit:hover {background-color: #CC00CC;}
            
            #submit:active {
              background-color: #CC00FF;
              box-shadow: 0 5px #666;
              transform: translateY(4px);
            }</style>
        <input type="submit" id="submit" value="Submit" />
        <br/>
        `;
    document.getElementById('comment_form').innerHTML = commentFormHtml;
    
    // Submit username/password to login
    var submit = document.getElementById('submit');
    submit.onclick = function () {
        // Create a request object
        var request = new XMLHttpRequest();
        
        // Capture the response and store it in a variable
        request.onreadystatechange = function () {
          if (request.readyState === XMLHttpRequest.DONE) {
                // Take some action
                if (request.status === 200) {
                    // clear the form & reload all the comments
                    document.getElementById('comment_text').value = '';
                    loadComments();  
                    
                } else {
                    alert('Please Login to comment');
                     //document.location.href = "/loginUser";
                }
                submit.value = 'Submit';
          }
        };
        
        // Make the request
        var comment = document.getElementById('comment_text').value;
        request.open('POST', '/submit-comment/' + currentArticleTitle, true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.send(JSON.stringify({comment:comment}));  
        submit.value = 'Submitting...';
        
    };
}

function loadLogin () {
    // Check if the user is already logged in
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                loadCommentForm(this.responseText);
                
            }
        }
    };
    
    request.open('GET', '/check-login', true);
    request.send(null);
}

function escapeHTML (text)
{
    var $text = document.createTextNode(text);
    var $div = document.createElement('div');
    $div.appendChild($text);
    return $div.innerHTML;
}

function loadComments () {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var comments = document.getElementById('comments');
            if (request.status === 200) {
                var content = '';
                var commentsData = JSON.parse(this.responseText);
                for (var i=0; i< commentsData.length; i++) {
                    var time = new Date(commentsData[i].timestamp);
                    content += `<style>
                    .commenter{
                        color: #fff;
                        font-size: 1.5em;
                        font-weight: bold;
                        font-family: Helvetica;
                        text-shadow: 0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb, 0 4px 0 #b9b9b9, 0 5px 0 #aaa, 0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15);
                        }

                        .commenter {
                          text-align: left;
                        }
                    </style>
                        <div class="comment">
                         <div class="commenter">
                         <br>
                          ${commentsData[i].username} - ${time.toLocaleTimeString()} on ${time.toLocaleDateString()} says-:
                         </div>
                          <p style="font-size: 1.2em"> " ${escapeHTML(commentsData[i].comment)} "</p>
                    </div>`;
                }
                comments.innerHTML = content;
            } else {
                comments.innerHTML('Oops! Could not load comments!');
            }
        }
    };
    
    request.open('GET', '/get-comments/' + currentArticleTitle, true);
    request.send(null);
}


// The first thing to do is to check if the user is logged in!
loadLogin();
loadComments();
