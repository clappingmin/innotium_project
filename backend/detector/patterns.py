import re

class PIIPatterns:
    """민감정보 정규식 패턴"""
    
    # 주민등록번호: 123456-1234567
    RESIDENT_NUMBER = r'\d{6}[-\s]?[1-4]\d{6}'
    
    # 외국인등록번호: 123456-5678901
    FOREIGN_NUMBER = r'\d{6}[-\s]?[5-8]\d{6}'
    
    # 여권번호: M12345678 (M, S 등으로 시작)
    PASSPORT = r'[A-Z]\d{8}'
    
    # 운전면허번호: 12-34-567890-12
    DRIVER_LICENSE = r'\d{2}[-\s]?\d{2}[-\s]?\d{6}[-\s]?\d{2}'
    
    # 전화번호: 010-1234-5678
    PHONE = r'01[016789][-\s]?\d{3,4}[-\s]?\d{4}'
    
    # 전화번호2: 02-1234-5678
    PHONE2 = r'0\d{1,2}[-\s]?\d{3,4}[-\s]?\d{4}'
    
    # 계좌번호: 110-123-456789
    ACCOUNT = r'\d{3}[-\s]?\d{2,}[-\s]?\d{4,}'
    
    # 신용카드: 1234-5678-9012-3456
    CREDIT_CARD = r'\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}'
    
    # 이메일
    EMAIL = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    
    # 사업자등록번호: 123-45-67890
    BUSINESS_NUMBER = r'\d{3}[-\s]?\d{2}[-\s]?\d{5}'
    
    @classmethod
    def get_pattern(cls, pii_type):
        """타입별 패턴 반환"""
        patterns = {
            '주민등록번호': cls.RESIDENT_NUMBER,
            '외국인등록번호': cls.FOREIGN_NUMBER,
            '여권번호': cls.PASSPORT,
            '운전면허번호': cls.DRIVER_LICENSE,
            '전화번호': cls.PHONE,
            '전화번호2': cls.PHONE2,
            '계좌번호': cls.ACCOUNT,
            '신용카드번호': cls.CREDIT_CARD,
            '이메일': cls.EMAIL,
            '사업자등록번호': cls.BUSINESS_NUMBER,
        }
        return patterns.get(pii_type)