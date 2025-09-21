// Utility functions for converting form data to database enum values

export const convertToGender = (value: string): string => {
  const upperValue = value.toUpperCase();
  const validValues = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];
  
  if (validValues.includes(upperValue)) {
    return upperValue;
  }
  
  // Handle common variations
  switch (upperValue) {
    case 'M':
    case 'MAN':
      return 'MALE';
    case 'F':
    case 'WOMAN':
      return 'FEMALE';
    case 'NON-BINARY':
    case 'NON_BINARY':
      return 'OTHER';
    default:
      return 'PREFER_NOT_TO_SAY';
  }
};

export const convertToEducationLevel = (value: string): string => {
  const upperValue = value.toUpperCase().replace(/[\s-]/g, '_');
  const validValues = ['HIGH_SCHOOL', 'SENIOR_SECONDARY', 'UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA', 'PROFESSIONAL'];
  
  if (validValues.includes(upperValue)) {
    return upperValue;
  }
  
  // Handle common variations
  switch (upperValue) {
    case '10TH':
    case 'CLASS_10':
    case 'TENTH':
      return 'HIGH_SCHOOL';
    case '12TH':
    case 'CLASS_12':
    case 'TWELFTH':
      return 'SENIOR_SECONDARY';
    case 'BACHELOR':
    case 'BACHELORS':
    case 'UG':
      return 'UNDERGRADUATE';
    case 'MASTER':
    case 'MASTERS':
    case 'PG':
      return 'POSTGRADUATE';
    default:
      return 'HIGH_SCHOOL';
  }
};

export const convertToAcademicPerformance = (value: string): string => {
  const upperValue = value.toUpperCase().replace(/[\s-]/g, '_');
  const validValues = ['EXCELLENT', 'VERY_GOOD', 'GOOD', 'AVERAGE', 'BELOW_AVERAGE'];
  
  if (validValues.includes(upperValue)) {
    return upperValue;
  }
  
  // Handle common variations
  switch (upperValue) {
    case 'OUTSTANDING':
    case 'A_GRADE':
    case 'A':
      return 'EXCELLENT';
    case 'B_GRADE':
    case 'B':
      return 'VERY_GOOD';
    case 'C_GRADE':
    case 'C':
      return 'GOOD';
    case 'D_GRADE':
    case 'D':
      return 'AVERAGE';
    case 'F_GRADE':
    case 'F':
    case 'POOR':
      return 'BELOW_AVERAGE';
    default:
      return 'GOOD';
  }
};

export const convertToStudyMode = (value: string): string => {
  const upperValue = value.toUpperCase().replace(/[\s-]/g, '_');
  const validValues = ['ONLINE', 'OFFLINE', 'HYBRID', 'SELF_PACED'];
  
  if (validValues.includes(upperValue)) {
    return upperValue;
  }
  
  // Handle common variations
  switch (upperValue) {
    case 'IN_PERSON':
    case 'PHYSICAL':
    case 'CLASSROOM':
      return 'OFFLINE';
    case 'MIXED':
    case 'BLENDED':
      return 'HYBRID';
    case 'SELF_STUDY':
      return 'SELF_PACED';
    default:
      return 'HYBRID';
  }
};

