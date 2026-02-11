export const DETECTION_ITEMS = {
  residentRegistrationNumber: "주민등록번호",
  foreignResidentRegistrationNumber: "외국인 주민등록번호",
  emailAddress: "이메일",
  driverLicenseNumber: "운전면허번호",
  passportNumber: "여권번호",
  phoneNumber: "전화번호",
  mobilePhoneNumber: "휴대전화번호",
  businessRegistrationNumber: "사업자등록번호",
  corporateRegistrationNumber: "법인등록번호",
  creditCardNumber: "신용카드번호",
  bankAccountNumber: "계좌번호",
  keyword: "키워드",
};

export const DEFAULT_DETECTION_SETTINGS = {
  residentRegistrationNumber: { enabled: true, count: 0, exceptions: "" },
  foreignResidentRegistrationNumber: {
    enabled: true,
    count: 0,
    exceptions: "",
  },
  passportNumber: { enabled: true, count: 0, exceptions: "" },
  driverLicenseNumber: { enabled: true, count: 0, exceptions: "" },
  emailAddress: { enabled: true, count: 0, exceptions: "" },
  phoneNumber: { enabled: true, count: 0, exceptions: "" },
  mobilePhoneNumber: { enabled: true, count: 0, exceptions: "" },
  businessRegistrationNumber: {
    enabled: true,
    count: 0,
    exceptions: "",
  },
  corporateRegistrationNumber: {
    enabled: true,
    count: 0,
    exceptions: "",
  },
  creditCardNumber: { enabled: true, count: 0, exceptions: "" },
  bankAccountNumber: {
    enabled: true,
    count: 0,
    exceptions: "",
  },
  keyword: [],
};

export const EMPTY_KEYWORD = {
  value: "",
  count: 0,
};
