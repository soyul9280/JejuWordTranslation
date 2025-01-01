document.addEventListener('DOMContentLoaded', () => {
   
  const links = document.querySelectorAll('nav ul li a');
  // 드롭 영역 및 파일 입력 요소 가져오기
  const dropArea = document.getElementById('dropArea');
  const fileInput = document.getElementById('fileInput');

  window.triggerFileInput = function() {
    const fileInput = document.getElementById('fileInput');
    if (fileInput) {
      fileInput.click(); // fileInput 요소의 클릭 이벤트를 시뮬레이션하여 파일 선택 창을 엽니다.
    }
  };//;작성안함

// 요소가 존재하는지 확인
  if (dropArea && fileInput) {
    // 드롭 영역 시각적 피드백 처리
    dropArea.addEventListener('dragover', (event) => {
      event.preventDefault();
      dropArea.classList.add('dragover');
    });

    // 드롭 영역 벗어났을때 시각적 피드백
    dropArea.addEventListener('dragleave', () => {
      dropArea.classList.remove('dragover');
    });

    // 드롭 이벤트
    dropArea.addEventListener('drop', (event) => {
      event.preventDefault();
      dropArea.classList.remove('dragover');
      const files = event.dataTransfer.files;
      if (files.length > 0) {
        fileInput.files = files; // 드래그 앤 드롭된 파일을 input에 설정
        console.log(files);
      }
    });
}
 // 텍스트 컨테이너 표시 후 파일 컨테이너 숨기기
 window.showTextContainer = function() {
    const textContainer = document.getElementById('textContainer');
    const fileContainer = document.getElementById('fileContainer');
    if (textContainer && fileContainer) {
      textContainer.classList.add('active');
      fileContainer.classList.remove('active');
      fileContainer.classList.add('standby');
      textContainer.classList.remove('standby');
    }

  };

  // 파일 컨테이너 표시 텍스트 숨김
  window.showFileContainer = function() {
    const textContainer = document.getElementById('textContainer');
    const fileContainer = document.getElementById('fileContainer');
    if (textContainer && fileContainer) {
      fileContainer.classList.add('active');
      textContainer.classList.remove('active');
      textContainer.classList.add('standby');
      fileContainer.classList.remove('standby');
    }

  };
//두 텍스트 영역간 위치 교환
window.swapText = function() {
    const textAreaWrapper1 = document.querySelector('.textarea-wrapper:nth-of-type(1)');
    const textAreaWrapper2 = document.querySelector('.textarea-wrapper:nth-of-type(2)');

    if (textAreaWrapper1 && textAreaWrapper2) {
      // 두 부모 요소를 교환합니다.
      const parent = textAreaWrapper1.parentNode;
      const nextSibling = textAreaWrapper2.nextSibling;

      parent.insertBefore(textAreaWrapper2, textAreaWrapper1);
      parent.insertBefore(textAreaWrapper1, nextSibling);
    }
  };

   // 부드러운 스크롤 기능을 적용할 링크의 목록
   const smoothScrollLinks = Array.from(links).filter(link => {
    // 로그인과 회원가입 링크의 href는 '/login/'과 '/sign_up/'로 시작합니다.
    return !link.getAttribute('href').startsWith('/login') &&
           !link.getAttribute('href').startsWith('/sign_up');
  });
  // 부드러운 스크롤 기능
  smoothScrollLinks.forEach(link => {
      link.addEventListener('click', function(event) {
          event.preventDefault(); // 기본 링크 동작 방지

          const targetId = this.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);

          if (targetElement) { // 요소가 존재하는 경우에만 스크롤
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth' // 부드러운 스크롤
            });
        } else {
            console.warn(`Element with ID "${targetId}" not found.`);
        }
      });
  });

  // 제목 애니메이션 기능
  const title = document.querySelector('.title');
  const subtitle = document.querySelector('.subtitle');
  const subtitle2 = document.querySelector('.subtitle2');
  if (title) {
      setTimeout(function() {
          title.classList.add('active');
          subtitle.classList.add('active');
          subtitle2.classList.add('active');
      }, 100); // 100ms의 지연 시간을 추가함
  }

  const handleScroll = () => {
    const triggerHeight = window.innerHeight * 0.8; // 화면 높이의 80% 지점에서 트리거

    if (subtitle && subtitle.getBoundingClientRect().top < triggerHeight && subtitle.getBoundingClientRect().bottom > 0) {
        subtitle.classList.add('active');
    } else {
        subtitle.classList.remove('active');
    }

    if (subtitle2 && subtitle2.getBoundingClientRect().top < triggerHeight && subtitle2.getBoundingClientRect().bottom > 0) {
        subtitle2.classList.add('active');
    } else {
        subtitle2.classList.remove('active');
    }
  };
  window.addEventListener('scroll', handleScroll);

  window.addEventListener('scroll', function() {
    const introContainer = document.querySelector('.intro-container');
    const containers = document.querySelectorAll('.container');
    
    const triggerHeight = window.innerHeight * 0.8; // 화면 높이의 80% 지점에서 트리거

    if (introContainer) {
        if (introContainer.getBoundingClientRect().top < triggerHeight && introContainer.getBoundingClientRect().bottom > 0) {
            introContainer.classList.add('show');
        } else {
            introContainer.classList.remove('show');
        }
    }

    containers.forEach(container => {
        if (container.getBoundingClientRect().top < triggerHeight && container.getBoundingClientRect().bottom > 0) {
            container.classList.add('show');
        } else {
            container.classList.remove('show');
        }
    });
});

