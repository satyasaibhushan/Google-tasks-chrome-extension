import React, { useEffect, useRef } from "react";
export default function GoogleApi(props) {
  /**
   *  On load, called to load the auth2 library and API client library.
   */
  //   function handleClientLoad() {
  let authorizeButton = useRef();
  let signoutButton = useRef();

  useEffect(() => {
    function load(url) {
      return new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;
        script.src = url;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    }

    load("https://apis.google.com/js/api.js").then(_ => gapi.load("client:auth2", initClient));
  }, []);

  //   }

  /**
   *  Initializes the API client library and sets up sign-in state
   *  listeners.
   */
  function initClient() {
    gapi.client
      .init({
        clientId: CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: SCOPES,
      })
      .then(
        function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.current.onclick = handleAuthClick;
          signoutButton.current.onclick = handleSignoutClick;
        },
        function (error) {
          appendPre(JSON.stringify(error, null, 2));
        }
      );
  }
  function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
      authorizeButton.current.style.display = "none";
      signoutButton.current.style.display = "block";
    } else {
      authorizeButton.current.style.display = "block";
      signoutButton.current.style.display = "none";
    }

    props.onUpdateSignIn(isSignedIn);
  }

  /**
   *  Sign in the user upon button click.
   */
  function handleAuthClick(event) {
    gapi.auth2.getAuthInstance().signIn();
  }

  /**
   *  Sign out the user upon button click.
   */
  function handleSignoutClick(event) {
    gapi.auth2.getAuthInstance().signOut();
  }

  /**
   * Append a pre element to the body containing the given message
   * as its text node. Used to display the results of the API call.
   *
   * @param {string} message Text to be placed in pre element.
   */
  function appendPre(message) {
    var pre = document.getElementById("content");
    var textContent = document.createTextNode(message + "\n");
    pre.appendChild(textContent);
  }

  var CLIENT_ID = "236781244008-7vuna7fllcma1po5bf8ljt6e65o79hpf.apps.googleusercontent.com";

  // Array of API discovery doc URLs for APIs used by the quickstart
  var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/tasks/v1/rest"];

  // Authorization scopes required by the API; multiple scopes can be
  // included, separated by spaces.
  var SCOPES = "https://www.googleapis.com/auth/tasks";

  return (
    <div className="authorization">
      <button id="authorize_button" style={{ display: "none" }} ref={authorizeButton}>
        Authorize
      </button>
      <button id="signout_button" style={{ display: "none" }} ref={signoutButton}>
        Sign Out
      </button>

      <pre id="content" style={{ whiteSpace: "pre-wrap" }}></pre>
    </div>
  );
}
