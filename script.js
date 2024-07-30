document.getElementById('imageUpload').addEventListener('change', updatePreview);
document.getElementById('recorteUpload').addEventListener('change', updateRecorte);
document.getElementById('bgColor').addEventListener('input', updateBackgroundColor);
document.getElementById('mainTitle').addEventListener('input', updatePreview);
document.getElementById('subTitle').addEventListener('input', updatePreview);
document.getElementById('exportButton').addEventListener('click', exportImage);
document.getElementById('clearButton').addEventListener('click', clearImage);
document.getElementById('removeRecorteButton').addEventListener('click', removeRecorte);
const previewContent = document.getElementById('preview');

function updatePreview() {
  const fileInput = document.getElementById('imageUpload');
  const mainTitleText = document.getElementById('mainTitle').value;
  const subTitleText = document.getElementById('subTitle').value;
  const svgImage = document.getElementById('svgImage');
  const mainTitlePreview = document.querySelector('.mainTitle');
  const subTitlePreview = document.querySelector('.subTitle');

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
    };
    reader.readAsDataURL(fileInput.files[0]);
    previewContent.classList.add('has-image');
  } else {
    svgImage.removeAttribute('href');
    svgImage.removeAttribute('filter');
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
    previewContent.classList.add('has-title');
  } else {
    previewContent.classList.remove('has-title');
  }

  if (subTitleText.trim() !== '') {
    previewContent.classList.add('has-subtitle');
  } else {
    previewContent.classList.remove('has-subtitle');
  }
}

function updateRecorte() {
  const fileInput = document.getElementById('recorteUpload');
  const recortePreview = document.querySelector('.content--recorte');

  if (fileInput.files && fileInput.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      recortePreview.innerHTML = `<img src="${e.target.result}">`;
      previewContent.classList.add('has-recorte');
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    recortePreview.innerHTML = '';
    previewContent.classList.remove('has-recorte');
  }
}

function updateBackgroundColor() {
  const bgColor = document.getElementById('bgColor').value;
  previewContent.style.backgroundColor = bgColor;
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


function exportImage() {
  const preview = document.getElementById('preview');

  html2canvas(preview, {
      useCORS: true,
  }).then(function (canvas) {
      canvas.toBlob(function (blob) {
          const link = document.createElement('a');
          link.download = 'partilha.png';
          link.href = URL.createObjectURL(blob);
          link.click();
      }, 'image/png', 0.2); // O terceiro parâmetro é a qualidade (0.0 a 1.0)
  }).catch(function (error) {
      console.error('Erro ao exportar a imagem:', error);
  });
}


function clearImage() {
  const imageUpload = document.getElementById('imageUpload');
  const svgImage = document.getElementById('svgImage');

  imageUpload.value = '';
  svgImage.removeAttribute('href');
  svgImage.removeAttribute('filter');
  previewContent.classList.remove('has-image');
}

function removeRecorte() {
  const recorteUpload = document.getElementById('recorteUpload');
  const recortePreview = document.querySelector('.content--recorte');

  recorteUpload.value = '';
  recortePreview.innerHTML = '';
  recorteUpload.dispatchEvent(new Event('change'));
}
