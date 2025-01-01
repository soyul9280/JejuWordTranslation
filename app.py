from flask import Flask, request, jsonify, redirect, url_for, render_template, session, flash
 
import os

from werkzeug.security import generate_password_hash, check_password_hash
from google.cloud import texttospeech, speech
import base64
import torch
from transformers import T5Tokenizer, T5ForConditionalGeneration
# Flask 애플리케이션 인스턴스 생성
app = Flask(__name__)


# # 토크나이저 및 모델 로드 (Train.py에서 사용한 동일한 모델과 토크나이저)
tokenizer = T5Tokenizer.from_pretrained('KETI-AIR/ke-t5-base', legacy=False)
model = T5ForConditionalGeneration.from_pretrained('KETI-AIR/ke-t5-base')

# # 학습된 모델 경로
model_path = os.path.join(os.getcwd(), 'AI_model', 'best_model.pt')

# # 학습된 모델 로드 (가중치만 로드하는 방식)
try:
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu'), weights_only=True))
    model.eval()
except Exception as e:
    app.logger.error(f"Failed to load model: {e}")
# # 번역 함수 정의``
def translate_text(input_text, is_jeju_to_standard=True):
    inputs = tokenizer(input_text, return_tensors="pt", padding=True, truncation=True)

    with torch.no_grad():
        outputs = model.generate(input_ids=inputs['input_ids'], attention_mask=inputs['attention_mask'], max_length=50)
        
    return tokenizer.decode(outputs[0], skip_special_tokens=True)


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate():
    try:
        data = request.get_json()
        input_text = data.get('input_text', '')
        is_jeju_to_standard = data.get('isJejuToStandard', True)

        # # 번역 수행
        # if is_jeju_to_standard:
        #     translated_text = translate_text(input_text,is_jeju_to_standard)  # 제주어 -> 표준어
        # else:
        translated_text = translate_text(input_text,is_jeju_to_standard)  # 표준어 -> 제주어 (필요 시 별도 함수로 처리)

        return jsonify({'translated_text': translated_text})
    
    except Exception as e:
        app.logger.error(f"Error in translate function: {e}")
        return jsonify({'error': 'Internal Server Error'}), 500


# Google Cloud Text-to-Speech 설정



# # Secret key 설정
# app.secret_key = os.urandom(24)



# 음성 합성 라우트 (TTS)
@app.route('/tts', methods=['POST'])
def tts():
    data = request.json
    text = data.get('text', '')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    client = texttospeech.TextToSpeechClient()

    synthesis_input = texttospeech.SynthesisInput(text=text)
    voice = texttospeech.VoiceSelectionParams(language_code="ko-KR", ssml_gender=texttospeech.SsmlVoiceGender.FEMALE)
    audio_config = texttospeech.AudioConfig(audio_encoding=texttospeech.AudioEncoding.MP3)

    response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)
    audio_content = base64.b64encode(response.audio_content).decode('utf-8')

    return jsonify({"audio_content": audio_content})



# 음성 인식 라우트 (STT)
@app.route('/stt', methods=['POST'])
def stt():
    data = request.json
    audio_content = base64.b64decode(data.get('audio', ''))

    client = speech.SpeechClient()
    audio = speech.RecognitionAudio(content=audio_content)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,
        language_code="ko-KR"
    )

    response = client.recognize(config=config, audio=audio)

    text = ''
    for result in response.results:
        text += result.alternatives[0].transcript

    return jsonify({"text": text})

 
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)