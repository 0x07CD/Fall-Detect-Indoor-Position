import axios from 'axios';

const isLocalhost = Boolean(
	window.location.hostname === 'localhost' ||
	// [::1] is the IPv6 localhost address.
	window.location.hostname === '[::1]' ||
	// 127.0.0.0/8 are considered localhost for IPv4.
	window.location.hostname.match(
		/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
	)
)

const urlB64ToUint8Array = base64String => {
	const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
	const rawData = atob(base64);
	const outputArray = new Uint8Array(rawData.length);
	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

const saveSubscription = async (subscription) => {
	let SERVER_URL = 'https://us-central1-ce62-29.cloudfunctions.net/api/users/saveSubscription';
	let response = await axios.post(SERVER_URL, { subscription: subscription });
	return response;
}

// /* eslint-disable-next-line no-restricted-globals */
// self.addEventListener('activate', async () => {
// 	try {
// 		const options = {
// 			userVisibleOnly: true
// 		}
// 		/* eslint-disable-next-line no-restricted-globals */
// 		const subscription = await self.registration.pushManager.subscribe(options);
// 		const response = await saveSubscription(JSON.stringify(subscription));
// 		console.log(response);
// 	} catch (err) {
// 		console.log(err);
// 	}
// });

export const register = (config) => {
	if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
		const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
		if (publicUrl.origin !== window.location.origin) {
			return;
		}

		window.addEventListener('load', async () => {
			const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

			if (isLocalhost) {
				// This is running on localhost. Let's check if a service worker still exists or not.
				checkValidServiceWorker(swUrl, config);
				navigator.serviceWorker.ready.then(() => {
					console.log('This web app is being served cache-first by a service worker');
				});
			} else {
				// Is not localhost. Just register service worker
				try {
					const applicationServerKey = urlB64ToUint8Array("BOQ4-GDtCdX8OB3sb_6R3NpagwxVuUWFelVysbvunzysL_tL0L-nCIo-FRxMdLddi01RSY7TgJ9ZbkfWrKR6p7M");
					const options = {
						applicationServerKey,
						userVisibleOnly: true
					};
					const registration = await registerValidSW(swUrl, config);
					console.log(registration);

					if (Notification.permission === "granted") {
						/* eslint-disable-next-line no-restricted-globals */
						const subscription = await registration.pushManager.subscribe(options);
						const response = await saveSubscription(JSON.stringify(subscription));
						console.log(response);
					}

				} catch (error) {
					console.log(error);
				}

			}
		});
	}
}

const registerValidSW = async (swUrl, config) => {
	try {
		const registration = await navigator.serviceWorker.register(swUrl);
		registration.onupdatefound = () => {
			const installingWorker = registration.installing;
			if (installingWorker == null) {
				return;
			}
			installingWorker.onstatechange = () => {
				if (installingWorker.state === 'installed') {
					if (navigator.serviceWorker.controller) {
						// Execute callback
						if (config && config.onUpdate) {
							config.onUpdate(registration);
						}
					} else {
						// Execute callback
						if (config && config.onSuccess) {
							config.onSuccess(registration);
						}
					}
				}
			};
		};
		return registration;
	} catch (error) {
		console.error('Error during service worker registration:', error);
		return null;
	}
}

const checkValidServiceWorker = (swUrl, config) => {
	// Check if the service worker can be found. If it can't reload the page.
	fetch(swUrl, {
		headers: { 'Service-Worker': 'script' }
	})
		.then(response => {
			// Ensure service worker exists, and that we really are getting a JS file.
			const contentType = response.headers.get('content-type');
			if (
				response.status === 404 ||
				(contentType != null && contentType.indexOf('javascript') === -1)
			) {
				// No service worker found. Probably a different app. Reload the page.
				navigator.serviceWorker.ready.then(registration => {
					registration.unregister().then(() => {
						window.location.reload();
					});
				});
			} else {
				// Service worker found. Proceed as normal.
				registerValidSW(swUrl, config);
			}
		})
		.catch(() => {
			console.log(
				'No internet connection found. App is running in offline mode.'
			);
		});
}

export const unregister = () => {
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.ready.then(registration => {
			registration.unregister();
		});
	}
}
