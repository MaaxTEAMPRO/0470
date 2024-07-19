document.addEventListener('DOMContentLoaded', function() {
    let savedNames = localStorage.getItem('savedNames');
    if (savedNames) {
        document.getElementById('namesInput').value = savedNames;
        updateRanking(savedNames);
    }

    document.getElementById('shuffleButton').addEventListener('click', function() {
        let input = document.getElementById('namesInput').value;
        let cleanedInput = cleanNames(input);
        let shuffledNames = shuffleArray(cleanedInput.split('\n'));
        let finalInput = shuffledNames.join('\n');
        localStorage.setItem('savedNames', finalInput);
        updateRanking(finalInput);
    });

    document.getElementById('validateButton').addEventListener('click', function() {
        let validationCode = document.getElementById('validationCode').value;
        let cleanedCode = cleanCode(validationCode);
        let savedData = localStorage.getItem(cleanedCode);

        if (savedData) {
            document.getElementById('namesInput').value = savedData;
            updateRanking(savedData);
            document.getElementById('validationResult').textContent = "O sorteio é válido";
            document.getElementById('validationResult').style.color = "green";
        } else {
            document.getElementById('validationResult').textContent = "O sorteio é inválido";
            document.getElementById('validationResult').style.color = "red";
        }
    });

    document.getElementById('copyButton').addEventListener('click', function() {
        let resultList = document.getElementById('resultList').innerText;
        let validationCode = document.querySelector('.time-line').innerText.split(': ')[1];
        let copyText = `${resultList}\n> ${validationCode}`;
        copyToClipboard(copyText);
        alert('Ranking e código de validação copiados!');
    });
});

function cleanNames(input) {
    return input.split(/[\n,]+/).map(name => name.replace(/[^a-zA-Zá-úÁ-Ú ]/g, '').trim()).filter(name => name !== "").join('\n');
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateRanking(input) {
    let names = input.split('\n').map(name => name.trim()).filter(name => name !== "");
    let resultList = document.getElementById('resultList');
    resultList.innerHTML = '';

    names.forEach((name, index) => {
        let ordinal = getOrdinal(index + 1);
        let li = document.createElement('li');
        li.textContent = `${ordinal} - ${name}`;
        resultList.appendChild(li);
    });

    let now = new Date();
    let validationCode = generateValidationCode(names);
    let timeLine = document.createElement('li');
    timeLine.className = 'time-line';
    timeLine.textContent = `Sorteio realizado em ${formatDate(now)} - Autenticidade: ${validationCode}`;
    resultList.appendChild(timeLine);

    localStorage.setItem(cleanCode(validationCode), input);
}

function encodeNames(names) {
    return CryptoJS.MD5(names.join(',')).toString();
}

function cleanCode(code) {
    return code.replace(/[^0-9a-zA-Z]/g, '');
}

function generateValidationCode(names) {
    return encodeNames(names);
}

function getOrdinal(number) {
    let suffix = '°';
    return `${number}${suffix}`;
}

function formatDate(date) {
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let year = date.getFullYear();
    return `${day}/${month}/${year} - ${hours}:${minutes}:${seconds}`;
}

function copyToClipboard(text) {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = text;
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
        }
