importScripts("https://www.gstatic.com/firebasejs/7.20.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/7.20.0/firebase-messaging.js"
);
const firebaseConfig = {
  apiKey: "AIzaSyA5IChtWkbmS5UuQ7cSp6grrt5WEwHRmMo",
  authDomain: "testing-cloud-functions1.firebaseapp.com",
  databaseURL: "https://testing-cloud-functions1.firebaseio.com",
  projectId: "testing-cloud-functions1",
  storageBucket: "testing-cloud-functions1.appspot.com",
  messagingSenderId: "777178200281",
  appId: "1:777178200281:web:a7b2dee7866bdbb054e6c8",
  measurementId: "G-LZKEG4MCHR",
};
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
  console.log(
    "Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = "Background Message Title";
  const notificationOptions = {
    body: payload.data.body,
    image: payload.data.image,
    icon: "/favicon.ico",
    data: payload.data,
    // tag: "some tag",
    actions: [
      {
        action: "coffee-action",
        title: "Coffee",
        icon: "/favicon.ico",
      },
      {
        action: "doughnut-action",
        title: "Doughnut",
        icon: "/favicon.ico",
      },
    ],
  };

  console.log({
    notificationTitle,
    notificationOptions
  })

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions
  );
});

// Code for adding event on click of notification
self.addEventListener('notificationclick', function(event) {
  console.log('notification clicked', event)
  const url = event.notification.data.url
  event.notification.close()
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      // Check if there is already a window/tab open with the target URL
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i]
        // If so, just focus it.
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      // If not, then open the target URL in a new window/tab.
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
