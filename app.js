// Referencias a los elementos del DOM
const openCameraBtn = document.getElementById('openCamera');
const cameraContainer = document.getElementById('cameraContainer');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let stream = null; // Guardará el flujo de la cámara

// Función para abrir la cámara
async function openCamera() {
  try {
    const constraints = {
      video: {
        facingMode: { ideal: 'environment' },
        width: { ideal: 320 },
        height: { ideal: 240 }
      }
    };

    stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;

    cameraContainer.style.display = 'block';
    openCameraBtn.textContent = 'Cámara Abierta';
    openCameraBtn.disabled = true;

    console.log('Cámara abierta correctamente');
  } catch (error) {
    console.error('Error al acceder a la cámara:', error);
    alert('No se pudo acceder a la cámara. Verifica los permisos.');
  }
}

// Función para tomar una foto y guardarla en Base64
function takePhoto() {
  if (!stream) {
    alert('Primero debes abrir la cámara.');
    return;
  }

  // Dibujar el frame actual del video en el canvas
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Obtener imagen en formato Base64
  const imageDataURL = canvas.toDataURL('image/png');

  // Mostrar la imagen en consola (opcional)
  console.log('📸 Imagen capturada (Base64):', imageDataURL.substring(0, 100) + '...');

  // Guardar en localStorage para conservarla localmente
  localStorage.setItem('ultimaFoto', imageDataURL);

  alert(' Foto guardada en Base64 dentro del almacenamiento local.');

  // Cerrar la cámara después de tomar la foto
  closeCamera();
}

// Función para cerrar la cámara
function closeCamera() {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
    stream = null;

    video.srcObject = null;
    cameraContainer.style.display = 'none';
    openCameraBtn.textContent = 'Abrir Cámara';
    openCameraBtn.disabled = false;

    console.log('Cámara cerrada');
  }
}

// Recuperar foto guardada al cargar la página
window.addEventListener('load', () => {
  const ultimaFoto = localStorage.getItem('ultimaFoto');
  if (ultimaFoto) {
    const img = new Image();
    img.src = ultimaFoto;
    img.width = 320;
    img.height = 240;
    img.style.border = '2px solid #007bff';
    img.style.borderRadius = '10px';
    document.body.appendChild(document.createElement('hr'));
    document.body.appendChild(img);
    const text = document.createElement('p');
    text.textContent = ' Última foto guardada (Base64)';
    document.body.appendChild(text);
  }
});

// Eventos
openCameraBtn.addEventListener('click', openCamera);
takePhotoBtn.addEventListener('click', takePhoto);
window.addEventListener('beforeunload', closeCamera);
