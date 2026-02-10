import re

class PIIPatterns:
    """민감정보 정규식 패턴 (개선 버전)"""
    
    # 주민등록번호: 123456-1234567 (정확히)
    RESIDENT_NUMBER = r'\b\d{6}-[1-4]\d{6}\b'
    
    # 외국인등록번호: 123456-5678901
    FOREIGN_NUMBER = r'\b\d{6}-[5-8]\d{6}\b'
    
    # 여권번호: M12345678 (대문자 + 정확히 8자리 숫자, * 제외)
    PASSPORT = r'\b[A-Z](?!\*)\d{8}\b'
    
    # 운전면허번호: 12-34-567890-12 또는 12자리
    DRIVER_LICENSE = r'\b\d{2}-\d{2}-\d{6}-\d{2}\b|\b(?<!\d)\d{12}(?!\d)\b'
    
    # 휴대전화번호: 010-1234-5678 또는 01012345678
    MOBILE_PHONE = r'\b01[016789]-?\d{3,4}-?\d{4}\b'
    
    # 일반전화번호: 02-1234-5678 (지역번호)
    PHONE = r'\b0(?!1[016789])\d{1,2}-?\d{3,4}-?\d{4}\b'
    
    # 계좌번호: 구분자 있으면 3-2~6-4~8, 없으면 10~14자리
    ACCOUNT = r'\b\d{3}-\d{2,6}-\d{4,8}\b|\b(?<!\d)\d{10,14}(?!\d)\b'
    
    # 신용카드: 1234-5678-9012-3456 (정확히 4-4-4-4)
    CREDIT_CARD = r'\b\d{4}-\d{4}-\d{4}-\d{4}\b'
    
    # 이메일
    EMAIL = r'\b[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}\b'
    
    # 사업자등록번호: 123-45-67890 또는 10자리
    BUSINESS_NUMBER = r'\b\d{3}-\d{2}-\d{5}\b|\b(?<!\d)\d{10}(?!\d)\b'
    
    @classmethod
    def get_pattern(cls, pii_type):
        """타입별 패턴 반환"""
        patterns = {
            'residentRegistrationNumber': cls.RESIDENT_NUMBER,
            'foreignResidentRegistrationNumber': cls.FOREIGN_NUMBER,
            'passportNumber': cls.PASSPORT,
            'driverLicenseNumber': cls.DRIVER_LICENSE,
            'phoneNumber': cls.PHONE,
            'mobilePhoneNumber': cls.MOBILE_PHONE,
            'bankAccountNumber': cls.ACCOUNT,
            'creditCardNumber': cls.CREDIT_CARD,
            'emailAddress': cls.EMAIL,
            'businessRegistrationNumber': cls.BUSINESS_NUMBER,
        }
        return patterns.get(pii_type)