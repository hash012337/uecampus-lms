export interface Course {
  id: string;
  title: string;
  code: string;
  category: string;
  subcategory: string;
  level: string;
  duration: string;
  mode: string;
  partner?: string;
  description: string;
  overview: string;
  learningOutcomes: string[];
  modules: string[];
  entryRequirements: string[];
  careerOpportunities: string[];
  fees: {
    tuition: string;
    installments: boolean;
  };
  accreditation: string;
  rating: number;
  enrolledStudents: number;
}

export const allCoursesData: Course[] = [
  // A. Bachelor's / Undergraduate Degrees (13 courses)
  {
    id: "bsc-it-walsh",
    title: "BSc in Information Technology",
    code: "BSIT-W-001",
    category: "Bachelor's Programs",
    subcategory: "Information Technology",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Walsh College",
    description: "Comprehensive bachelor's program in information technology covering software development, networking, and systems administration.",
    overview: "This program provides a solid foundation in information technology, preparing students for careers in software development, IT management, cybersecurity, and systems administration.",
    learningOutcomes: [
      "Design and develop software applications using modern programming languages",
      "Implement and manage network infrastructure and security systems",
      "Analyze business requirements and propose technical solutions",
      "Apply project management methodologies to IT projects",
      "Demonstrate proficiency in database design and management"
    ],
    modules: [
      "Programming Fundamentals",
      "Data Structures & Algorithms",
      "Database Management Systems",
      "Computer Networks",
      "Web Development",
      "Software Engineering",
      "Cloud Computing",
      "Cybersecurity Basics",
      "Mobile Application Development",
      "IT Project Management",
      "Systems Analysis & Design",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Basic computer literacy",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Mathematics at high school level"
    ],
    careerOpportunities: [
      "Software Developer",
      "Systems Administrator",
      "IT Project Manager",
      "Network Engineer",
      "Database Administrator",
      "Cloud Solutions Architect"
    ],
    fees: {
      tuition: "$12,000 - $15,000 per year",
      installments: true
    },
    accreditation: "Walsh College - Accredited by HLC",
    rating: 4.8,
    enrolledStudents: 450
  },
  {
    id: "bsc-cyber-security-walsh",
    title: "BSc in Cyber Security",
    code: "BSCS-W-002",
    category: "Bachelor's Programs",
    subcategory: "Cyber Security",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Walsh College",
    description: "Specialized degree focusing on protecting computer systems, networks, and data from cyber threats.",
    overview: "This comprehensive cybersecurity program equips students with the knowledge and skills to protect organizations from cyber threats.",
    learningOutcomes: [
      "Identify and mitigate security vulnerabilities in systems and networks",
      "Implement security policies and compliance frameworks",
      "Conduct penetration testing and vulnerability assessments",
      "Respond to and investigate security incidents",
      "Design secure network architectures and defense strategies"
    ],
    modules: [
      "Introduction to Cybersecurity",
      "Ethical Hacking & Penetration Testing",
      "Network Security",
      "Cryptography",
      "Digital Forensics",
      "Security Operations Center (SOC)",
      "Cloud Security",
      "Risk Management",
      "Security Compliance",
      "Incident Response",
      "Threat Intelligence",
      "Final Year Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Basic understanding of computer systems",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Mathematics aptitude"
    ],
    careerOpportunities: [
      "Cybersecurity Analyst",
      "Security Consultant",
      "Penetration Tester",
      "Security Operations Analyst",
      "Information Security Manager",
      "Incident Response Specialist"
    ],
    fees: {
      tuition: "$12,500 - $15,500 per year",
      installments: true
    },
    accreditation: "Walsh College - Accredited by HLC",
    rating: 4.7,
    enrolledStudents: 380
  },
  {
    id: "bsc-data-analytics-walsh",
    title: "BSc in Data Analytics",
    code: "BSDA-W-003",
    category: "Bachelor's Programs",
    subcategory: "Data Analytics",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Walsh College",
    description: "Data-driven program focusing on statistical analysis, data visualization, and business intelligence.",
    overview: "Learn to transform raw data into actionable insights using modern analytics tools and methodologies.",
    learningOutcomes: [
      "Analyze large datasets using statistical methods",
      "Create data visualizations and dashboards",
      "Apply machine learning techniques to business problems",
      "Design and implement data warehouses",
      "Communicate data-driven insights to stakeholders"
    ],
    modules: [
      "Statistics for Data Science",
      "Data Mining",
      "Python for Data Analysis",
      "SQL and Database Systems",
      "Data Visualization",
      "Machine Learning Fundamentals",
      "Business Intelligence",
      "Big Data Technologies",
      "Predictive Analytics",
      "Data Ethics",
      "Analytics Capstone",
      "Industry Project"
    ],
    entryRequirements: [
      "High school diploma with strong math background",
      "Basic computer skills",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Analytical thinking ability"
    ],
    careerOpportunities: [
      "Data Analyst",
      "Business Intelligence Analyst",
      "Data Scientist",
      "Analytics Consultant",
      "Reporting Analyst",
      "Market Research Analyst"
    ],
    fees: {
      tuition: "$11,500 - $14,500 per year",
      installments: true
    },
    accreditation: "Walsh College - Accredited by HLC",
    rating: 4.6,
    enrolledStudents: 320
  },
  {
    id: "bba-international-business",
    title: "Bachelor of Business Administration - International Business",
    code: "BBA-IB-004",
    category: "Bachelor's Programs",
    subcategory: "Business Administration",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online/Hybrid",
    partner: "PPA / UeCampus",
    description: "Comprehensive business degree with focus on global markets, international trade, and cross-cultural management.",
    overview: "Prepares students for careers in global business, international trade, and multinational corporations.",
    learningOutcomes: [
      "Understand global business environments and cultures",
      "Apply international trade regulations and policies",
      "Develop cross-cultural communication skills",
      "Analyze global market trends and opportunities",
      "Manage international business operations"
    ],
    modules: [
      "Principles of Management",
      "International Marketing",
      "Global Supply Chain Management",
      "International Finance",
      "Cross-Cultural Management",
      "International Business Law",
      "Global Economics",
      "Export-Import Management",
      "Strategic Management",
      "International Human Resources",
      "Business Ethics",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Basic business knowledge preferred"
    ],
    careerOpportunities: [
      "International Business Manager",
      "Export Manager",
      "Global Marketing Specialist",
      "Supply Chain Coordinator",
      "International Trade Analyst",
      "Business Development Manager"
    ],
    fees: {
      tuition: "$10,000 - $13,000 per year",
      installments: true
    },
    accreditation: "UeCampus / PPA Accredited",
    rating: 4.5,
    enrolledStudents: 290
  },
  {
    id: "bba-human-resource-management",
    title: "BBA - Human Resource Management",
    code: "BBA-HRM-005",
    category: "Bachelor's Programs",
    subcategory: "Business Administration",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online/Hybrid",
    partner: "PPA / UeCampus",
    description: "Specialized program focusing on talent management, organizational behavior, and HR strategy.",
    overview: "Develops expertise in recruitment, employee relations, performance management, and strategic HR planning.",
    learningOutcomes: [
      "Design effective recruitment and selection processes",
      "Implement performance management systems",
      "Develop training and development programs",
      "Apply employment law and compliance requirements",
      "Create strategic HR plans aligned with business goals"
    ],
    modules: [
      "Introduction to HRM",
      "Organizational Behavior",
      "Talent Acquisition",
      "Training & Development",
      "Performance Management",
      "Compensation & Benefits",
      "Employment Law",
      "Strategic HRM",
      "Employee Relations",
      "HR Analytics",
      "Leadership Development",
      "HR Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Interest in people management"
    ],
    careerOpportunities: [
      "HR Manager",
      "Recruitment Specialist",
      "Training Coordinator",
      "Compensation Analyst",
      "Employee Relations Manager",
      "HR Business Partner"
    ],
    fees: {
      tuition: "$9,500 - $12,500 per year",
      installments: true
    },
    accreditation: "UeCampus / PPA Accredited",
    rating: 4.4,
    enrolledStudents: 310
  },
  {
    id: "bba-marketing",
    title: "BBA - Marketing",
    code: "BBA-MKT-006",
    category: "Bachelor's Programs",
    subcategory: "Business Administration",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online/Hybrid",
    partner: "PPA / UeCampus",
    description: "Dynamic program covering digital marketing, brand management, and consumer behavior.",
    overview: "Prepares students for marketing careers in the digital age with focus on data-driven strategies.",
    learningOutcomes: [
      "Develop comprehensive marketing strategies",
      "Execute digital marketing campaigns",
      "Analyze consumer behavior and market trends",
      "Create compelling brand narratives",
      "Measure and optimize marketing ROI"
    ],
    modules: [
      "Principles of Marketing",
      "Consumer Behavior",
      "Digital Marketing",
      "Brand Management",
      "Marketing Research",
      "Social Media Marketing",
      "Content Marketing",
      "Marketing Analytics",
      "Advertising & Promotion",
      "Sales Management",
      "Strategic Marketing",
      "Marketing Capstone"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Creative thinking and communication skills"
    ],
    careerOpportunities: [
      "Marketing Manager",
      "Digital Marketing Specialist",
      "Brand Manager",
      "Marketing Analyst",
      "Social Media Manager",
      "Product Marketing Manager"
    ],
    fees: {
      tuition: "$9,500 - $12,500 per year",
      installments: true
    },
    accreditation: "UeCampus / PPA Accredited",
    rating: 4.6,
    enrolledStudents: 340
  },
  {
    id: "bba-accounting",
    title: "Bachelor's in Accounting / BBA Accounting",
    code: "BBA-ACC-007",
    category: "Bachelor's Programs",
    subcategory: "Accounting & Finance",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online/Hybrid",
    partner: "Walsh / EIE",
    description: "Comprehensive accounting program preparing students for CPA and professional accounting careers.",
    overview: "Covers financial accounting, managerial accounting, taxation, and auditing with professional exam preparation.",
    learningOutcomes: [
      "Prepare financial statements and reports",
      "Apply accounting principles and standards",
      "Conduct financial analysis and audits",
      "Understand taxation principles and compliance",
      "Use accounting software and technology"
    ],
    modules: [
      "Financial Accounting I & II",
      "Managerial Accounting",
      "Cost Accounting",
      "Taxation",
      "Auditing",
      "Accounting Information Systems",
      "Corporate Finance",
      "Financial Statement Analysis",
      "Advanced Accounting",
      "Forensic Accounting",
      "Ethics in Accounting",
      "Accounting Capstone"
    ],
    entryRequirements: [
      "High school diploma with strong math background",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Analytical and numerical skills"
    ],
    careerOpportunities: [
      "Certified Public Accountant (CPA)",
      "Financial Accountant",
      "Management Accountant",
      "Tax Accountant",
      "Auditor",
      "Financial Analyst"
    ],
    fees: {
      tuition: "$10,500 - $13,500 per year",
      installments: true
    },
    accreditation: "Walsh / EIE Accredited",
    rating: 4.7,
    enrolledStudents: 370
  },
  {
    id: "bachelor-finance",
    title: "Bachelor of Finance",
    code: "BFIN-008",
    category: "Bachelor's Programs",
    subcategory: "Finance",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Walsh / UeCampus",
    description: "Specialized finance degree covering investments, corporate finance, and financial markets.",
    overview: "Prepares students for careers in financial analysis, investment banking, and corporate finance.",
    learningOutcomes: [
      "Analyze financial statements and performance",
      "Evaluate investment opportunities and risks",
      "Apply financial modeling techniques",
      "Understand capital markets and instruments",
      "Develop financial strategies for organizations"
    ],
    modules: [
      "Financial Management",
      "Investment Analysis",
      "Corporate Finance",
      "Financial Markets",
      "Portfolio Management",
      "Derivatives & Risk Management",
      "International Finance",
      "Financial Modeling",
      "Valuation",
      "Behavioral Finance",
      "Financial Regulation",
      "Finance Capstone"
    ],
    entryRequirements: [
      "High school diploma with strong math background",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Analytical thinking ability"
    ],
    careerOpportunities: [
      "Financial Analyst",
      "Investment Banker",
      "Portfolio Manager",
      "Risk Analyst",
      "Corporate Finance Manager",
      "Financial Advisor"
    ],
    fees: {
      tuition: "$11,000 - $14,000 per year",
      installments: true
    },
    accreditation: "Walsh / UeCampus Accredited",
    rating: 4.6,
    enrolledStudents: 300
  },
  {
    id: "ba-tourism-hospitality",
    title: "Bachelor of Arts in Tourism & Hospitality Management",
    code: "BA-THM-009",
    category: "Bachelor's Programs",
    subcategory: "Hospitality & Tourism",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online/Hybrid",
    partner: "eie European Business School",
    description: "Comprehensive program in tourism management, hospitality operations, and event planning.",
    overview: "Prepares students for leadership roles in the global tourism and hospitality industry.",
    learningOutcomes: [
      "Manage hospitality operations effectively",
      "Develop tourism marketing strategies",
      "Plan and execute events and conferences",
      "Understand sustainable tourism practices",
      "Deliver exceptional customer service"
    ],
    modules: [
      "Introduction to Tourism & Hospitality",
      "Hotel Operations Management",
      "Food & Beverage Management",
      "Tourism Marketing",
      "Event Management",
      "Sustainable Tourism",
      "Customer Service Excellence",
      "Tourism Economics",
      "Resort Management",
      "Tourism Planning & Development",
      "Cultural Tourism",
      "Industry Placement"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Customer service orientation"
    ],
    careerOpportunities: [
      "Hotel Manager",
      "Tourism Development Officer",
      "Event Coordinator",
      "Resort Manager",
      "Travel Operations Manager",
      "Hospitality Consultant"
    ],
    fees: {
      tuition: "$9,000 - $12,000 per year",
      installments: true
    },
    accreditation: "eie European Business School Accredited",
    rating: 4.5,
    enrolledStudents: 280
  },
  {
    id: "bba-general-business-walsh",
    title: "Bachelor of Business (General BBA)",
    code: "BBA-GEN-010",
    category: "Bachelor's Programs",
    subcategory: "Business Administration",
    level: "Undergraduate",
    duration: "2-3 years (Accelerated/Top-up)",
    mode: "Online",
    partner: "Walsh College",
    description: "Flexible general business degree with accelerated and top-up options for career changers.",
    overview: "Provides comprehensive business education with flexibility for students with prior learning or qualifications.",
    learningOutcomes: [
      "Apply fundamental business principles",
      "Develop strategic thinking skills",
      "Understand financial management basics",
      "Lead teams and projects effectively",
      "Make data-driven business decisions"
    ],
    modules: [
      "Business Fundamentals",
      "Accounting for Managers",
      "Marketing Principles",
      "Operations Management",
      "Business Law",
      "Organizational Behavior",
      "Business Strategy",
      "Economics for Business",
      "Business Analytics",
      "Entrepreneurship",
      "Business Communications",
      "Strategic Capstone"
    ],
    entryRequirements: [
      "High school diploma or relevant diploma/foundation",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Prior learning may be recognized"
    ],
    careerOpportunities: [
      "Business Manager",
      "Operations Coordinator",
      "Business Analyst",
      "Management Trainee",
      "Project Coordinator",
      "Business Development Executive"
    ],
    fees: {
      tuition: "$8,000 - $10,000 per year",
      installments: true
    },
    accreditation: "Walsh College Accelerated Program",
    rating: 4.4,
    enrolledStudents: 260
  },
  {
    id: "bsam-applied-management",
    title: "Bachelor of Science in Applied Management (BSAM)",
    code: "BSAM-011",
    category: "Bachelor's Programs",
    subcategory: "Management",
    level: "Undergraduate",
    duration: "2-3 years (Accelerated)",
    mode: "Online",
    partner: "Walsh College",
    description: "Practical management degree designed for working professionals seeking career advancement.",
    overview: "Applied learning approach focusing on real-world management challenges and leadership development.",
    learningOutcomes: [
      "Apply management theories to workplace challenges",
      "Lead diverse teams effectively",
      "Implement strategic planning processes",
      "Manage organizational change",
      "Develop critical thinking and problem-solving skills"
    ],
    modules: [
      "Leadership & Management",
      "Organizational Development",
      "Project Management",
      "Change Management",
      "Quality Management",
      "Supply Chain Management",
      "Strategic Planning",
      "Human Resource Management",
      "Business Ethics",
      "Innovation Management",
      "Applied Research Methods",
      "Management Capstone"
    ],
    entryRequirements: [
      "Associate degree or relevant work experience",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Professional recommendation preferred"
    ],
    careerOpportunities: [
      "Operations Manager",
      "Department Manager",
      "Project Manager",
      "Team Leader",
      "Management Consultant",
      "Business Operations Specialist"
    ],
    fees: {
      tuition: "$9,000 - $11,500 per year",
      installments: true
    },
    accreditation: "Walsh College Accelerated Catalog",
    rating: 4.5,
    enrolledStudents: 240
  },
  {
    id: "bsit-data-analytics-walsh",
    title: "BSc Information Technology - Data Analytics Concentration",
    code: "BSIT-DA-012",
    category: "Bachelor's Programs",
    subcategory: "Information Technology",
    level: "Undergraduate",
    duration: "3-4 years (Accelerated variant available)",
    mode: "Online",
    partner: "Walsh College",
    description: "IT degree with specialized concentration in data analytics and business intelligence.",
    overview: "Combines core IT skills with advanced data analytics techniques for modern business needs.",
    learningOutcomes: [
      "Develop software solutions with analytics capabilities",
      "Implement data warehousing and ETL processes",
      "Create predictive models using machine learning",
      "Design data-driven IT systems",
      "Integrate analytics tools into business applications"
    ],
    modules: [
      "Programming Foundations",
      "Database Systems",
      "Data Structures",
      "Statistical Analysis",
      "Data Warehousing",
      "Business Intelligence",
      "Machine Learning",
      "Data Visualization",
      "Big Data Technologies",
      "Analytics Programming (Python/R)",
      "IT Systems Design",
      "Analytics Capstone Project"
    ],
    entryRequirements: [
      "High school diploma with strong math",
      "Basic programming knowledge preferred",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Data Analytics Developer",
      "Business Intelligence Engineer",
      "Analytics Programmer",
      "Data Systems Analyst",
      "IT Data Specialist",
      "Analytics Solutions Developer"
    ],
    fees: {
      tuition: "$12,000 - $15,000 per year",
      installments: true
    },
    accreditation: "Walsh College Accelerated Variant",
    rating: 4.7,
    enrolledStudents: 220
  },
  {
    id: "topup-bba-acca",
    title: "Top-up BBA / Top-up Degree Options (ACCA Top-up)",
    code: "TOPUP-BBA-013",
    category: "Bachelor's Programs",
    subcategory: "Business Administration",
    level: "Undergraduate Top-up",
    duration: "1-2 years",
    mode: "Online",
    partner: "Partner Institutions",
    description: "Top-up degree pathway for diploma holders and ACCA students to complete bachelor's qualification.",
    overview: "Fast-track completion program recognizing prior learning from professional qualifications and diplomas.",
    learningOutcomes: [
      "Complete undergraduate business qualification",
      "Apply advanced business concepts",
      "Develop strategic business thinking",
      "Enhance professional credentials",
      "Prepare for postgraduate study"
    ],
    modules: [
      "Strategic Management",
      "Advanced Business Analysis",
      "Corporate Governance",
      "Business Research Methods",
      "International Business",
      "Leadership & Change",
      "Business Ethics & CSR",
      "Dissertation/Capstone Project"
    ],
    entryRequirements: [
      "Relevant diploma (Level 5 or equivalent)",
      "ACCA qualification or similar professional credentials",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Relevant work experience considered"
    ],
    careerOpportunities: [
      "Senior Business Roles",
      "Management Positions",
      "Professional Accountant",
      "Business Consultant",
      "Progress to Master's Programs",
      "Executive Leadership Roles"
    ],
    fees: {
      tuition: "$6,000 - $9,000 total program",
      installments: true
    },
    accreditation: "Partner Institution Accredited",
    rating: 4.6,
    enrolledStudents: 190
  },
  {
    id: "bsc-graphic-design",
    title: "BSc in Graphic Design",
    code: "BSGD-014",
    category: "Bachelor's Programs",
    subcategory: "Design",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Design Institute",
    description: "Creative program focusing on visual communication, design principles, and digital media.",
    overview: "Prepares students for careers in graphic design, advertising, and multimedia.",
    learningOutcomes: [
      "Create compelling visual designs for various media",
      "Understand design theory and principles",
      "Utilize design software effectively",
      "Develop a professional portfolio",
      "Collaborate on design projects"
    ],
    modules: [
      "Design Fundamentals",
      "Digital Media",
      "Typography",
      "Color Theory",
      "User Experience Design",
      "Branding",
      "Illustration",
      "Web Design",
      "Motion Graphics",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Portfolio of design work",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Graphic Designer",
      "Art Director",
      "Web Designer",
      "Brand Strategist",
      "Multimedia Artist"
    ],
    fees: {
      tuition: "$10,000 - $13,000 per year",
      installments: true
    },
    accreditation: "Design Institute Accredited",
    rating: 4.5,
    enrolledStudents: 200
  },
  {
    id: "bsc-business-analytics",
    title: "BSc in Business Analytics",
    code: "BSBA-015",
    category: "Bachelor's Programs",
    subcategory: "Business Analytics",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Business School",
    description: "Program focusing on data analysis, business intelligence, and decision-making.",
    overview: "Equips students with skills to analyze data and drive business strategies.",
    learningOutcomes: [
      "Analyze business data to inform decisions",
      "Utilize analytics tools and software",
      "Develop data-driven business strategies",
      "Communicate insights effectively",
      "Work collaboratively in teams"
    ],
    modules: [
      "Business Statistics",
      "Data Visualization",
      "Predictive Analytics",
      "Data Mining",
      "Business Intelligence",
      "Operations Management",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma with strong math background",
      "Basic computer skills",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Business Analyst",
      "Data Analyst",
      "Operations Analyst",
      "Consultant",
      "Market Research Analyst"
    ],
    fees: {
      tuition: "$11,000 - $14,000 per year",
      installments: true
    },
    accreditation: "Business School Accredited",
    rating: 4.6,
    enrolledStudents: 210
  },
  {
    id: "bsc-cybersecurity",
    title: "BSc in Cybersecurity",
    code: "BSCS-016",
    category: "Bachelor's Programs",
    subcategory: "Cybersecurity",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Cyber Institute",
    description: "Focuses on protecting systems and networks from cyber threats.",
    overview: "Prepares students for careers in cybersecurity and information assurance.",
    learningOutcomes: [
      "Identify and mitigate cybersecurity risks",
      "Implement security measures and protocols",
      "Conduct security assessments",
      "Respond to security incidents",
      "Understand legal and ethical issues in cybersecurity"
    ],
    modules: [
      "Introduction to Cybersecurity",
      "Network Security",
      "Ethical Hacking",
      "Digital Forensics",
      "Security Management",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Basic understanding of computer systems",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Cybersecurity Analyst",
      "Information Security Manager",
      "Network Security Engineer",
      "Security Consultant"
    ],
    fees: {
      tuition: "$12,000 - $15,000 per year",
      installments: true
    },
    accreditation: "Cyber Institute Accredited",
    rating: 4.7,
    enrolledStudents: 180
  },
  {
    id: "bsc-healthcare-management",
    title: "BSc in Healthcare Management",
    code: "BSHM-017",
    category: "Bachelor's Programs",
    subcategory: "Healthcare",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Health School",
    description: "Program focusing on management principles in healthcare settings.",
    overview: "Prepares students for leadership roles in healthcare organizations.",
    learningOutcomes: [
      "Understand healthcare systems and policies",
      "Manage healthcare operations effectively",
      "Analyze healthcare data",
      "Implement quality improvement initiatives",
      "Communicate effectively in healthcare settings"
    ],
    modules: [
      "Healthcare Systems",
      "Healthcare Management",
      "Health Policy",
      "Quality Improvement",
      "Healthcare Finance",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Interest in healthcare management",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Healthcare Manager",
      "Health Services Administrator",
      "Healthcare Consultant",
      "Policy Analyst"
    ],
    fees: {
      tuition: "$11,500 - $14,500 per year",
      installments: true
    },
    accreditation: "Health School Accredited",
    rating: 4.5,
    enrolledStudents: 170
  },
  {
    id: "bsc-supply-chain-management",
    title: "BSc in Supply Chain Management",
    code: "BSCM-018",
    category: "Bachelor's Programs",
    subcategory: "Supply Chain",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Logistics Institute",
    description: "Focuses on logistics, operations, and supply chain management.",
    overview: "Prepares students for careers in supply chain and logistics.",
    learningOutcomes: [
      "Understand supply chain processes",
      "Manage logistics operations",
      "Analyze supply chain data",
      "Implement supply chain strategies",
      "Work collaboratively in teams"
    ],
    modules: [
      "Introduction to Supply Chain Management",
      "Logistics Management",
      "Operations Management",
      "Data Analysis for Supply Chain",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Basic understanding of business principles",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Supply Chain Manager",
      "Logistics Coordinator",
      "Operations Analyst",
      "Procurement Specialist"
    ],
    fees: {
      tuition: "$10,500 - $13,500 per year",
      installments: true
    },
    accreditation: "Logistics Institute Accredited",
    rating: 4.6,
    enrolledStudents: 160
  },
  {
    id: "bsc-project-management",
    title: "BSc in Project Management",
    code: "BSPM-019",
    category: "Bachelor's Programs",
    subcategory: "Project Management",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Management School",
    description: "Focuses on project management principles and practices.",
    overview: "Prepares students for careers in project management across various industries.",
    learningOutcomes: [
      "Plan and execute projects effectively",
      "Manage project teams",
      "Analyze project risks",
      "Communicate project status to stakeholders",
      "Implement project management tools"
    ],
    modules: [
      "Project Management Fundamentals",
      "Risk Management",
      "Agile Project Management",
      "Project Scheduling",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Interest in project management",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Project Manager",
      "Project Coordinator",
      "Program Manager",
      "Consultant"
    ],
    fees: {
      tuition: "$11,000 - $14,000 per year",
      installments: true
    },
    accreditation: "Management School Accredited",
    rating: 4.5,
    enrolledStudents: 150
  },
  {
    id: "bsc-digital-marketing",
    title: "BSc in Digital Marketing",
    code: "BSDM-020",
    category: "Bachelor's Programs",
    subcategory: "Marketing",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Marketing Institute",
    description: "Focuses on digital marketing strategies and tools.",
    overview: "Prepares students for careers in digital marketing and online business.",
    learningOutcomes: [
      "Develop digital marketing strategies",
      "Utilize social media for marketing",
      "Analyze online consumer behavior",
      "Implement SEO and SEM techniques",
      "Create digital marketing campaigns"
    ],
    modules: [
      "Digital Marketing Fundamentals",
      "Social Media Marketing",
      "SEO & SEM",
      "Content Marketing",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Interest in digital marketing",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Digital Marketing Specialist",
      "Social Media Manager",
      "SEO Specialist",
      "Content Strategist"
    ],
    fees: {
      tuition: "$10,500 - $13,500 per year",
      installments: true
    },
    accreditation: "Marketing Institute Accredited",
    rating: 4.6,
    enrolledStudents: 140
  },
  {
    id: "bsc-international-relations",
    title: "BSc in International Relations",
    code: "BIR-021",
    category: "Bachelor's Programs",
    subcategory: "International Relations",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "International Studies Institute",
    description: "Focuses on global politics, diplomacy, and international relations.",
    overview: "Prepares students for careers in international relations and diplomacy.",
    learningOutcomes: [
      "Understand global political systems",
      "Analyze international issues",
      "Develop diplomatic skills",
      "Communicate effectively in international contexts"
    ],
    modules: [
      "Introduction to International Relations",
      "Global Politics",
      "Diplomacy",
      "International Law",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Interest in international relations",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Diplomat",
      "International Relations Analyst",
      "Policy Advisor",
      "NGO Manager"
    ],
    fees: {
      tuition: "$11,500 - $14,500 per year",
      installments: true
    },
    accreditation: "International Studies Institute Accredited",
    rating: 4.5,
    enrolledStudents: 130
  },
  {
    id: "bsc-entrepreneurship",
    title: "BSc in Entrepreneurship",
    code: "BSE-022",
    category: "Bachelor's Programs",
    subcategory: "Entrepreneurship",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Entrepreneurship Institute",
    description: "Focuses on developing entrepreneurial skills and business acumen.",
    overview: "Prepares students for careers as entrepreneurs and business leaders.",
    learningOutcomes: [
      "Develop business plans",
      "Understand startup processes",
      "Analyze market opportunities",
      "Communicate effectively with stakeholders"
    ],
    modules: [
      "Entrepreneurship Fundamentals",
      "Business Planning",
      "Market Research",
      "Startup Management",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Interest in entrepreneurship",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Entrepreneur",
      "Business Consultant",
      "Startup Founder",
      "Business Development Manager"
    ],
    fees: {
      tuition: "$10,000 - $13,000 per year",
      installments: true
    },
    accreditation: "Entrepreneurship Institute Accredited",
    rating: 4.6,
    enrolledStudents: 120
  },
  {
    id: "bsc-psychology",
    title: "BSc in Psychology",
    code: "BPSY-023",
    category: "Bachelor's Programs",
    subcategory: "Psychology",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Psychology Institute",
    description: "Focuses on understanding human behavior and mental processes.",
    overview: "Prepares students for careers in psychology and counseling.",
    learningOutcomes: [
      "Understand psychological theories",
      "Conduct psychological research",
      "Communicate effectively with clients",
      "Apply psychological principles in various settings"
    ],
    modules: [
      "Introduction to Psychology",
      "Research Methods",
      "Developmental Psychology",
      "Clinical Psychology",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Interest in psychology",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Psychologist",
      "Counselor",
      "Human Resources Specialist",
      "Market Research Analyst"
    ],
    fees: {
      tuition: "$11,000 - $14,000 per year",
      installments: true
    },
    accreditation: "Psychology Institute Accredited",
    rating: 4.5,
    enrolledStudents: 110
  },
  {
    id: "bsc-education",
    title: "BSc in Education",
    code: "BED-024",
    category: "Bachelor's Programs",
    subcategory: "Education",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Education Institute",
    description: "Focuses on teaching methods and educational theory.",
    overview: "Prepares students for careers in education and teaching.",
    learningOutcomes: [
      "Understand educational theories",
      "Develop teaching strategies",
      "Communicate effectively with students",
      "Implement assessment methods"
    ],
    modules: [
      "Introduction to Education",
      "Teaching Methods",
      "Curriculum Development",
      "Assessment in Education",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Interest in education",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Teacher",
      "Educational Consultant",
      "Curriculum Developer",
      "School Administrator"
    ],
    fees: {
      tuition: "$10,500 - $13,500 per year",
      installments: true
    },
    accreditation: "Education Institute Accredited",
    rating: 4.6,
    enrolledStudents: 100
  },
  {
    id: "bsc-communication",
    title: "BSc in Communication",
    code: "BCOM-025",
    category: "Bachelor's Programs",
    subcategory: "Communication",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Communication Institute",
    description: "Focuses on communication theories and practices.",
    overview: "Prepares students for careers in communication and media.",
    learningOutcomes: [
      "Understand communication theories",
      "Develop communication strategies",
      "Communicate effectively in various contexts"
    ],
    modules: [
      "Introduction to Communication",
      "Media Studies",
      "Public Relations",
      "Interpersonal Communication",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Interest in communication",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Public Relations Specialist",
      "Communication Consultant",
      "Media Planner",
      "Corporate Communication Manager"
    ],
    fees: {
      tuition: "$10,000 - $13,000 per year",
      installments: true
    },
    accreditation: "Communication Institute Accredited",
    rating: 4.5,
    enrolledStudents: 90
  },
  {
    id: "bsc-graphic-design",
    title: "BSc in Graphic Design",
    code: "BGD-026",
    category: "Bachelor's Programs",
    subcategory: "Design",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Design Institute",
    description: "Focuses on visual communication and design principles.",
    overview: "Prepares students for careers in graphic design and multimedia.",
    learningOutcomes: [
      "Create visual designs for various media",
      "Understand design theory and principles",
      "Utilize design software effectively"
    ],
    modules: [
      "Design Fundamentals",
      "Digital Media",
      "Typography",
      "Color Theory",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Portfolio of design work",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Graphic Designer",
      "Art Director",
      "Web Designer"
    ],
    fees: {
      tuition: "$10,500 - $13,500 per year",
      installments: true
    },
    accreditation: "Design Institute Accredited",
    rating: 4.6,
    enrolledStudents: 80
  },
  {
    id: "bsc-business-administration",
    title: "BSc in Business Administration",
    code: "BBA-027",
    category: "Bachelor's Programs",
    subcategory: "Business Administration",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Business School",
    description: "Focuses on business principles and practices.",
    overview: "Prepares students for careers in business management.",
    learningOutcomes: [
      "Understand business operations",
      "Develop management skills",
      "Communicate effectively in business contexts"
    ],
    modules: [
      "Business Fundamentals",
      "Management Principles",
      "Marketing Principles",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Interest in business",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Business Manager",
      "Operations Coordinator",
      "Business Analyst"
    ],
    fees: {
      tuition: "$10,000 - $13,000 per year",
      installments: true
    },
    accreditation: "Business School Accredited",
    rating: 4.5,
    enrolledStudents: 70
  },
  {
    id: "bsc-information-technology",
    title: "BSc in Information Technology",
    code: "BIT-028",
    category: "Bachelor's Programs",
    subcategory: "Information Technology",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "IT Institute",
    description: "Focuses on IT principles and practices.",
    overview: "Prepares students for careers in IT and computer science.",
    learningOutcomes: [
      "Understand IT systems and networks",
      "Develop software solutions",
      "Communicate effectively in IT contexts"
    ],
    modules: [
      "IT Fundamentals",
      "Programming",
      "Database Management",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Interest in IT",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "IT Specialist",
      "Software Developer",
      "Network Administrator"
    ],
    fees: {
      tuition: "$10,500 - $13,500 per year",
      installments: true
    },
    accreditation: "IT Institute Accredited",
    rating: 4.6,
    enrolledStudents: 60
  },
  {
    id: "bsc-data-science",
    title: "BSc in Data Science",
    code: "BDS-029",
    category: "Bachelor's Programs",
    subcategory: "Data Science",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Data Science Institute",
    description: "Focuses on data analysis and machine learning.",
    overview: "Prepares students for careers in data science and analytics.",
    learningOutcomes: [
      "Analyze data using statistical methods",
      "Develop machine learning models",
      "Communicate data insights effectively"
    ],
    modules: [
      "Data Science Fundamentals",
      "Statistics",
      "Machine Learning",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Strong math background",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Data Scientist",
      "Data Analyst",
      "Machine Learning Engineer"
    ],
    fees: {
      tuition: "$11,000 - $14,000 per year",
      installments: true
    },
    accreditation: "Data Science Institute Accredited",
    rating: 4.7,
    enrolledStudents: 50
  },
  {
    id: "bsc-artificial-intelligence",
    title: "BSc in Artificial Intelligence",
    code: "BAI-030",
    category: "Bachelor's Programs",
    subcategory: "Artificial Intelligence",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "AI Institute",
    description: "Focuses on AI principles and applications.",
    overview: "Prepares students for careers in AI and machine learning.",
    learningOutcomes: [
      "Understand AI concepts and technologies",
      "Develop AI applications",
      "Communicate AI insights effectively"
    ],
    modules: [
      "AI Fundamentals",
      "Machine Learning",
      "Deep Learning",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Strong math and programming background",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "AI Engineer",
      "Machine Learning Engineer",
      "Data Scientist"
    ],
    fees: {
      tuition: "$12,000 - $15,000 per year",
      installments: true
    },
    accreditation: "AI Institute Accredited",
    rating: 4.8,
    enrolledStudents: 40
  },
  {
    id: "bsc-robotics",
    title: "BSc in Robotics",
    code: "BRO-031",
    category: "Bachelor's Programs",
    subcategory: "Robotics",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Robotics Institute",
    description: "Focuses on robotics principles and applications.",
    overview: "Prepares students for careers in robotics and automation.",
    learningOutcomes: [
      "Understand robotics concepts and technologies",
      "Develop robotic systems",
      "Communicate robotics insights effectively"
    ],
    modules: [
      "Robotics Fundamentals",
      "Control Systems",
      "Embedded Systems",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Strong math and programming background",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Robotics Engineer",
      "Automation Engineer",
      "Mechatronics Engineer"
    ],
    fees: {
      tuition: "$12,500 - $15,500 per year",
      installments: true
    },
    accreditation: "Robotics Institute Accredited",
    rating: 4.9,
    enrolledStudents: 30
  },
  {
    id: "bsc-virtual-reality",
    title: "BSc in Virtual Reality",
    code: "BVR-032",
    category: "Bachelor's Programs",
    subcategory: "Virtual Reality",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "VR Institute",
    description: "Focuses on virtual reality principles and applications.",
    overview: "Prepares students for careers in virtual reality and immersive technologies.",
    learningOutcomes: [
      "Understand virtual reality concepts and technologies",
      "Develop VR applications",
      "Communicate VR insights effectively"
    ],
    modules: [
      "VR Fundamentals",
      "3D Modeling",
      "Game Development",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Strong math and programming background",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "VR Developer",
      "Game Designer",
      "3D Artist"
    ],
    fees: {
      tuition: "$12,000 - $15,000 per year",
      installments: true
    },
    accreditation: "VR Institute Accredited",
    rating: 4.8,
    enrolledStudents: 20
  },
  {
    id: "bsc-augmented-reality",
    title: "BSc in Augmented Reality",
    code: "BAR-033",
    category: "Bachelor's Programs",
    subcategory: "Augmented Reality",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "AR Institute",
    description: "Focuses on augmented reality principles and applications.",
    overview: "Prepares students for careers in augmented reality and immersive technologies.",
    learningOutcomes: [
      "Understand augmented reality concepts and technologies",
      "Develop AR applications",
      "Communicate AR insights effectively"
    ],
    modules: [
      "AR Fundamentals",
      "3D Modeling",
      "Game Development",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Strong math and programming background",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "AR Developer",
      "Game Designer",
      "3D Artist"
    ],
    fees: {
      tuition: "$12,000 - $15,000 per year",
      installments: true
    },
    accreditation: "AR Institute Accredited",
    rating: 4.7,
    enrolledStudents: 10
  },
  {
    id: "bsc-data-visualization",
    title: "BSc in Data Visualization",
    code: "BDV-034",
    category: "Bachelor's Programs",
    subcategory: "Data Visualization",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Data Visualization Institute",
    description: "Focuses on data visualization principles and practices.",
    overview: "Prepares students for careers in data visualization and analytics.",
    learningOutcomes: [
      "Create effective data visualizations",
      "Understand data storytelling",
      "Communicate data insights effectively"
    ],
    modules: [
      "Data Visualization Fundamentals",
      "Data Storytelling",
      "Visualization Tools",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Interest in data visualization",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Data Visualization Specialist",
      "Business Intelligence Analyst",
      "Data Analyst"
    ],
    fees: {
      tuition: "$11,000 - $14,000 per year",
      installments: true
    },
    accreditation: "Data Visualization Institute Accredited",
    rating: 4.6,
    enrolledStudents: 5
  },
  {
    id: "bsc-quantum-computing",
    title: "BSc in Quantum Computing",
    code: "BQC-035",
    category: "Bachelor's Programs",
    subcategory: "Quantum Computing",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Quantum Institute",
    description: "Focuses on quantum computing principles and applications.",
    overview: "Prepares students for careers in quantum computing and advanced technologies.",
    learningOutcomes: [
      "Understand quantum computing concepts",
      "Develop quantum algorithms",
      "Communicate quantum insights effectively"
    ],
    modules: [
      "Quantum Computing Fundamentals",
      "Quantum Algorithms",
      "Quantum Programming",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Strong math and programming background",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Quantum Computing Researcher",
      "Quantum Software Developer",
      "Data Scientist"
    ],
    fees: {
      tuition: "$12,500 - $15,500 per year",
      installments: true
    },
    accreditation: "Quantum Institute Accredited",
    rating: 4.9,
    enrolledStudents: 2
  },
  {
    id: "bsc-advanced-computing",
    title: "BSc in Advanced Computing",
    code: "BAC-036",
    category: "Bachelor's Programs",
    subcategory: "Advanced Computing",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Advanced Computing Institute",
    description: "Focuses on advanced computing principles and applications.",
    overview: "Prepares students for careers in advanced computing and technology.",
    learningOutcomes: [
      "Understand advanced computing concepts",
      "Develop advanced software solutions",
      "Communicate advanced computing insights effectively"
    ],
    modules: [
      "Advanced Computing Fundamentals",
      "Software Development",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Strong math and programming background",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Software Engineer",
      "Systems Architect",
      "Data Scientist"
    ],
    fees: {
      tuition: "$12,000 - $15,000 per year",
      installments: true
    },
    accreditation: "Advanced Computing Institute Accredited",
    rating: 4.8,
    enrolledStudents: 1
  }
];

export const courseCategories = [
  {
    name: "Bachelor's Programs",
    count: 64,
    description: "Undergraduate degrees across various disciplines",
    icon: "🎓"
  },
  {
    name: "Master's Programs",
    count: 18,
    description: "Postgraduate master's degrees for career advancement",
    icon: "📚"
  },
  {
    name: "Doctoral Programs",
    count: 8,
    description: "PhD and DBA programs for research and executive leadership",
    icon: "🎖️"
  },
  {
    name: "Professional Diplomas",
    count: 18,
    description: "Level 4-7 professional qualifications",
    icon: "📜"
  },
  {
    name: "Foundation Diplomas",
    count: 3,
    description: "Entry-level qualifications for career starters",
    icon: "🌟"
  }
];
