let currentStream = null;
let usingFrontCamera = true;
const video = document.getElementById('camera');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('capture');
const switchButton = document.getElementById('switch');
const gallery = document.getElementById('gallery');

async function startCamera() {
  if (currentStream) {
    currentStream.getTracks().forEach(track => track.stop());
  }

  const constraints = {
    video: {
      facingMode: usingFrontCamera ? 'user' : 'environment'
    },
    audio: false
  };

  try {
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = currentStream;
  } catch (error) {
    alert('Error al acceder a la cámara: ' + error.message);
  }
}

captureButton.addEventListener('click', () => {
  const context = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = canvas.toDataURL('image/png'); // base64
  const img = document.createElement('img');
  img.src = imageData;
  gallery.appendChild(img);
});

switchButton.addEventListener('click', () => {
  usingFrontCamera = !usingFrontCamera;
  startCamera();
});

window.addEventListener('load', async () => {
  await startCamera();

  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/practicacamara/sw.js');
      console.log('Service Worker registrado:', registration);
    } catch (error) {
      console.error('Error registrando Service Worker:', error);
    }
  }
});
