import easyocr
import fitz  # pymupdf
import numpy as np
from PIL import Image

if not hasattr(Image, "ANTIALIAS"):
    Image.ANTIALIAS = Image.Resampling.LANCZOS

class OCREngine:
    def __init__(self):
        print("🔧 EasyOCR 초기화 중...")
        self.reader = easyocr.Reader(['ko', 'en'], gpu=False)
        print("✅ EasyOCR 초기화 완료!")
    
    def extract_text(self, file_path, enable_pdf_ocr = False):
        """파일에서 텍스트 추출"""
        
        # PDF면 텍스트 직접 추출
        if file_path.lower().endswith('.pdf'):
            return self._extract_from_pdf(file_path, enable_pdf_ocr)
        
        # 이미지면 OCR
        else:
            return self._extract_from_image(file_path)
    
    def _extract_from_pdf(self, pdf_path, enable_pdf_ocr):
        """PDF에서 텍스트 직접 추출 (OCR 불필요!)"""
        try:
            doc = fitz.open(pdf_path)
            all_texts = []
            
            for page_num in range(len(doc)):
                page = doc[page_num]
                text = page.get_text()  # 텍스트 직접 추출!
                all_texts.append(text)

                if (enable_pdf_ocr):
                    pix = page.get_pixmap(matrix=fitz.Matrix(2, 2))
                    img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)
                    img_array = np.array(img)
                    result = self.reader.readtext(img_array, paragraph=False, rotation_info=[90, 180, 270])
                    texts = [text[1] for text in result]
                    all_texts.extend(texts)
            
            doc.close()
            
            full_text = ' '.join(all_texts)
            print(f"✅ PDF 텍스트 추출 완료: {full_text[:100]}...")
            return full_text
        
        except Exception as e:
            print(f"❌ PDF 텍스트 추출 에러: {e}")
            return ""
        
    def _extract_from_image(self, image_path):
        """이미지에서 텍스트 추출 (OCR)"""
        try:
            result = self.reader.readtext(
                image_path,
                rotation_info=[90, 180, 270]
            )
            texts = [text[1] for text in result]
            full_text = ' '.join(texts)
            print(f"✅ 이미지 텍스트 추출 완료: {full_text[:100]}...")
            return full_text
        
        except Exception as e:
            print(f"❌ 이미지 OCR 에러: {e}")
            return ""