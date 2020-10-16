import firebase from "firebase";

export function getStartToken(messaging) {
  messaging
    .getToken()
    .then((currentToken) => {
      console.log({
        currentToken,
      });
      if (currentToken) {
        // sendTokenToServer(currentToken)
      } else {
        RequestPermission(messaging);
        setTokenSentToServer(false);
      }
    })
    .catch(() => {
      setTokenSentToServer(false);
      console.log("error ocurred");
    });
}
function RequestPermission(messaging) {
  messaging
    .requestPermission()
    .then(function(permission) {
      if (permission === "granted") {
        console.log("have Permission");
        // calls method again and to sent token to server
        getStartToken();
      } else {
        console.log("Permission Denied");
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

// function isTokensendTokenToServer() {
//   return window.localStorage.getItem("sendTokenToServer") === "1";
// }
function setTokenSentToServer(sent) {
  window.localStorage.setItem("sendTokenToServer", sent ? "1" : "0");
}

function tokenRefreshed(messaging) {
  messaging.onTokenRefresh(function() {
    messaging
      .getToken()
      .then(function(refreshedToken) {
        console.log("Token refreshed.", refreshedToken);
        setTokenSentToServer(false);
        // sendTokenToServer(refreshedToken)
      })
      .catch(function(err) {
        console.log("Unable to retrieve refreshed token ", err);
      });
  });
}

function isNewNotificationSupported() {
  if (!window.Notification || !Notification.requestPermission) return false;
  if (Notification.permission == "granted")
    throw new Error(
      "You must only call this *before* calling Notification.requestPermission(), otherwise this feature detect would bug the user with an actual notification!"
    );
  try {
    new Notification("");
  } catch (e) {
    if (e.name == "TypeError") return false;
  }
  return true;
}
export const initializeFirebase = () => {
  firebase.initializeApp({
    apiKey: "AIzaSyA5IChtWkbmS5UuQ7cSp6grrt5WEwHRmMo",
    authDomain: "testing-cloud-functions1.firebaseapp.com",
    databaseURL: "https://testing-cloud-functions1.firebaseio.com",
    projectId: "testing-cloud-functions1",
    storageBucket: "testing-cloud-functions1.appspot.com",
    messagingSenderId: "777178200281",
    appId: "1:777178200281:web:a7b2dee7866bdbb054e6c8",
    measurementId: "G-LZKEG4MCHR",
  });
  const messaging = firebase.messaging();
  // Custom function made to run firebase service
  getStartToken(messaging);
  tokenRefreshed(messaging);
  // This code recieve message from server /your app and print message to console if same tab is opened as of project in browser
  messaging.onMessage(function(payload) {
    console.log("on Message", payload);
    if (window.Notification && Notification.permission == "granted") {
      console.log('notification showed')
      new Notification(payload.data.title, {
        ...payload.data,
      });
    } else if (isNewNotificationSupported()) {
      // showOptInUIForNotifications();
    }
  });
};
