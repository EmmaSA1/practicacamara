const openCameraBtn = document.getElementById('openCamera');
const switchCameraBtn = document.getElementById('switchCamera');
const cameraContainer = document.getElementById('cameraContainer');
const video = document.getElementById('video');
const takePhotoBtn = document.getElementById('takePhoto');
const canvas = document.getElementById('canvas');
const galleryDiv = document.getElementById('gallery');
const ctx = canvas.getContext('2d');

let stream = null;
let useFrontCamera = false;

// ✅ Abrir cámara
async function openCamera() {
  try {
    const constraints = {
      video: { facingMode: useFrontCamera ? 'user' : 'environment' },
      audio: false
    };
    stream = await navigator.mediaDevices.getUserMedia(constraints);
    video.srcObject = stream;
    cameraContainer.style.display = 'block';
    openCameraBtn.disabled = true;
    openCameraBtn.textContent = 'Cámara activa';
    switchCameraBtn.style.display = 'inline-block';
  } catch (err) {
    console.error(err);
    alert('❌ Error al acceder a la cámara. Verifica permisos.');
  }
}

// 🔁 Cambiar cámara (frontal / trasera)
async function switchCamera() {
  useFrontCamera = !useFrontCamera;
  closeCamera();
  await openCamera();
}

// 📸 Tomar foto y guardar en Base64
function takePhoto() {
  if (!stream) return alert('Primero abre la cámara.');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
  const base64 = canvas.toDataURL('image/png');
  saveToGallery(base64);
  alert('✅ Foto guardada en galería.');
}

// 💾 Guardar foto en localStorage
function saveToGallery(base64) {
  let gallery = JSON.parse(localStorage.getItem('gallery')) || [];
  gallery.push(base64);
  localStorage.setItem('gallery', JSON.stringify(gallery));
  renderGallery();
}

// 🖼️ Mostrar galería
function renderGallery() {
  galleryDiv.innerHTML = '';
  const gallery = JSON.parse(localStorage.getItem('gallery')) || [];
  if (gallery.length === 0) {
    galleryDiv.innerHTML = '<p>No hay fotos guardadas.</p>';
    return;
  }
  gallery.forEach((imgData, index) => {
    const img = new Image();
    img.src = imgData;
    img.alt = `Foto ${index + 1}`;
    img.addEventListener('click', () => {
      if (confirm('¿Eliminar esta foto?')) deletePhoto(index);
    });
    galleryDiv.appendChild(img);
  });
}

// 🗑️ Eliminar foto
function deletePhoto(index) {
  let gallery = JSON.parse(localStorage.getItem('gallery')) || [];
  gallery.splice(index, 1);
  localStorage.setItem('gallery', JSON.stringify(gallery));
  renderGallery();
}

// 🔒 Cerrar cámara
function closeCamera() {
  if (stream) {
    stream.getTracks().forEach(t => t.stop());
    stream = null;
    video.srcObject = null;
    cameraContainer.style.display = 'none';
    openCameraBtn.disabled = false;
    openCameraBtn.textContent = 'Abrir Cámara';
    switchCameraBtn.style.display = 'none';
  }
}

// 🧠 Al cargar la página
window.addEventListener('load', () => {
  renderGallery();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('practicacamara/sw.js').then(() => {
      console.log('✅ Service Worker registrado');
    });
  }
});

// 📱 Eventos
openCameraBtn.addEventListener('click', openCamera);
takePhotoBtn.addEventListener('click', takePhoto);
switchCameraBtn.addEventListener('click', switchCamera);
window.addEventListener('beforeunload', closeCamera);
