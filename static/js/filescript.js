let isJejuToStandard = true;

function swapLanguages() {
    console.log("swapLanguages 함수 호출됨");  // 디버깅을 위한 로그
    isJejuToStandard = !isJejuToStandard;

    const inputLabel = document.querySelector("label[for='inputText']");
    const outputLabel = document.querySelector("label[for='outputText']");

    if (isJejuToStandard) {
        document.getElementById("inputText").placeholder = "제주어 여기에 써봅서";
        document.getElementById("outputText").placeholder = "변환 결과";

        inputLabel.textContent = "사투리:";
        outputLabel.textContent = "표준어:";
    } else {
        document.getElementById("inputText").placeholder = "표준어를 입력하세요";
        document.getElementById("outputText").placeholder = "변환 결과";

        inputLabel.textContent = "표준어:";
        outputLabel.textContent = "사투리:";
    }

    document.getElementById("outputText").value = "";
}

function translateText() {
    const inputText = document.getElementById("inputText").value;

    if (!inputText) {
        alert("변환할 텍스트를 입력하세요.");
        return;
    }

    const url = "/translate";
    const translateData = {
        input_text: inputText,
        isJejuToStandard: isJejuToStandard,
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(translateData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.translated_text) {
            document.getElementById("outputText").value = data.translated_text;
        } else {
            alert(data.error || "번역 실패");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("번역 중 오류가 발생했습니다.");
    });
}


window.addEventListener('load', function() {
    document.getElementById("inputSTT").addEventListener("click", function() {
        startSTT('inputText');  // STT 시작
    });

    document.getElementById("outputTTS").addEventListener("click", function() {
        const outputText = document.getElementById("outputText").value.trim();
        if (outputText !== "") {
            playTTS('outputText');  // TTS 실행
        } else {
            alert("출력 텍스트가 없습니다.");
        }
    });
});

function startSpeechRecognition() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("이 브라우저는 음성 녹음을 지원하지 않습니다.");
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks);
                const reader = new FileReader();

                reader.onloadend = () => {
                    const base64Audio = reader.result.split(',')[1];
                    sendAudioToSTT(base64Audio);
                };

                reader.readAsDataURL(audioBlob);
            };

            mediaRecorder.start();

            setTimeout(() => {
                mediaRecorder.stop();
            }, 5000);  // 5초 후 녹음 중지
        })
        .catch(error => {
            console.error('Error accessing the microphone: ', error);
            alert('마이크 접근이 거부되었습니다. 브라우저 설정을 확인하세요.');
        });
}

function startSTT(textAreaId) {
    // STT 코드
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("이 브라우저는 음성 녹음을 지원하지 않습니다.");
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks = [];

            mediaRecorder.ondataavailable = event => {
                audioChunks.push(event.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks);
                const reader = new FileReader();

                reader.onloadend = () => {
                    const base64Audio = reader.result.split(',')[1];
                    sendAudioToSTT(base64Audio, textAreaId);
                };

                reader.readAsDataURL(audioBlob);
            };

            mediaRecorder.start();

            setTimeout(() => {
                mediaRecorder.stop();
            }, 5000);  // 5초 후 녹음 중지
        })
        .catch(error => {
            console.error('Error accessing the microphone: ', error);
            alert('마이크 접근이 거부되었습니다. 브라우저 설정을 확인하세요.');
        });
}

function sendAudioToSTT(base64Audio, textAreaId) {
    fetch('/stt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ audio: base64Audio })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById(textAreaId).value = data.text;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


document.getElementById("outputTTS").addEventListener("click", function() {
    const outputText = document.getElementById("outputText").value.trim();
    if (outputText !== "") {
        speakTextUsingAPI(outputText);
    } else {
        alert("출력 텍스트가 없습니다.");
    }
});

function speakTextUsingAPI(text) {
    fetch('/tts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            const audio = new Audio('data:audio/mp3;base64,' + data.audio_content);
            audio.play();
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function playTTS(textAreaId) {
    const text = document.getElementById(textAreaId).value.trim();
    if (text !== "") {
        speakTextUsingAPI(text);
    } else {
        alert("출력 텍스트가 없습니다.");
    }
}

/*
let isJejuToStandard = true;

function swapLanguages() {
    console.log("swapLanguages 함수 호출됨");  // 디버깅을 위한 로그
    isJejuToStandard = !isJejuToStandard;

    const inputLabel = document.querySelector("label[for='inputText']");
    const outputLabel = document.querySelector("label[for='outputText']");

    if (isJejuToStandard) {
        document.getElementById("inputText").placeholder = "제주어 여기에 써봅서";
        document.getElementById("outputText").placeholder = "변환 결과";

        inputLabel.textContent = "사투리:";
        outputLabel.textContent = "표준어:";
    } else {
        document.getElementById("inputText").placeholder = "표준어를 입력하세요";
        document.getElementById("outputText").placeholder = "변환 결과";

        inputLabel.textContent = "표준어:";
        outputLabel.textContent = "사투리:";
    }

    document.getElementById("outputText").value = "";
}

function translateText() {
    const inputText = document.getElementById("inputText").value;

    if (!inputText) {
        alert("변환할 텍스트를 입력하세요.");
        return;
    }

    const url = "/translate";
    const translateData = {
        input_text: inputText,
        isJejuToStandard: isJejuToStandard,
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(translateData),
    })
    .then(response => response.json())
    .then(data => {
        if (data.translated_text) {
            document.getElementById("outputText").value = data.translated_text;
        } else {
            alert(data.error || "번역 실패");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("번역 중 오류가 발생했습니다.");
    });
}

window.addEventListener('load', function() {
    document.getElementById("inputTTS").addEventListener("click", function() {
        const inputText = document.getElementById("inputText").value.trim();
        if (inputText !== "") {
            speakTextUsingAPI(inputText);
        } else {
            alert("입력 텍스트가 없습니다.");
        }
    });

    document.getElementById("outputTTS").addEventListener("click", function() {
        const outputText = document.getElementById("outputText").value.trim();
        if (outputText !== "") {
            speakTextUsingAPI(outputText);
        } else {
            alert("출력 텍스트가 없습니다.");
        }
    });
});

function speakTextUsingAPI(text) {
    fetch('/tts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: text })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            alert(data.error);
        } else {
            const audio = new Audio('data:audio/mp3;base64,' + data.audio_content);
            audio.play();
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}*/