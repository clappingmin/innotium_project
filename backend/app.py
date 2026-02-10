from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
import os
from werkzeug.utils import secure_filename
from ocr.ocr_engine import OCREngine
from detector.pii_detector import PIIDetector

app = Flask(__name__)
CORS(app)  # React 연결 위해 필수!


# 설정
BASE_DIR = Path(__file__).resolve().parent
UPLOAD_FOLDER = BASE_DIR / 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'pdf'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 100 * 1024 * 1024  # 100MB

# OCR, 탐지기 초기화
ocr_engine = OCREngine()
pii_detector = PIIDetector()


def allowed_file(filename):
    """허용된 파일 확장자 체크"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/api/health', methods=['GET'])
def health_check():
    """헬스 체크"""
    return jsonify({'status': 'ok'})


@app.route('/api/analyze', methods=['POST'])
def analyze_document():
    """문서 분석 API"""
    try:
        # 1. 파일 체크
        if 'file' not in request.files:
            return jsonify({'error': '파일이 없습니다'}), 400
        
        file = request.files['file']
        
        if file.filename == '':
            return jsonify({'error': '파일명이 없습니다'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': '지원하지 않는 파일 형식입니다'}), 400
        
        # 2. 설정 받기 (localStorage에서 보낸 설정)
        settings = request.form.get('settings')
        if settings:
            import json
            settings = json.loads(settings)
        else:
            settings = {}
        
        # 3. 파일 저장
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # 4. OCR 실행
        print(f"📄 OCR 시작: {filename}")
        extracted_text = ocr_engine.extract_text(filepath)

        print(f"✅ 추출된 텍스트: {extracted_text[:100]}...")
        
        # 5. 민감정보 탐지
        print("🔍 민감정보 탐지 중...")
        detection_result = pii_detector.detect(extracted_text, settings)
        
        # 6. 파일 삭제 (분석 후)
        os.remove(filepath)
        
        # 7. 결과 반환
        return jsonify({
            'success': True,
            'filename': filename,
            'extracted_text': extracted_text,
            'detection': detection_result,
            'classification': detection_result['classification'],
            'risk_score': detection_result['risk_score'],
            'detected_items': detection_result['detected_items']
        })
    
    except Exception as e:
        print(f"❌ 에러: {str(e)}")
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("🚀 Flask 서버 시작...")
    print("📍 http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000)