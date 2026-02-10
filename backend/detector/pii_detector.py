import re
from .patterns import PIIPatterns

class PIIDetector:
    """민감정보 탐지기 (개선 버전)"""
    
    def __init__(self):
        self.patterns = PIIPatterns()
        
        # 우선순위 정의 (낮을수록 우선)
        self.priority = {
            'residentRegistrationNumber': 1,
            'foreignResidentRegistrationNumber': 1,
            'creditCardNumber': 1,
            'passportNumber': 2,
            'driverLicenseNumber': 2,
            'mobilePhoneNumber': 3,
            'phoneNumber': 4,
            'businessRegistrationNumber': 5,
            'bankAccountNumber': 6,
            'emailAddress': 7,
        }
    
    def detect(self, text, settings=None):
        """
        텍스트에서 민감정보 탐지
        
        Args:
            text: OCR로 추출한 텍스트
            settings: 프론트에서 보낸 설정
        
        Returns:
            dict: 탐지 결과
        """
        if not settings:
            settings = self._get_default_settings()
        
        # 1단계: 모든 후보 수집
        all_candidates = {}  # {번호: [타입들]}
        
        pii_types = [
            'residentRegistrationNumber', 'foreignResidentRegistrationNumber', 
            'passportNumber', 'driverLicenseNumber',
            'mobilePhoneNumber', 'phoneNumber',
            'bankAccountNumber', 'creditCardNumber', 
            'emailAddress', 'businessRegistrationNumber'
        ]
        
        for pii_type in pii_types:
            # 설정에서 활성화 여부 확인
            if not settings.get(pii_type, {}).get('enabled', True):
                continue
            
            # 패턴으로 검출
            pattern = self.patterns.get_pattern(pii_type)
            if pattern:
                matches = re.findall(pattern, text)
                
                for match in matches:
                    # 마스킹 데이터 제외
                    if '*' in match:
                        continue
                    
                    # 후보에 추가
                    if match not in all_candidates:
                        all_candidates[match] = []
                    all_candidates[match].append(pii_type)
        
        # 2단계: 중복 제거 (가장 적합한 타입만 선택)
        detected_items = self._remove_duplicates(all_candidates)
        
        # 3단계: 마스킹 처리
        for pii_type, items in detected_items.items():
            masked = [self._mask(item, pii_type) for item in items]
            detected_items[pii_type] = {
                'count': len(items),
                'items': masked,
                'raw': items
            }
        
        total_count = sum(d['count'] for d in detected_items.values())
        
        # 분류 결정
        classification = self._classify(total_count, detected_items)
        risk_score = self._calculate_risk(total_count, detected_items)
        
        return {
            'classification': classification,
            'risk_score': risk_score,
            'total_count': total_count,
            'detected_items': detected_items
        }
    
    def _remove_duplicates(self, candidates):
        """
        중복 제거: 같은 번호가 여러 타입에 걸릴 때 가장 적합한 것만 선택
        
        Args:
            candidates: {번호: [타입들]}
        
        Returns:
            {타입: [번호들]}
        """
        result = {}
        
        for number, types in candidates.items():
            if len(types) == 1:
                # 중복 없으면 그대로
                pii_type = types[0]
            else:
                # 중복 있으면 가장 적합한 타입 선택
                pii_type = self._select_best_type(number, types)
            
            if pii_type not in result:
                result[pii_type] = []
            result[pii_type].append(number)
        
        return result
    
    def _select_best_type(self, number, types):
        """
        같은 번호가 여러 타입에 걸릴 때 가장 적합한 타입 선택
        
        Args:
            number: 검출된 번호
            types: 매칭된 타입들
        
        Returns:
            가장 적합한 타입
        """
        # 각 타입별 점수 계산
        scores = {}
        for pii_type in types:
            scores[pii_type] = self._calculate_confidence(number, pii_type)
        
        # 점수 같으면 우선순위로
        max_score = max(scores.values())
        candidates = [t for t, s in scores.items() if s == max_score]
        
        if len(candidates) == 1:
            return candidates[0]
        
        # 우선순위 높은 것 선택
        return min(candidates, key=lambda t: self.priority.get(t, 99))
    
    def _calculate_confidence(self, number, pii_type):
        """
        번호가 해당 타입에 얼마나 적합한지 점수 계산
        
        Args:
            number: 검출된 번호
            pii_type: 타입
        
        Returns:
            점수 (높을수록 적합)
        """
        score = 0
        clean_number = number.replace('-', '').replace(' ', '')
        
        # 1. 구분자(-) 있으면 형식 정확도 높음 (+50)
        if '-' in number:
            score += 50
        
        # 2. 길이 정확도
        length = len(clean_number)
        
        if pii_type == 'residentRegistrationNumber':
            if length == 13:
                score += 100
        
        elif pii_type == 'foreignResidentRegistrationNumber':
            if length == 13:
                score += 100
        
        elif pii_type == 'mobilePhoneNumber':
            if length == 11 and clean_number.startswith('010'):
                score += 100
            elif length == 10 and clean_number.startswith('01'):
                score += 80
        
        elif pii_type == 'phoneNumber':
            if 9 <= length <= 11 and not clean_number.startswith('01'):
                score += 70
        
        elif pii_type == 'businessRegistrationNumber':
            if length == 10:
                score += 90
        
        elif pii_type == 'bankAccountNumber':
            if 10 <= length <= 14:
                score += 60
        
        elif pii_type == 'driverLicenseNumber':
            if length == 12:
                score += 90
        
        elif pii_type == 'creditCardNumber':
            if length == 16:
                score += 100
        
        elif pii_type == 'passportNumber':
            if length == 9:  # 1글자 + 8숫자
                score += 100
        
        # 3. 시작 패턴 보너스
        if pii_type == 'mobilePhoneNumber' and clean_number.startswith('010'):
            score += 20
        
        if pii_type == 'phoneNumber' and clean_number.startswith('02'):
            score += 20
        
        return score
    
    def _mask(self, text, pii_type):
        """민감정보 마스킹"""
        if pii_type in ['residentRegistrationNumber', 'foreignResidentRegistrationNumber']:
            # 123456-1234567 → 123456-1******
            if '-' in text:
                parts = text.split('-')
                return f"{parts[0]}-{parts[1][0]}******"
            else:
                return text[:7] + '******'
        
        elif pii_type in ['phoneNumber', 'mobilePhoneNumber']:
            # 010-1234-5678 → 010-****-5678
            text = text.replace(' ', '')
            if '-' in text:
                parts = text.split('-')
                if len(parts) == 3:
                    return f"{parts[0]}-****-{parts[2]}"
            # 01012345678 → 010****5678
            elif len(text) >= 10:
                return text[:3] + '****' + text[-4:]
            return text
        
        elif pii_type == 'bankAccountNumber':
            # 110-123-456789 → 110-***-456789
            if '-' in text:
                parts = text.split('-')
                if len(parts) >= 2:
                    return f"{parts[0]}-***-{parts[-1]}"
            # 12자리 이상이면 중간 마스킹
            elif len(text) >= 10:
                return text[:3] + '***' + text[-4:]
            return text
        
        elif pii_type == 'creditCardNumber':
            # 1234-5678-9012-3456 → 1234-****-****-3456
            parts = text.split('-')
            if len(parts) == 4:
                return f"{parts[0]}-****-****-{parts[3]}"
            return text
        
        elif pii_type == 'businessRegistrationNumber':
            # 123-45-67890 → 123-**-67890
            if '-' in text:
                parts = text.split('-')
                if len(parts) == 3:
                    return f"{parts[0]}-**-{parts[2]}"
            elif len(text) == 10:
                return text[:3] + '**' + text[-5:]
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
        high_risk = [
            'residentRegistrationNumber', 
            'foreignResidentRegistrationNumber', 
            'bankAccountNumber', 
            'creditCardNumber'
        ]
        
        risk = min(total_count * 20, 100)
        
        # 고위험 정보 있으면 +20
        for item in high_risk:
            if item in detected_items:
                risk = min(risk + 20, 100)
        
        return risk
    
    def _get_default_settings(self):
        """기본 설정"""
        return {
            'residentRegistrationNumber': {'enabled': True},
            'foreignResidentRegistrationNumber': {'enabled': True},
            'passportNumber': {'enabled': True},
            'driverLicenseNumber': {'enabled': True},
            'phoneNumber': {'enabled': True},
            'mobilePhoneNumber': {'enabled': True},
            'bankAccountNumber': {'enabled': True},
            'creditCardNumber': {'enabled': True},
            'emailAddress': {'enabled': True},
            'businessRegistrationNumber': {'enabled': True},
        }
