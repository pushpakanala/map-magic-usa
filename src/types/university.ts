
export interface UniversityResponse {
  status: {
    code: number;
    message: string;
  };
  data: {
    school: School;
    programs: Programs;
    students: Students;
    faculty: Faculty;
  };
}

export interface School {
  zip: string;
  city: string;
  name: string;
  state: string;
  address: string;
  latitude: number;
  longitude: number;
  accreditor: string;
  school_url: string;
  accreditor_code: string;
  us_ranking: number;
  school_programs: string[];
  eligibility_addmission_exams: string[];
}

export interface Program {
  program_name: string;
  fees: string;
  program_duration: string;
}

export interface Programs {
  undergrad_programs: Program[];
  grad_programs: Program[];
}

export interface Students {
  total_students: number;
  grad_students: number;
  men: number;
  women: number;
  race_ethnicity: {
    White: number;
    Hispanic: number;
    "Black or African American": number;
    Asian: number;
    Other: number;
  };
}

export interface Faculty {
  men: number;
  women: number;
  race_ethnicity: {
    White: number;
    Hispanic: number;
    "Black or African American": number;
    Asian: number;
    Other: number;
  };
}
