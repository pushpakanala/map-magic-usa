
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
  school_programs: string[] | string;
  eligibility_addmission_exams: string[];
  founded_in: number;
  cost_of_living_near_university: string;
  type: string;
  contact_details: {
    phone: string;
    email: string;
  } | string;
  graduation_rate: string;
  acceptance_rate: string;
}

export interface Programs {
  undergrad_programs: Program[];
  grad_programs: Program[];
}

export interface Program {
  program_name: string;
  fees: string | number;
  program_duration: string;
  course_rank: string | number;
}

export interface Students {
  total_students: number;
  grad_students: number;
  men: number | string;
  women: number | string;
  race_ethnicity: {
    [key: string]: string;
  };
}

export interface Faculty {
  men: number | string;
  women: number | string;
  race_ethnicity: {
    [key: string]: string;
  };
}
