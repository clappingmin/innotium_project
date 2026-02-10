import easyocr
import cv2
import numpy as np
from PIL import Image

class OCREngine:
    """EasyOCR 엔진"""
    
    def __init__(self):
        print("🔧 EasyOCR 초기화 중... (처음 실행 시 모델 다운로드)")
        # 한글 + 영어 지원
        self.reader = easyocr.Reader(['ko', 'en'], gpu=False)
        print("✅ EasyOCR 초기화 완료!")
    
    def extract_text(self, image_path):
        """이미지에서 텍스트 추출"""
        try:
            # 이미지 읽기
            result = self.reader.readtext(image_path)
            
            # 텍스트만 추출
            texts = [text[1] for text in result]
            
            # 한 줄로 합치기
            full_text = ' '.join(texts)
            
            return full_text
        
        except Exception as e:
            print(f"OCR 에러: {e}")
            return ""