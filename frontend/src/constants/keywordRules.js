export const DETECTION_ITEMS = [
  {
    key: 'residentRegistrationNumber',
    label: '주민등록번호',
  },
  {
    key: 'foreignResidentRegistrationNumber',
    label: '외국인 주민등록번호',
  },
  {
    key: 'emailAddress',
    label: '이메일',
  },
  {
    key: 'driverLicenseNumber',
    label: '운전면허번호',
  },
  {
    key: 'passportNumber',
    label: '여권번호',
  },
  {
    key: 'phoneNumber',
    label: '전화번호',
  },
  {
    key: 'mobilePhoneNumber',
    label: '휴대전화번호',
  },
  {
    key: 'businessRegistrationNumber',
    label: '사업자등록번호',
  },
  {
    key: 'corporateRegistrationNumber',
    label: '법인등록번호',
  },
  {
    key: 'creditCardNumber',
    label: '신용카드번호',
  },
  {
    key: 'bankAccountNumber',
    label: '계좌번호',
  },
];

export const DEFAULT_DETECTION_SETTINGS = {
  residentRegistrationNumber: { enabled: true },
  foreignResidentRegistrationNumber: { enabled: true },
  passportNumber: { enabled: true },
  driverLicenseNumber: { enabled: true },
  phoneNumber: { enabled: true },
  mobilePhoneNumber: { enabled: true },
  bankAccountNumber: { enabled: true },
  creditCardNumber: { enabled: true },
  emailAddress: { enabled: true },
  businessRegistrationNumber: { enabled: true },
};
