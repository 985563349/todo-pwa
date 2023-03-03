if ('serviceWorker' in navigator && 'PushManager' in window) {
  window.addEventListener('load', () => {
    const PUBLIC_KEY =
      'BLEpPAE5nG5vV-bDgJgBtGE3vASMQGSEz_l5-nK0qH0Z_lI9RzpXZ87pX8g-Gq8SbasiKx-p4uMjJqUJ0pYfIe4';

    function urlBase64ToUint8Array(base64String) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');

      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);

      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    navigator.serviceWorker.register('/sw.js');

    navigator.serviceWorker.ready.then(async (registration) => {
      const options = {
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
      };

      try {
        const pushSubscription = await registration.pushManager.subscribe(options);
        if (pushSubscription) return;

        await fetch('/subscribe', {
          headers: {
            'content-type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify(pushSubscription),
        });
      } catch (error) {
        console.error(error);
        pushSubscription.unsubscribe();
      }
    });
  });
}
