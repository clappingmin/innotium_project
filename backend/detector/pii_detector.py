import re
from .patterns import PIIPatterns

class PIIDetector:
    """민감정보 탐지기"""
    
    def __init__(self):
        self.patterns = PIIPatterns()
    
    def detect(self, text, settings=None):
        """
        텍스트에서 민감정보 탐지
        
        Args:
            text: OCR로 추출한 텍스트
            settings: 프론트에서 보낸 설정 (어떤 정보를 검출할지)
        
        Returns:
            dict: 탐지 결과
        """
        if not settings:
            settings = self._get_default_settings()
        
        detected_items = {}
        total_count = 0
        
        # 각 민감정보 타입별로 검사
        pii_types = [
            '주민등록번호', '외국인등록번호', '여권번호', '운전면허번호',
            '전화번호', '계좌번호', '신용카드번호', '이메일', '사업자등록번호'
        ]
        
        for pii_type in pii_types:
            # 설정에서 활성화 여부 확인
            if not settings.get(pii_type, {}).get('enabled', True):
                continue
            
            # 패턴으로 검출
            pattern = self.patterns.get_pattern(pii_type)
            if pattern:
                matches = re.findall(pattern, text)
                
                if matches:
                    # 중복 제거
                    unique_matches = list(set(matches))
                    count = len(unique_matches)
                    
                    # 마스킹 처리
                    masked = [self._mask(match, pii_type) for match in unique_matches]
                    
                    detected_items[pii_type] = {
                        'count': count,
                        'items': masked,
                        'raw': unique_matches  # 실제 값 (필요시)
                    }
                    
                    total_count += count
        
        # 분류 결정
        classification = self._classify(total_count, detected_items)
        risk_score = self._calculate_risk(total_count, detected_items)
        
        return {
            'classification': classification,
            'risk_score': risk_score,
            'total_count': total_count,
            'detected_items': detected_items
        }
    
    def _mask(self, text, pii_type):
        """민감정보 마스킹"""
        if pii_type in ['주민등록번호', '외국인등록번호']:
            # 123456-1234567 → 123456-1******
            if '-' in text:
                parts = text.split('-')
                return f"{parts[0]}-{parts[1][0]}******"
            else:
                return text[:7] + '******'
        
        elif pii_type == '전화번호':
            # 010-1234-5678 → 010-****-5678
            parts = text.replace(' ', '').split('-')
            if len(parts) == 3:
                return f"{parts[0]}-****-{parts[2]}"
            return text
        
        elif pii_type == '계좌번호':
            # 110-123-456789 → 110-***-456789
            parts = text.split('-')
            if len(parts) >= 2:
                return f"{parts[0]}-***-{parts[-1]}"
            return text
        
        elif pii_type == '신용카드번호':
            # 1234-5678-9012-3456 → 1234-****-****-3456
            parts = text.split('-')
            if len(parts) == 4:
                return f"{parts[0]}-****-****-{parts[3]}"
            return text
        
        else:
            # 기타: 절반 마스킹
            half = len(text) // 2
            return text[:half] + '*' * (len(text) - half)
    
    def _classify(self, total_count, detected_items):
        """문서 분류"""
        if total_count == 0:
            return '일반'
        elif total_count <= 2:
            return '주의'
        else:
            return '민감'
    
    def _calculate_risk(self, total_count, detected_items):
        """위험도 점수 (0-100)"""
        if total_count == 0:
            return 0
        
        # 주민번호, 계좌번호 등 민감도 높은 정보 가중치
        high_risk = ['주민등록번호', '외국인등록번호', '계좌번호', '신용카드번호']
        
        risk = min(total_count * 20, 100)
        
        # 고위험 정보 있으면 +20
        for item in high_risk:
            if item in detected_items:
                risk = min(risk + 20, 100)
        
        return risk
    
    def _get_default_settings(self):
        """기본 설정"""
        return {
            '주민등록번호': {'enabled': True},
            '외국인등록번호': {'enabled': True},
            '여권번호': {'enabled': True},
            '운전면허번호': {'enabled': True},
            '전화번호': {'enabled': True},
            '계좌번호': {'enabled': True},
            '신용카드번호': {'enabled': True},
            '이메일': {'enabled': True},
            '사업자등록번호': {'enabled': True},
        }