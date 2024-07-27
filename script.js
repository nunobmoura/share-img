document.getElementById('imageUpload').addEventListener('change', updatePreview);
document.getElementById('recorteUpload').addEventListener('change', updateRecorte);
document.getElementById('bgColor').addEventListener('input', updateBackgroundColor);
document.getElementById('mainTitle').addEventListener('input', updatePreview);
document.getElementById('subTitle').addEventListener('input', updatePreview);
document.getElementById('exportButton').addEventListener('click', exportImage);
document.getElementById('clearButton').addEventListener('click', clearImage);
document.getElementById('removeRecorteButton').addEventListener('click', removeRecorte);

function updatePreview() {
  const fileInput = document.getElementById('imageUpload');
  const mainTitleText = document.getElementById('mainTitle').value;
  const subTitleText = document.getElementById('subTitle').value;
  const svgImage = document.getElementById('svgImage');
  const mainTitlePreview = document.querySelector('.mainTitle');
  const subTitlePreview = document.querySelector('.subTitle');
  const shareContent = document.getElementById('shareContent');

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      svgImage.setAttribute('href', e.target.result);
      svgImage.setAttribute('preserveAspectRatio', 'xMidYMid slice');
      svgImage.setAttribute('x', '-5%');
      svgImage.setAttribute('y', '-5%');
      svgImage.setAttribute('width', '110%');
      svgImage.setAttribute('height', '110%');

      if (mainTitleText.trim() !== '') {
        svgImage.setAttribute('filter', 'url(#blurFilter)');
      } else {
        svgImage.removeAttribute('filter');
      }

      updateOverlayVisibility();
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    svgImage.removeAttribute('href');
    svgImage.removeAttribute('filter');
    updateOverlayVisibility();
  }

  mainTitlePreview.innerHTML = mainTitleText.replace(/\n/g, '<br>');
  if (mainTitleText.trim() === '') {
    subTitlePreview.innerHTML = '';
    subTitlePreview.style.display = 'none';
  } else {
    subTitlePreview.innerHTML = subTitleText.replace(/\n/g, '<br>');
    subTitlePreview.style.display = 'block';
  }

  if (mainTitleText.trim() !== '') {
    shareContent.classList.add('has-title');
  } else {
    shareContent.classList.remove('has-title');
  }

  if (subTitleText.trim() !== '') {
    shareContent.classList.add('has-subtitle');
  } else {
    shareContent.classList.remove('has-subtitle');
  }
}

function updateRecorte() {
  const fileInput = document.getElementById('recorteUpload');
  const recortePreview = document.querySelector('.content--recorte');
  const shareContent = document.getElementById('shareContent');

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      recortePreview.innerHTML = `<img src="${e.target.result}">`;
      shareContent.classList.add('has-recorte');
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    recortePreview.innerHTML = '';
    shareContent.classList.remove('has-recorte');
  }

  updateOverlayVisibility();
}

function updateBackgroundColor() {
  const bgColor = document.getElementById('bgColor').value;
  document.getElementById('preview').style.backgroundColor = bgColor;
}

function updateOverlayVisibility() {
  const overlay = document.querySelector('.overlay');
  const imageUploaded = document.getElementById('imageUpload').files.length > 0;
  const recorteUploaded =
    document.querySelector('.content--recorte img') !== null;
  const mainTitleText = document.getElementById('mainTitle').value.trim();

  if (
    (imageUploaded && (mainTitleText !== '' || recorteUploaded)) ||
    recorteUploaded
  ) {
    overlay.classList.remove('hidden');
  } else {
    overlay.classList.add('hidden');
  }
}

function exportImage() {
  const preview = document.getElementById('preview');

  html2canvas(preview, {
    useCORS: true,
  })
    .then(function (canvas) {
      const link = document.createElement('a');
      link.download = 'partilha.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    })
    .catch(function (error) {
      console.error('Erro ao exportar a imagem:', error);
    });
}

function clearImage() {
  const imageUpload = document.getElementById('imageUpload');
  const svgImage = document.getElementById('svgImage');

  imageUpload.value = '';
  svgImage.removeAttribute('href');
  svgImage.removeAttribute('filter');

  updateOverlayVisibility();
}

function removeRecorte() {
  const recorteUpload = document.getElementById('recorteUpload');
  const recortePreview = document.querySelector('.content--recorte');

  recorteUpload.value = '';
  recortePreview.innerHTML = '';
  recorteUpload.dispatchEvent(new Event('change'));

  updateOverlayVisibility();
}
