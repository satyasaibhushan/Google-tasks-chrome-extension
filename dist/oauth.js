window.onload = function() {
    document.querySelector('button').addEventListener('click', function() {
      chrome.identity.getAuthToken({interactive: true}, function(token) {
        gapi.auth.setToken({
          'access_token': token,
        });
        console.log(gapi,token)
  
      });
    });
  };