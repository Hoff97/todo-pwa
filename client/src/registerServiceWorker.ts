import { getVapidKey, registerSubscription } from './rest/push';
import { urlBase64ToUint8Array } from './util/string';

import UaParser from 'ua-parser-js';

// tslint:disable:no-console
// In production, we register a service worker to serve assets from local cache.

// This lets the app load faster on subsequent visits in production, and gives
// it offline capabilities. However, it also means that developers (and users)
// will only see deployed updates on the 'N+1' visit to a page, since previously
// cached resources are updated in the background.

// To learn more about the benefits of this model, read https://goo.gl/KwvDNy.
// This link also includes instructions on opting out of this behavior.

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  // [::1] is the IPv6 localhost address.
  window.location.hostname === '[::1]' ||
  // 127.0.0.1/8 is considered localhost for IPv4.
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
  )
);

export default function register() {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(
      process.env.PUBLIC_URL!,
      window.location.toString()
    );
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebookincubator/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // This is running on localhost. Lets check if a service worker still exists or not.
        checkValidServiceWorker(swUrl);

        // Add some additional logging to localhost, pointing developers to the
        // service worker/PWA documentation.
        navigator.serviceWorker.ready.then(registration => {
          console.log(
            'This web app is being served cache-first by a service ' +
            'worker. To learn more, visit https://goo.gl/SC7cgQ'
          );
        });
      } else {
        // Is not local host. Just register service worker
        registerValidSW(swUrl);
      }
    });
  }
}

var swRegistration = new Promise<ServiceWorkerRegistration>((resolve: ((arg: ServiceWorkerRegistration) => void)) => {
  resolveSw = resolve;
});
var resolveSw: ((arg: ServiceWorkerRegistration) => void);

function registerValidSW(swUrl: string) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      resolveSw(registration);
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker) {
          installingWorker.onstatechange = () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.log('New content is available; please refresh.');

                alert('App has been updated in the background. Please refresh.');
              } else {
                // At this point, everything has been precached.
                // It's the perfect time to display a
                // 'Content is cached for offline use.' message.
                console.log('Content is cached for offline use.');
              }
            }
          };
        }
      };
    })
    .catch(error => {
      console.error('Error during service worker registration:', error);
    });
}

export function registerPush() {
  console.log('Registering push');
  swRegistration.then(registration => {
    registration.pushManager.getSubscription().then(async function (subscription) {
      if (subscription) {
        return subscription;
      }

      const vapidPublicKey = await getVapidKey();
      const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);
      console.log(convertedVapidKey);

      return registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey
      });
    }).then(function (subscription) {
      console.log('Got subscription');
      console.log(subscription);
      const userAgent = new UaParser();
      const browser = userAgent.getBrowser().name || '';;
      const model = userAgent.getDevice().model || '';
      const os = userAgent.getOS().name || '';
      const deviceDescription = `${browser} ${model} ${os}`.replace(/[ ]+/g, ' ');
      registerSubscription(subscription, deviceDescription, process.env.REACT_APP_VERSION);
    });
  });
}

/*function configurePush(registration: ServiceWorkerContainer) {
  console.log('Adding push event listener');
  registration.addEventListener('push', function (event: any) {
    console.log('Got pushed');
    //const payload = event.data ? event.data.text() : 'no payload';
    //event.waitUntil(registration.showNotification('Yay!', { body: payload }));
  });
}*/

function checkValidServiceWorker(swUrl: string) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl)
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      if (
        response.status === 404 ||
        response.headers.get('content-type')!.indexOf('javascript') === -1
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl);
      }
    })
    .catch(() => {
      console.log(
        'No internet connection found. App is running in offline mode.'
      );
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready.then(registration => {
      registration.unregister();
    });
  }
}