// 배경 이미지 변경 기능 추가
window.resetBackground=function() {
  const section2 = document.getElementById('selection2');
  if (section2) {
      // section2의 배경 이미지 중 두 번째 이미지를 변경
      // const section2 = document.getElementById('selection2');
      section2.style.backgroundImage = "url('/static/img/section2-speaker2.png'), url('/static/img/section2-look2.png')";  // 두 번째 이미지를 새로운 이미지로 업데이트
  }
}

// 원래 배경 이미지 변경 기능 추가
window.changeBackground=function() {
    const section2 = document.getElementById('selection2');
    if (section2) {
        // section2의 배경 이미지 중 두 번째 이미지를 변경
        // const section2 = document.getElementById('selection2');
        section2.style.backgroundImage = "url('/static/img/section2-speaker2.png'), url('/static/img/quiz-man.png')";  // 두 번째 이미지를 새로운 이미지로 업데이트
    }
}

    // 스크롤 이벤트를 일정 간격으로 처리하도록 throttle 적용
    window.addEventListener('wheel', (event) => {
        });

        // STT 시작 함수
    window.startSTT = function(textareaId) {
        // 음성 인식 객체 생성
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'ko-KR'; // 한국어 설정
        recognition.interimResults = false; // 중간 결과 표시 여부

        // 음성 인식 시작 시
        recognition.onstart = function() {
            console.log('STT가 시작되었습니다.');
        };

        // 음성 인식 결과 처리
        recognition.onresult = function(event) {
            console.log('STT 결과 이벤트가 호출되었습니다.'); // 추가 로그
            const result = event.results[0][0].transcript;
            console.log('STT 결과:', result);

            // 결과를 지정된 textarea에 입력
            const textarea = document.getElementById(textareaId);
            if (textarea) {
                textarea.value = result;
            }
        };

    // 오류 처리
    recognition.onerror = function(event) {
        console.error('STT 오류:', event.error);
        alert('STT 처리 중 오류가 발생했습니다: ' + event.error);
    };

    // 음성 인식 종료 시
    recognition.onend = function() {
        console.log('STT가 종료되었습니다.');
    };

    // 음성 인식 시작
    recognition.start();
};

    // TTS 재생 기능
    window.playTTS = function(textareaId) {
        const textarea = document.getElementById(textareaId);
        if (!textarea || !textarea.value.trim()) {
            alert("텍스트가 비어 있습니다.");
            return;
        }

        const ttsData = {
            text: textarea.value.trim()
        };

        fetch('/tts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(ttsData),
        })
        .then(response => response.json())
        .then(data => {
            if (data.audio_content) {
                const audio = new Audio("data:audio/mp3;base64," + data.audio_content);
                audio.play();
            } else {
                alert("TTS 실패: " + (data.error || "알 수 없는 오류"));
            }
        })
        .catch(error => {
            console.error("TTS 요청 중 오류 발생:", error);
            alert("TTS 요청 중 오류가 발생했습니다.");
        });
    };

    
    // 파일 업로드 및 번역 함수
    window.uploadFileAndTranslate = function() {
        const fileInput = document.getElementById('fileInput');
        if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
            alert("파일을 선택해주세요.");
            return;
        }

        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append('file', file);

        fetch('/upload_and_translate', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.translated_text) {
                const outputText = document.getElementById('outputText');
                if (outputText) {
                    outputText.value = data.translated_text;
                }
            } else {
                alert("번역 실패: " + (data.error || "알 수 없는 오류"));
            }
        })
        .catch(error => {
            console.error("파일 업로드 및 번역 중 오류 발생:", error);
            alert("파일 업로드 및 번역 중 오류가 발생했습니다.");
        });
    };
});
async function translateText() {
    const inputText = document.getElementById("inputText").value;

    try {
        const response = await fetch("/translate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ input_text: inputText, isJejuToStandard: true })
        });

        if (!response.ok) {
            throw new Error("번역 요청에 실패했습니다.");
        }

        const data = await response.json();
        document.getElementById("outputText").value = data.translated_text;

    } catch (error) {
        console.error("Error:", error);
        alert("번역 중 오류가 발생했습니다.");
    }
}