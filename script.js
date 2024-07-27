document.getElementById('imageUpload').addEventListener('change', updatePreview);
document.getElementById('mainTitle').addEventListener('input', updatePreview);
document.getElementById('subTitle').addEventListener('input', updatePreview);
document.getElementById('bgColor').addEventListener('input', updateBackgroundColor);
document.getElementById('exportButton').addEventListener('click', exportImage);
document.getElementById('clearButton').addEventListener('click', clearImage);

function updatePreview() {
    const fileInput = document.getElementById('imageUpload');
    const mainTitleText = document.getElementById('mainTitle').value;
    const subTitleText = document.getElementById('subTitle').value;
    const svgImage = document.getElementById('svgImage');
    const mainTitlePreview = document.querySelector('.mainTitle');
    const subTitlePreview = document.querySelector('.subTitle');
    const shareContent = document.getElementById('shareContent');
    const overlay = document.querySelector('.overlay');

    // Atualizar título e subtítulo
    mainTitlePreview.innerHTML = mainTitleText.replace(/\n/g, '<br>'); // Substituir quebras de linha por <br>
    if (mainTitleText.trim() === '') {
        subTitlePreview.innerHTML = '';
        subTitlePreview.style.display = 'none'; // Ocultar subtítulo se não houver título
    } else {
        subTitlePreview.innerHTML = subTitleText.replace(/\n/g, '<br>'); // Substituir quebras de linha por <br>
        subTitlePreview.style.display = 'block'; // Mostrar subtítulo
    }

    // Adicionar ou remover classe com base na presença do subtítulo
    if (subTitleText.trim() !== '') {
        shareContent.classList.add('has-subtitle');
    } else {
        shareContent.classList.remove('has-subtitle');
    }

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            svgImage.setAttribute('href', e.target.result);

            // Ajustar imagem para simular object-fit: cover
            svgImage.setAttribute('preserveAspectRatio', 'xMidYMid slice');
            svgImage.setAttribute('x', '-5%');
            svgImage.setAttribute('y', '-5%');
            svgImage.setAttribute('width', '110%');
            svgImage.setAttribute('height', '110%');

            // Aplicar o filtro de desfoque se houver texto
            if (mainTitleText.trim() !== '') {
                svgImage.setAttribute('filter', 'url(#blurFilter)');
            } else {
                svgImage.removeAttribute('filter');
            }

            // Remover a classe 'hidden' do overlay
            overlay.classList.remove('hidden');
        }
        reader.readAsDataURL(fileInput.files[0]);
    } else {
        svgImage.removeAttribute('href');
        svgImage.removeAttribute('filter');

        // Adicionar a classe 'hidden' ao overlay se não houver imagem
        overlay.classList.add('hidden');
    }
}

function updateBackgroundColor() {
    const bgColor = document.getElementById('bgColor').value;
    document.getElementById('preview').style.backgroundColor = bgColor;
}

function exportImage() {
    const preview = document.getElementById('preview');

    html2canvas(preview, {
        useCORS: true
    }).then(function(canvas) {
        const link = document.createElement('a');
        link.download = 'partilha.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    }).catch(function(error) {
        console.error('Erro ao exportar a imagem:', error);
    });
}

function clearImage() {
    // Limpar campos de texto
    document.getElementById('mainTitle').value = '';
    document.getElementById('subTitle').value = '';

    // Limpar imagem e ocultar overlay
    const svgImage = document.getElementById('svgImage');
    svgImage.removeAttribute('href');
    svgImage.removeAttribute('filter');
    document.querySelector('.overlay').classList.add('hidden');

    // Limpar cor de fundo
    document.getElementById('bgColor').value = '#ffffff'; // Cor padrão
    updateBackgroundColor();
}