export const convertToCareerField = (value: string): string => {
  const upperValue = value.toUpperCase().replace(/[\s&-]/g, '_');
  
  // Define all valid career fields from the enum
  const validFields = [
    'TECHNOLOGY', 'ENGINEERING', 'MEDICINE', 'BUSINESS', 'FINANCE', 'EDUCATION', 'ARTS', 'SCIENCE',
    'LAW', 'JOURNALISM', 'PSYCHOLOGY', 'SOCIAL_WORK', 'AGRICULTURE', 'ARCHITECTURE', 'DESIGN',
    'ENTERTAINMENT', 'SPORTS', 'GOVERNMENT', 'NON_PROFIT', 'RESEARCH', 'HEALTHCARE', 'HOSPITALITY',
    'RETAIL', 'MANUFACTURING', 'CONSULTING', 'REAL_ESTATE', 'MARKETING', 'SALES', 'HR',
    'LOGISTICS', 'AVIATION', 'MARINE', 'DEFENSE', 'OTHER'
  ];
  
  if (validFields.includes(upperValue)) {
    return upperValue;
  }
  
  // Handle common variations and mappings
  const fieldMappings: { [key: string]: string } = {
    'IT': 'TECHNOLOGY',
    'COMPUTER_SCIENCE': 'TECHNOLOGY',
    'SOFTWARE': 'TECHNOLOGY',
    'COMPUTERS': 'TECHNOLOGY',
    'TECH': 'TECHNOLOGY',
    'MEDICAL': 'MEDICINE',
    'DOCTOR': 'MEDICINE',
    'NURSING': 'HEALTHCARE',
    'MANAGEMENT': 'BUSINESS',
    'COMMERCE': 'BUSINESS',
    'BANKING': 'FINANCE',
    'ACCOUNTING': 'FINANCE',
    'TEACHING': 'EDUCATION',
    'LITERATURE': 'ARTS',
    'MUSIC': 'ARTS',
    'PAINTING': 'ARTS',
    'PHYSICS': 'SCIENCE',
    'CHEMISTRY': 'SCIENCE',
    'BIOLOGY': 'SCIENCE',
    'MATHEMATICS': 'SCIENCE',
    'LEGAL': 'LAW',
    'ADVOCATE': 'LAW',
    'MEDIA': 'JOURNALISM',
    'NEWS': 'JOURNALISM',
    'COUNSELING': 'PSYCHOLOGY',
    'THERAPY': 'PSYCHOLOGY',
    'FARMING': 'AGRICULTURE',
    'BUILDING': 'ARCHITECTURE',
    'CONSTRUCTION': 'ENGINEERING',
    'CIVIL': 'ENGINEERING',
    'MECHANICAL': 'ENGINEERING',
    'ELECTRICAL': 'ENGINEERING',
    'GRAPHICS': 'DESIGN',
    'UI_UX': 'DESIGN',
    'MOVIES': 'ENTERTAINMENT',
    'ACTING': 'ENTERTAINMENT',
    'GAMING': 'ENTERTAINMENT',
    'ATHLETICS': 'SPORTS',
    'FITNESS': 'SPORTS',
    'PUBLIC_SERVICE': 'GOVERNMENT',
    'CIVIL_SERVICE': 'GOVERNMENT',
    'CHARITY': 'NON_PROFIT',
    'VOLUNTEERING': 'NON_PROFIT',
    'HOTEL': 'HOSPITALITY',
    'TRAVEL': 'HOSPITALITY',
    'TOURISM': 'HOSPITALITY',
    'SHOP': 'RETAIL',
    'STORE': 'RETAIL',
    'FACTORY': 'MANUFACTURING',
    'PRODUCTION': 'MANUFACTURING',
    'ADVISORY': 'CONSULTING',
    'PROPERTY': 'REAL_ESTATE',
    'ADVERTISING': 'MARKETING',
    'PROMOTION': 'MARKETING',
    'HUMAN_RESOURCES': 'HR',
    'PERSONNEL': 'HR',
    'SUPPLY_CHAIN': 'LOGISTICS',
    'SHIPPING': 'LOGISTICS',
    'PILOT': 'AVIATION',
    'FLIGHT': 'AVIATION',
    'NAVY': 'MARINE',
    'SHIP': 'MARINE',
    'MILITARY': 'DEFENSE',
    'ARMY': 'DEFENSE',
  };
  
  return fieldMappings[upperValue] || 'OTHER';
};

export const convertToIncomeRange = (value: string): string => {
  const upperValue = value.toUpperCase().replace(/[\s-]/g, '_');
  const validValues = ['BELOW_2_LPA', 'LPA_2_5', 'LPA_5_10', 'LPA_10_20', 'LPA_20_50', 'ABOVE_50_LPA', 'PREFER_NOT_TO_SAY'];
  
  if (validValues.includes(upperValue)) {
    return upperValue;
  }
  
  // Handle common variations
  switch (upperValue) {
    case 'LESS_THAN_2':
    case 'UNDER_2':
      return 'BELOW_2_LPA';
    case '2_TO_5':
    case 'LPA_2_TO_5':
      return 'LPA_2_5';
    case '5_TO_10':
    case 'LPA_5_TO_10':
      return 'LPA_5_10';
    case '10_TO_20':
    case 'LPA_10_TO_20':
      return 'LPA_10_20';
    case '20_TO_50':
    case 'LPA_20_TO_50':
      return 'LPA_20_50';
    case 'MORE_THAN_50':
    case 'ABOVE_50':
      return 'ABOVE_50_LPA';
    default:
      return 'PREFER_NOT_TO_SAY';
  }
};

export const validateAndConvertFormData = (formData: any) => {
  try {
    return {
      userId: formData.userId,
      fullName: formData.fullName,
      age: parseInt(formData.age),
      gender: convertToGender(formData.gender),
      location: formData.location,
      currentEducation: convertToEducationLevel(formData.currentEducation),
      currentClass: formData.currentClass,
      previousAcademicPerformance: formData.previousAcademicPerformance ? 
        convertToAcademicPerformance(formData.previousAcademicPerformance) : undefined,
      currentSubjects: Array.isArray(formData.currentSubjects) ? formData.currentSubjects : [],
      careerInterests: Array.isArray(formData.careerInterests) ? 
        formData.careerInterests.map((field: string) => convertToCareerField(field)) : [],
      preferredStudyMode: convertToStudyMode(formData.preferredStudyMode),
      academicGoals: formData.academicGoals,
      strengths: Array.isArray(formData.strengths) ? formData.strengths : [],
      challenges: Array.isArray(formData.challenges) ? formData.challenges : [],
      parentOccupation: formData.parentOccupation || undefined,
      familyIncome: formData.familyIncome ? convertToIncomeRange(formData.familyIncome) : undefined,
    };
  } catch (error) {
    console.error('Error validating and converting form data:', error);
    throw new Error('Invalid form data provided');
  }
};