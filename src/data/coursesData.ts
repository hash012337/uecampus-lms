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

  // B. Master's / Postgraduate Degrees (10 courses)
  {
    id: "mba-uecampus",
    title: "Master of Business Administration (MBA)",
    code: "MBA-001",
    category: "Master's Programs",
    subcategory: "Business Administration",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online/Hybrid",
    partner: "UeCampus / EIE",
    description: "Premier MBA program covering all aspects of business management and leadership.",
    overview: "Comprehensive business education designed for aspiring executives and business leaders.",
    learningOutcomes: [
      "Lead organizations through complex business challenges",
      "Develop strategic vision and execution plans",
      "Apply financial analysis to business decisions",
      "Manage cross-functional teams effectively",
      "Drive innovation and organizational change"
    ],
    modules: [
      "Strategic Management",
      "Financial Management",
      "Marketing Management",
      "Operations Management",
      "Leadership & Organizational Behavior",
      "Business Analytics",
      "Corporate Finance",
      "Entrepreneurship & Innovation",
      "International Business",
      "Business Ethics",
      "Capstone Business Simulation",
      "MBA Dissertation"
    ],
    entryRequirements: [
      "Bachelor's degree in any field",
      "Minimum 2 years work experience",
      "English proficiency (IELTS 6.5 or equivalent)",
      "GMAT/GRE (may be waived with experience)"
    ],
    careerOpportunities: [
      "Chief Executive Officer",
      "General Manager",
      "Business Development Director",
      "Strategy Consultant",
      "Operations Director",
      "Entrepreneur"
    ],
    fees: {
      tuition: "$18,000 - $25,000 total program",
      installments: true
    },
    accreditation: "UeCampus / EIE Accredited",
    rating: 4.8,
    enrolledStudents: 520
  },
  {
    id: "msit-master",
    title: "MSc in Information Technology (MSIT)",
    code: "MSIT-002",
    category: "Master's Programs",
    subcategory: "Information Technology",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online",
    partner: "UeCampus",
    description: "Advanced IT program focusing on emerging technologies and enterprise architecture.",
    overview: "Prepares IT professionals for leadership roles in technology-driven organizations.",
    learningOutcomes: [
      "Design enterprise IT architectures",
      "Implement advanced cloud solutions",
      "Lead IT transformation projects",
      "Apply cybersecurity best practices",
      "Manage IT governance and compliance"
    ],
    modules: [
      "Advanced Software Engineering",
      "Enterprise Architecture",
      "Cloud Computing & DevOps",
      "IT Security & Risk Management",
      "Big Data & Analytics",
      "Artificial Intelligence",
      "IT Project Management",
      "IT Strategy & Governance",
      "Emerging Technologies",
      "Research Methods",
      "Master's Thesis",
      "Industry Capstone"
    ],
    entryRequirements: [
      "Bachelor's in IT or related field",
      "Work experience in IT preferred",
      "English proficiency (IELTS 6.5 or equivalent)",
      "Programming knowledge"
    ],
    careerOpportunities: [
      "IT Director",
      "Chief Technology Officer",
      "Enterprise Architect",
      "IT Consultant",
      "Solutions Architect",
      "Technology Manager"
    ],
    fees: {
      tuition: "$16,000 - $22,000 total program",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.7,
    enrolledStudents: 380
  },
  {
    id: "msda-master",
    title: "MSc / MS in Data Analytics",
    code: "MSDA-003",
    category: "Master's Programs",
    subcategory: "Data Analytics",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online",
    partner: "UeCampus",
    description: "Advanced analytics program combining statistics, machine learning, and business intelligence.",
    overview: "Develops expertise in transforming data into strategic business insights.",
    learningOutcomes: [
      "Build advanced predictive models",
      "Implement machine learning algorithms",
      "Design data-driven strategies",
      "Lead analytics teams and projects",
      "Communicate complex insights effectively"
    ],
    modules: [
      "Advanced Statistics",
      "Machine Learning",
      "Deep Learning",
      "Big Data Analytics",
      "Data Mining Techniques",
      "Predictive Modeling",
      "Business Analytics",
      "Data Visualization",
      "Natural Language Processing",
      "Analytics Strategy",
      "Research Project",
      "Master's Dissertation"
    ],
    entryRequirements: [
      "Bachelor's in quantitative field",
      "Strong mathematical background",
      "Programming experience (Python/R)",
      "English proficiency (IELTS 6.5 or equivalent)"
    ],
    careerOpportunities: [
      "Senior Data Scientist",
      "Analytics Manager",
      "Chief Data Officer",
      "Machine Learning Engineer",
      "Analytics Consultant",
      "Research Scientist"
    ],
    fees: {
      tuition: "$17,000 - $23,000 total program",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.8,
    enrolledStudents: 410
  },
  {
    id: "msai-ml-master",
    title: "MSc in Artificial Intelligence & Machine Learning",
    code: "MSAI-004",
    category: "Master's Programs",
    subcategory: "Artificial Intelligence",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online",
    partner: "UeCampus",
    description: "Cutting-edge program in AI, machine learning, and intelligent systems.",
    overview: "Prepares students for leadership in AI development and implementation.",
    learningOutcomes: [
      "Design and implement AI systems",
      "Develop advanced machine learning models",
      "Apply deep learning to real-world problems",
      "Understand AI ethics and governance",
      "Lead AI transformation initiatives"
    ],
    modules: [
      "Foundations of AI",
      "Advanced Machine Learning",
      "Deep Learning & Neural Networks",
      "Computer Vision",
      "Natural Language Processing",
      "Reinforcement Learning",
      "AI Ethics & Governance",
      "AI System Design",
      "Robotics & Automation",
      "AI Research Methods",
      "AI Capstone Project",
      "Master's Thesis"
    ],
    entryRequirements: [
      "Bachelor's in Computer Science, IT, or related field",
      "Strong programming skills",
      "Mathematical foundation (linear algebra, calculus)",
      "English proficiency (IELTS 6.5 or equivalent)"
    ],
    careerOpportunities: [
      "AI Research Scientist",
      "Machine Learning Engineer",
      "AI Solutions Architect",
      "Computer Vision Engineer",
      "NLP Engineer",
      "AI Product Manager"
    ],
    fees: {
      tuition: "$18,000 - $24,000 total program",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.9,
    enrolledStudents: 350
  },
  {
    id: "msf-finance-master",
    title: "MSc in Finance / Master of Science in Finance (MSF)",
    code: "MSF-005",
    category: "Master's Programs",
    subcategory: "Finance",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online",
    partner: "UeCampus",
    description: "Advanced finance program covering investments, corporate finance, and financial markets.",
    overview: "Prepares finance professionals for senior roles in financial services and corporate finance.",
    learningOutcomes: [
      "Conduct advanced financial analysis",
      "Manage investment portfolios",
      "Apply financial risk management techniques",
      "Develop corporate financial strategies",
      "Lead financial decision-making"
    ],
    modules: [
      "Advanced Corporate Finance",
      "Investment Analysis & Portfolio Management",
      "Derivatives & Risk Management",
      "Financial Econometrics",
      "Mergers & Acquisitions",
      "International Finance",
      "Fixed Income Securities",
      "Alternative Investments",
      "Financial Modeling",
      "Behavioral Finance",
      "Finance Research Methods",
      "Master's Dissertation"
    ],
    entryRequirements: [
      "Bachelor's in Finance, Economics, or related field",
      "Strong quantitative skills",
      "English proficiency (IELTS 6.5 or equivalent)",
      "Finance work experience preferred"
    ],
    careerOpportunities: [
      "Investment Manager",
      "Financial Risk Manager",
      "Corporate Finance Director",
      "Hedge Fund Manager",
      "Financial Consultant",
      "Chief Financial Officer"
    ],
    fees: {
      tuition: "$19,000 - $26,000 total program",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.7,
    enrolledStudents: 330
  },
  {
    id: "msc-management",
    title: "MSc in Management",
    code: "MSCM-006",
    category: "Master's Programs",
    subcategory: "Management",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online",
    partner: "UeCampus",
    description: "Comprehensive management program for aspiring leaders and managers.",
    overview: "Develops strategic management capabilities and leadership skills for diverse organizational contexts.",
    learningOutcomes: [
      "Apply strategic management frameworks",
      "Lead organizational change initiatives",
      "Manage complex projects and teams",
      "Make data-driven business decisions",
      "Develop innovative business solutions"
    ],
    modules: [
      "Strategic Management",
      "Organizational Behavior",
      "Leadership & Change Management",
      "Operations & Supply Chain Management",
      "Financial Decision Making",
      "Marketing Strategy",
      "Human Resource Strategy",
      "Business Analytics",
      "Innovation Management",
      "Global Business Management",
      "Management Research",
      "Management Dissertation"
    ],
    entryRequirements: [
      "Bachelor's degree in any field",
      "Work experience preferred",
      "English proficiency (IELTS 6.5 or equivalent)"
    ],
    careerOpportunities: [
      "Senior Manager",
      "Operations Director",
      "Strategy Manager",
      "Management Consultant",
      "Business Analyst",
      "General Manager"
    ],
    fees: {
      tuition: "$16,000 - $21,000 total program",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.6,
    enrolledStudents: 390
  },
  {
    id: "msc-marketing",
    title: "MSc in Marketing",
    code: "MSCMKT-007",
    category: "Master's Programs",
    subcategory: "Marketing",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online",
    partner: "UeCampus",
    description: "Advanced marketing program focusing on digital strategies and consumer insights.",
    overview: "Prepares marketing professionals for leadership roles in the digital marketing era.",
    learningOutcomes: [
      "Develop comprehensive marketing strategies",
      "Lead digital transformation initiatives",
      "Analyze consumer behavior and market trends",
      "Manage brand portfolios",
      "Apply marketing analytics and AI"
    ],
    modules: [
      "Strategic Marketing Management",
      "Digital Marketing Strategy",
      "Consumer Behavior & Insights",
      "Brand Strategy & Management",
      "Marketing Analytics",
      "Social Media & Content Marketing",
      "Customer Experience Management",
      "Marketing Research Methods",
      "International Marketing",
      "Marketing Innovation",
      "Marketing Dissertation",
      "Industry Project"
    ],
    entryRequirements: [
      "Bachelor's degree in any field",
      "Marketing experience preferred",
      "English proficiency (IELTS 6.5 or equivalent)"
    ],
    careerOpportunities: [
      "Marketing Director",
      "Brand Manager",
      "Digital Marketing Head",
      "Marketing Consultant",
      "Chief Marketing Officer",
      "Product Marketing Manager"
    ],
    fees: {
      tuition: "$17,000 - $22,000 total program",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.7,
    enrolledStudents: 310
  },
  {
    id: "macc-info-systems",
    title: "Master of Accounting - Information Systems",
    code: "MACC-IS-008",
    category: "Master's Programs",
    subcategory: "Accounting",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online",
    partner: "Walsh College",
    description: "Specialized accounting program integrating information systems and data analytics.",
    overview: "Combines advanced accounting with IT systems knowledge for modern finance roles.",
    learningOutcomes: [
      "Apply accounting information systems",
      "Analyze financial data using technology",
      "Implement internal controls and audits",
      "Manage accounting technology projects",
      "Lead digital transformation in finance"
    ],
    modules: [
      "Advanced Financial Accounting",
      "Accounting Information Systems",
      "Data Analytics for Accountants",
      "IT Audit & Controls",
      "Enterprise Resource Planning (ERP)",
      "Financial Data Management",
      "Fraud Examination",
      "Accounting Technology",
      "Tax Information Systems",
      "Business Intelligence",
      "Research Methods",
      "Master's Project"
    ],
    entryRequirements: [
      "Bachelor's in Accounting or related field",
      "CPA or relevant certification preferred",
      "English proficiency (IELTS 6.5 or equivalent)"
    ],
    careerOpportunities: [
      "Accounting Systems Manager",
      "IT Auditor",
      "Financial Systems Analyst",
      "ERP Consultant",
      "Controller",
      "Finance Technology Director"
    ],
    fees: {
      tuition: "$18,000 - $24,000 total program",
      installments: true
    },
    accreditation: "Walsh College Accredited",
    rating: 4.6,
    enrolledStudents: 180
  },
  {
    id: "ms-hrm",
    title: "Master of Science in Human Resource Management (MS HRM)",
    code: "MSHRM-009",
    category: "Master's Programs",
    subcategory: "Human Resources",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online",
    partner: "UeCampus",
    description: "Advanced HR program focusing on strategic talent management and organizational development.",
    overview: "Prepares HR professionals for strategic leadership roles in human capital management.",
    learningOutcomes: [
      "Develop strategic HR initiatives",
      "Lead organizational transformation",
      "Apply HR analytics and metrics",
      "Manage talent acquisition and retention",
      "Navigate employment law and compliance"
    ],
    modules: [
      "Strategic Human Resource Management",
      "Talent Management & Succession Planning",
      "HR Analytics & Metrics",
      "Organizational Development",
      "Leadership Development",
      "Compensation & Benefits Strategy",
      "Employment Law & Ethics",
      "International HRM",
      "Change Management",
      "Employee Relations",
      "HR Research Methods",
      "HRM Capstone"
    ],
    entryRequirements: [
      "Bachelor's degree in HR or related field",
      "HR experience preferred",
      "English proficiency (IELTS 6.5 or equivalent)"
    ],
    careerOpportunities: [
      "HR Director",
      "Talent Management Director",
      "Chief People Officer",
      "HR Consultant",
      "Organizational Development Manager",
      "HR Business Partner"
    ],
    fees: {
      tuition: "$16,500 - $21,500 total program",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.5,
    enrolledStudents: 290
  },
  {
    id: "mba-specializations",
    title: "MBA Specializations (Accounting & Finance, HRM, International Business, Supply Chain)",
    code: "MBA-SPEC-010",
    category: "Master's Programs",
    subcategory: "Business Administration",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online/Hybrid",
    partner: "PPA / EIE",
    description: "MBA program with specialized tracks in key business disciplines.",
    overview: "Comprehensive MBA with focused specialization tracks for targeted career advancement.",
    learningOutcomes: [
      "Apply MBA core competencies",
      "Develop expertise in chosen specialization",
      "Lead functional business areas",
      "Implement strategic initiatives",
      "Drive business transformation"
    ],
    modules: [
      "Core MBA Modules (Strategy, Finance, Marketing, Operations)",
      "Specialization Track 1: Accounting & Finance (Advanced Financial Reporting, Corporate Finance)",
      "Specialization Track 2: HRM (Strategic HR, Talent Management)",
      "Specialization Track 3: International Business (Global Strategy, Cross-cultural Management)",
      "Specialization Track 4: Supply Chain (Logistics, Procurement, Operations)",
      "Business Analytics",
      "Leadership Development",
      "Specialized Capstone Project"
    ],
    entryRequirements: [
      "Bachelor's degree in any field",
      "Minimum 2 years work experience",
      "English proficiency (IELTS 6.5 or equivalent)",
      "GMAT/GRE (may be waived)"
    ],
    careerOpportunities: [
      "Functional Director (Finance, HR, Operations, Supply Chain)",
      "Business Unit Manager",
      "Strategy Consultant",
      "International Business Manager",
      "Supply Chain Director",
      "CFO / CHRO"
    ],
    fees: {
      tuition: "$19,000 - $27,000 total program",
      installments: true
    },
    accreditation: "PPA / EIE Accredited",
    rating: 4.7,
    enrolledStudents: 450
  },

  // C. Doctorate / PhD / DBA Programs (8 courses)
  {
    id: "dba-uecampus",
    title: "Doctor of Business Administration (DBA)",
    code: "DBA-001",
    category: "Doctoral Programs",
    subcategory: "Business Administration",
    level: "Doctorate",
    duration: "3-5 years",
    mode: "Online/Hybrid",
    partner: "UeCampus / Walsh",
    description: "Professional doctorate for senior executives and business leaders.",
    overview: "Research-focused program applying advanced business knowledge to organizational challenges.",
    learningOutcomes: [
      "Conduct original business research",
      "Apply advanced theoretical frameworks to practice",
      "Lead organizational transformation",
      "Publish research in academic journals",
      "Contribute to business knowledge"
    ],
    modules: [
      "Research Philosophy & Design",
      "Advanced Quantitative Methods",
      "Advanced Qualitative Methods",
      "Strategic Leadership",
      "Organizational Theory",
      "Business Ethics & Governance",
      "Innovation & Change",
      "Research Seminars",
      "Dissertation Proposal",
      "Dissertation Research",
      "Dissertation Defense"
    ],
    entryRequirements: [
      "Master's degree in business or related field",
      "Minimum 5 years senior management experience",
      "Research proposal",
      "English proficiency (IELTS 7.0 or equivalent)",
      "Interview"
    ],
    careerOpportunities: [
      "Chief Executive Officer",
      "Chief Strategy Officer",
      "Business Consultant",
      "Academic Professor",
      "Research Director",
      "Board Member"
    ],
    fees: {
      tuition: "$25,000 - $40,000 total program",
      installments: true
    },
    accreditation: "UeCampus / Walsh Accredited",
    rating: 4.9,
    enrolledStudents: 120
  },
  {
    id: "dba-business",
    title: "Doctorate in Business (DBA) - Top-level Program",
    code: "DBA-002",
    category: "Doctoral Programs",
    subcategory: "Business Administration",
    level: "Doctorate",
    duration: "3-5 years",
    mode: "Online/Hybrid",
    partner: "UeCampus",
    description: "Premier doctoral program for accomplished business professionals and executives.",
    overview: "Elite DBA program combining rigorous research with practical business application.",
    learningOutcomes: [
      "Generate new business knowledge",
      "Lead industry transformation",
      "Publish high-impact research",
      "Mentor future business leaders",
      "Shape business policy and practice"
    ],
    modules: [
      "Doctoral Research Methods",
      "Advanced Business Theory",
      "Statistical Analysis for Research",
      "Business Model Innovation",
      "Global Business Strategy",
      "Executive Leadership",
      "Research Ethics",
      "Literature Review & Synthesis",
      "Dissertation Seminars",
      "Doctoral Thesis",
      "Viva Voce"
    ],
    entryRequirements: [
      "Master's in Business or MBA",
      "Significant executive experience",
      "Strong research proposal",
      "English proficiency (IELTS 7.0 or equivalent)",
      "Academic references"
    ],
    careerOpportunities: [
      "C-Suite Executive",
      "Strategic Advisor",
      "Management Consultant",
      "University Professor",
      "Research Fellow",
      "Industry Thought Leader"
    ],
    fees: {
      tuition: "$28,000 - $45,000 total program",
      installments: true
    },
    accreditation: "UeCampus Top-level Accreditation",
    rating: 4.9,
    enrolledStudents: 95
  },
  {
    id: "dba-accounting",
    title: "DBA in Accounting",
    code: "DBA-ACC-003",
    category: "Doctoral Programs",
    subcategory: "Accounting",
    level: "Doctorate",
    duration: "3-5 years",
    mode: "Online/Hybrid",
    partner: "Partner Institutions",
    description: "Specialized doctoral program in accounting research and practice.",
    overview: "Advanced research degree for accounting professionals and academics.",
    learningOutcomes: [
      "Conduct accounting research",
      "Advance accounting theory and practice",
      "Publish in accounting journals",
      "Lead accounting innovation",
      "Teach at university level"
    ],
    modules: [
      "Accounting Research Methods",
      "Advanced Financial Accounting Theory",
      "Managerial Accounting Research",
      "Auditing Theory & Practice",
      "Taxation Research",
      "Accounting Information Systems",
      "Corporate Governance",
      "Research Seminars",
      "Dissertation Development",
      "Doctoral Thesis in Accounting"
    ],
    entryRequirements: [
      "Master's in Accounting or related field",
      "CPA or equivalent preferred",
      "Accounting research experience",
      "English proficiency (IELTS 7.0 or equivalent)"
    ],
    careerOpportunities: [
      "Accounting Professor",
      "Chief Accounting Officer",
      "Accounting Research Director",
      "Professional Standards Developer",
      "Accounting Consultant",
      "CFO"
    ],
    fees: {
      tuition: "$26,000 - $42,000 total program",
      installments: true
    },
    accreditation: "Partner Institution Accredited",
    rating: 4.8,
    enrolledStudents: 65
  },
  {
    id: "phd-organizational-leadership",
    title: "PhD in Organizational Leadership",
    code: "PHD-OL-004",
    category: "Doctoral Programs",
    subcategory: "Leadership",
    level: "Doctorate",
    duration: "4-6 years",
    mode: "Online/Hybrid",
    partner: "Partner Institutions",
    description: "Research-focused PhD in leadership theory, development, and organizational change.",
    overview: "Academic doctorate preparing scholars and practitioners in leadership studies.",
    learningOutcomes: [
      "Develop leadership theories",
      "Conduct rigorous leadership research",
      "Publish in top-tier journals",
      "Teach leadership at doctoral level",
      "Consult on leadership development"
    ],
    modules: [
      "Leadership Theory & Research",
      "Organizational Behavior Research",
      "Advanced Research Methods",
      "Qualitative Research Design",
      "Leadership Development",
      "Change Management Research",
      "Ethics & Leadership",
      "Teaching Practicum",
      "Comprehensive Exams",
      "Dissertation Research",
      "PhD Defense"
    ],
    entryRequirements: [
      "Master's degree in relevant field",
      "Strong academic background",
      "Research experience",
      "English proficiency (IELTS 7.0 or equivalent)",
      "Research proposal and interview"
    ],
    careerOpportunities: [
      "University Professor",
      "Research Scientist",
      "Leadership Development Director",
      "Executive Coach",
      "Organizational Consultant",
      "Think Tank Researcher"
    ],
    fees: {
      tuition: "$30,000 - $50,000 total program",
      installments: true
    },
    accreditation: "Partner Institution Accredited",
    rating: 4.8,
    enrolledStudents: 75
  },
  {
    id: "phd-data-analytics",
    title: "PhD / Doctor of Philosophy in Data Analytics",
    code: "PHD-DA-005",
    category: "Doctoral Programs",
    subcategory: "Data Analytics",
    level: "Doctorate",
    duration: "4-6 years",
    mode: "Online/Hybrid",
    partner: "UeCampus",
    description: "Research-intensive PhD program in data science and analytics.",
    overview: "Academic doctorate for aspiring researchers and data science leaders.",
    learningOutcomes: [
      "Advance data science methodologies",
      "Develop novel analytics algorithms",
      "Publish groundbreaking research",
      "Lead data science initiatives",
      "Teach at doctoral level"
    ],
    modules: [
      "Advanced Statistical Theory",
      "Machine Learning Research",
      "Big Data Analytics",
      "Research Methodology",
      "Computational Statistics",
      "Optimization & Algorithms",
      "Data Science Ethics",
      "Teaching & Supervision",
      "Comprehensive Exams",
      "Doctoral Research",
      "PhD Thesis Defense"
    ],
    entryRequirements: [
      "Master's in Data Science or related field",
      "Strong mathematical background",
      "Research publications preferred",
      "Programming expertise",
      "English proficiency (IELTS 7.0 or equivalent)"
    ],
    careerOpportunities: [
      "Data Science Professor",
      "Chief Data Scientist",
      "Research Scientist",
      "AI Research Director",
      "Data Science Consultant",
      "Analytics Thought Leader"
    ],
    fees: {
      tuition: "$32,000 - $52,000 total program",
      installments: true
    },
    accreditation: "UeCampus Doctoral Accreditation",
    rating: 4.9,
    enrolledStudents: 85
  },
  {
    id: "phd-cyber-security",
    title: "PhD in Cyber Security",
    code: "PHD-CS-006",
    category: "Doctoral Programs",
    subcategory: "Cyber Security",
    level: "Doctorate",
    duration: "4-6 years",
    mode: "Online/Hybrid",
    partner: "Partner Institutions",
    description: "Research-focused PhD in cybersecurity, cryptography, and information assurance.",
    overview: "Academic doctorate preparing cybersecurity researchers and experts.",
    learningOutcomes: [
      "Conduct cybersecurity research",
      "Develop security solutions and protocols",
      "Publish in security conferences and journals",
      "Lead security research teams",
      "Advise on national security issues"
    ],
    modules: [
      "Cybersecurity Research Methods",
      "Advanced Cryptography",
      "Network Security Research",
      "Security Protocol Design",
      "Cyber Threat Intelligence",
      "Security Analytics",
      "Research Ethics in Security",
      "Teaching Practicum",
      "Comprehensive Exams",
      "Doctoral Research",
      "PhD Viva"
    ],
    entryRequirements: [
      "Master's in Cybersecurity or Computer Science",
      "Strong technical background",
      "Research experience",
      "Security certifications preferred",
      "English proficiency (IELTS 7.0 or equivalent)"
    ],
    careerOpportunities: [
      "Security Research Scientist",
      "University Professor",
      "Chief Security Officer",
      "Security Consultant",
      "Government Security Advisor",
      "Security Research Director"
    ],
    fees: {
      tuition: "$33,000 - $53,000 total program",
      installments: true
    },
    accreditation: "Partner Institution Accredited",
    rating: 4.9,
    enrolledStudents: 70
  },
  {
    id: "phd-ai-ml",
    title: "PhD in Artificial Intelligence & Machine Learning",
    code: "PHD-AI-007",
    category: "Doctoral Programs",
    subcategory: "Artificial Intelligence",
    level: "Doctorate",
    duration: "4-6 years",
    mode: "Online/Hybrid",
    partner: "Partner Institutions",
    description: "Cutting-edge PhD program in AI research and development.",
    overview: "Academic doctorate for AI researchers and innovators.",
    learningOutcomes: [
      "Advance AI research",
      "Develop novel AI algorithms",
      "Publish in top AI conferences",
      "Lead AI research projects",
      "Contribute to AI ethics and policy"
    ],
    modules: [
      "AI Research Methods",
      "Advanced Machine Learning Theory",
      "Deep Learning Research",
      "Neural Architecture Search",
      "Reinforcement Learning",
      "Computer Vision Research",
      "Natural Language Processing Research",
      "AI Ethics & Policy",
      "Teaching & Mentoring",
      "Comprehensive Exams",
      "PhD Research",
      "Thesis Defense"
    ],
    entryRequirements: [
      "Master's in AI, Computer Science, or related field",
      "Strong mathematics and programming skills",
      "Research publications preferred",
      "English proficiency (IELTS 7.0 or equivalent)"
    ],
    careerOpportunities: [
      "AI Research Scientist",
      "University Professor",
      "Chief AI Officer",
      "AI Research Lab Director",
      "AI Policy Advisor",
      "AI Startup Founder"
    ],
    fees: {
      tuition: "$35,000 - $55,000 total program",
      installments: true
    },
    accreditation: "Partner Institution Accredited",
    rating: 4.9,
    enrolledStudents: 90
  },
  {
    id: "phd-research-track",
    title: "Research-track Doctoral Offerings / Custom Doctoral Supervision",
    code: "PHD-RES-008",
    category: "Doctoral Programs",
    subcategory: "Research",
    level: "Doctorate",
    duration: "3-6 years",
    mode: "Online/Hybrid",
    partner: "Partner Institutions",
    description: "Flexible doctoral program with customized research supervision across disciplines.",
    overview: "Tailored doctoral experience for researchers with specific interests and career goals.",
    learningOutcomes: [
      "Conduct independent research",
      "Develop expertise in chosen field",
      "Contribute original knowledge",
      "Publish research findings",
      "Complete doctoral thesis"
    ],
    modules: [
      "Research Design & Methods",
      "Literature Review & Theory",
      "Advanced Research Techniques",
      "Specialized Seminars",
      "Research Ethics",
      "Academic Writing & Publishing",
      "Teaching Experience",
      "Supervisory Meetings",
      "Thesis Development",
      "Doctoral Defense"
    ],
    entryRequirements: [
      "Master's degree in relevant field",
      "Clear research proposal",
      "Academic references",
      "English proficiency (IELTS 7.0 or equivalent)",
      "Interview with potential supervisor"
    ],
    careerOpportunities: [
      "Academic Researcher",
      "University Faculty",
      "Industry Researcher",
      "Consultant",
      "Policy Analyst",
      "Research Director"
    ],
    fees: {
      tuition: "$25,000 - $50,000 total program (varies)",
      installments: true
    },
    accreditation: "Partner Institution Accredited",
    rating: 4.7,
    enrolledStudents: 110
  },

  // D. Level 7 Diplomas (7 courses)
  {
    id: "l7-data-science",
    title: "Level 7 Diploma in Data Science",
    code: "L7DS-001",
    category: "Professional Diplomas",
    subcategory: "Data Science",
    level: "Level 7",
    duration: "9-12 months",
    mode: "Online",
    partner: "Qualifi / Ofqual / UeCampus",
    description: "Advanced postgraduate diploma in data science and analytics.",
    overview: "Professional qualification equivalent to postgraduate certificate in data science.",
    learningOutcomes: [
      "Apply advanced data science techniques",
      "Build predictive models",
      "Analyze big data",
      "Communicate data insights",
      "Implement machine learning solutions"
    ],
    modules: [
      "Data Science Foundations",
      "Statistical Analysis",
      "Machine Learning",
      "Data Visualization",
      "Big Data Technologies",
      "Programming for Data Science",
      "Data Mining",
      "Research Methods"
    ],
    entryRequirements: [
      "Bachelor's degree or Level 6 qualification",
      "Basic programming knowledge",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Data Scientist",
      "Analytics Specialist",
      "Data Engineer",
      "BI Developer",
      "Analytics Consultant",
      "Progress to Master's"
    ],
    fees: {
      tuition: "$3,500 - $5,500 total",
      installments: true
    },
    accreditation: "Qualifi / Ofqual Accredited",
    rating: 4.6,
    enrolledStudents: 280
  },
  {
    id: "l7-accounting-finance",
    title: "Level 7 Diploma in Accounting and Finance",
    code: "L7AF-002",
    category: "Professional Diplomas",
    subcategory: "Accounting & Finance",
    level: "Level 7",
    duration: "9-12 months",
    mode: "Online",
    partner: "Qualifi / Ofqual / UeCampus",
    description: "Advanced accounting and finance qualification for professionals.",
    overview: "Postgraduate-level diploma covering strategic financial management and accounting.",
    learningOutcomes: [
      "Prepare advanced financial reports",
      "Apply strategic financial management",
      "Conduct financial analysis",
      "Understand corporate governance",
      "Manage financial risks"
    ],
    modules: [
      "Strategic Financial Management",
      "Corporate Reporting",
      "Advanced Management Accounting",
      "Audit & Assurance",
      "Taxation Strategy",
      "Corporate Governance",
      "Financial Analysis",
      "Research Project"
    ],
    entryRequirements: [
      "Bachelor's degree or relevant professional qualification",
      "Accounting background preferred",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Senior Accountant",
      "Finance Manager",
      "Financial Controller",
      "Management Accountant",
      "Tax Manager",
      "Progress to MBA"
    ],
    fees: {
      tuition: "$3,200 - $5,000 total",
      installments: true
    },
    accreditation: "Qualifi / Ofqual Accredited",
    rating: 4.5,
    enrolledStudents: 320
  },
  {
    id: "l7-strategic-marketing",
    title: "Level 7 Diploma in Strategic Marketing",
    code: "L7SM-003",
    category: "Professional Diplomas",
    subcategory: "Marketing",
    level: "Level 7",
    duration: "9-12 months",
    mode: "Online",
    partner: "Qualifi / Ofqual / UeCampus",
    description: "Advanced marketing qualification focusing on strategic marketing management.",
    overview: "Postgraduate diploma for marketing professionals seeking senior roles.",
    learningOutcomes: [
      "Develop strategic marketing plans",
      "Apply digital marketing strategies",
      "Lead marketing teams",
      "Analyze market trends",
      "Manage marketing budgets"
    ],
    modules: [
      "Strategic Marketing Management",
      "Digital & Social Media Marketing",
      "Brand Strategy",
      "Marketing Analytics",
      "Consumer Insights",
      "International Marketing",
      "Marketing Communications",
      "Research Project"
    ],
    entryRequirements: [
      "Bachelor's degree or Level 6 qualification",
      "Marketing experience preferred",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Marketing Manager",
      "Digital Marketing Manager",
      "Brand Manager",
      "Marketing Director",
      "Marketing Consultant",
      "Progress to MBA"
    ],
    fees: {
      tuition: "$3,300 - $5,200 total",
      installments: true
    },
    accreditation: "Qualifi / Ofqual Accredited",
    rating: 4.6,
    enrolledStudents: 290
  },
  {
    id: "l7-hrm",
    title: "Level 7 Diploma in Human Resource Management",
    code: "L7HRM-004",
    category: "Professional Diplomas",
    subcategory: "Human Resources",
    level: "Level 7",
    duration: "9-12 months",
    mode: "Online",
    partner: "Qualifi / Ofqual",
    description: "Advanced HR diploma focusing on strategic human resource management.",
    overview: "Professional qualification for HR practitioners aiming for management roles.",
    learningOutcomes: [
      "Implement strategic HRM",
      "Lead talent management",
      "Apply employment law",
      "Develop organizational strategies",
      "Manage employee relations"
    ],
    modules: [
      "Strategic Human Resource Management",
      "Talent Management",
      "Employee Relations",
      "Employment Law",
      "Organizational Development",
      "HR Analytics",
      "Leadership Development",
      "Research Methods"
    ],
    entryRequirements: [
      "Bachelor's degree or Level 6 qualification",
      "HR experience preferred",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "HR Manager",
      "Talent Manager",
      "HR Director",
      "HR Consultant",
      "People & Culture Manager",
      "Progress to MBA"
    ],
    fees: {
      tuition: "$3,000 - $4,800 total",
      installments: true
    },
    accreditation: "Qualifi / Ofqual Accredited",
    rating: 4.4,
    enrolledStudents: 270
  },
  {
    id: "l7-hospitality-tourism",
    title: "Level 7 Diploma in Hospitality and Tourism Management",
    code: "L7HTM-005",
    category: "Professional Diplomas",
    subcategory: "Hospitality & Tourism",
    level: "Level 7",
    duration: "9-12 months",
    mode: "Online",
    partner: "Qualifi / Ofqual / UeCampus",
    description: "Advanced hospitality and tourism management qualification.",
    overview: "Strategic management diploma for hospitality and tourism professionals.",
    learningOutcomes: [
      "Manage hospitality operations strategically",
      "Develop tourism strategies",
      "Lead hospitality teams",
      "Apply sustainable tourism practices",
      "Manage customer experiences"
    ],
    modules: [
      "Strategic Hospitality Management",
      "Tourism Development",
      "Revenue Management",
      "Sustainable Tourism",
      "Customer Experience Management",
      "Event Management",
      "International Tourism",
      "Research Project"
    ],
    entryRequirements: [
      "Bachelor's degree or Level 6 qualification",
      "Hospitality/tourism experience preferred",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Hotel General Manager",
      "Tourism Manager",
      "Resort Manager",
      "Hospitality Consultant",
      "Event Manager",
      "Progress to MBA"
    ],
    fees: {
      tuition: "$3,100 - $4,900 total",
      installments: true
    },
    accreditation: "Qualifi / Ofqual / UeCampus Accredited",
    rating: 4.5,
    enrolledStudents: 240
  },
  {
    id: "l7-education-mgmt",
    title: "Level 7 Diploma in Education Management & Leadership",
    code: "L7EML-006",
    category: "Professional Diplomas",
    subcategory: "Education",
    level: "Level 7",
    duration: "9-12 months",
    mode: "Online",
    partner: "Qualifi / Ofqual / UeCampus",
    description: "Advanced qualification for educational leaders and managers.",
    overview: "Professional diploma preparing educators for leadership and management roles.",
    learningOutcomes: [
      "Lead educational institutions",
      "Develop curriculum strategies",
      "Manage educational resources",
      "Implement quality assurance",
      "Foster educational innovation"
    ],
    modules: [
      "Educational Leadership",
      "Strategic Management in Education",
      "Curriculum Development",
      "Quality Assurance",
      "Educational Policy",
      "Financial Management in Education",
      "Change Management",
      "Research Methods"
    ],
    entryRequirements: [
      "Bachelor's degree or teaching qualification",
      "Teaching/education experience",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "School Principal",
      "Education Manager",
      "Academic Director",
      "Curriculum Developer",
      "Education Consultant",
      "Progress to EdD"
    ],
    fees: {
      tuition: "$3,000 - $4,700 total",
      installments: true
    },
    accreditation: "Qualifi / Ofqual / UeCampus Accredited",
    rating: 4.6,
    enrolledStudents: 230
  },
  {
    id: "l7-information-technology",
    title: "Level 7 Diploma in Information Technology",
    code: "L7IT-007",
    category: "Professional Diplomas",
    subcategory: "Information Technology",
    level: "Level 7",
    duration: "9-12 months",
    mode: "Online",
    partner: "Qualifi / Ofqual / UeCampus",
    description: "Advanced IT management and systems diploma.",
    overview: "Professional qualification for IT professionals moving into management.",
    learningOutcomes: [
      "Manage IT systems and infrastructure",
      "Implement IT strategies",
      "Lead IT projects",
      "Apply IT governance",
      "Ensure cybersecurity"
    ],
    modules: [
      "IT Strategic Management",
      "Systems Analysis & Design",
      "IT Project Management",
      "IT Security Management",
      "Database Management",
      "Cloud Computing",
      "IT Governance",
      "Research Project"
    ],
    entryRequirements: [
      "Bachelor's degree or Level 6 IT qualification",
      "IT experience preferred",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "IT Manager",
      "Systems Manager",
      "IT Project Manager",
      "IT Consultant",
      "Solutions Architect",
      "Progress to MSc"
    ],
    fees: {
      tuition: "$3,400 - $5,300 total",
      installments: true
    },
    accreditation: "Qualifi / Ofqual / UeCampus Accredited",
    rating: 4.5,
    enrolledStudents: 300
  },

  // E. Level 5 Diplomas (6 courses)
  {
    id: "l5-accounting-finance",
    title: "Level 5 Diploma in Accounting and Finance",
    code: "L5AF-001",
    category: "Professional Diplomas",
    subcategory: "Accounting & Finance",
    level: "Level 5",
    duration: "9-12 months",
    mode: "Online",
    partner: "Partner Institutions",
    description: "Higher National Diploma in accounting and financial management.",
    overview: "Professional qualification covering intermediate accounting and finance principles.",
    learningOutcomes: [
      "Prepare financial statements",
      "Apply management accounting techniques",
      "Understand taxation basics",
      "Conduct financial analysis",
      "Use accounting software"
    ],
    modules: [
      "Financial Accounting",
      "Management Accounting",
      "Taxation",
      "Business Law",
      "Economics",
      "Audit Fundamentals",
      "Corporate Finance",
      "Accounting Software"
    ],
    entryRequirements: [
      "Level 4 qualification or equivalent",
      "Basic accounting knowledge",
      "English proficiency (IELTS 5.5 or equivalent)"
    ],
    careerOpportunities: [
      "Accounts Assistant",
      "Junior Accountant",
      "Finance Officer",
      "Bookkeeper",
      "Accounts Supervisor",
      "Progress to Level 7"
    ],
    fees: {
      tuition: "$2,500 - $4,000 total",
      installments: true
    },
    accreditation: "Partner Institution Accredited",
    rating: 4.3,
    enrolledStudents: 340
  },
  {
    id: "l5-cyber-security",
    title: "Level 5 Diploma in Cyber Security",
    code: "L5CS-002",
    category: "Professional Diplomas",
    subcategory: "Cyber Security",
    level: "Level 5",
    duration: "9-12 months",
    mode: "Online",
    partner: "Partner Institutions",
    description: "Higher National Diploma in cybersecurity and information assurance.",
    overview: "Intermediate qualification preparing students for cybersecurity roles.",
    learningOutcomes: [
      "Implement security measures",
      "Identify security vulnerabilities",
      "Conduct basic penetration testing",
      "Apply security policies",
      "Respond to security incidents"
    ],
    modules: [
      "Cybersecurity Fundamentals",
      "Network Security",
      "Ethical Hacking",
      "Security Operations",
      "Digital Forensics Basics",
      "Security Policies",
      "Risk Assessment",
      "Incident Response"
    ],
    entryRequirements: [
      "Level 4 qualification or equivalent",
      "Basic IT knowledge",
      "English proficiency (IELTS 5.5 or equivalent)"
    ],
    careerOpportunities: [
      "Junior Security Analyst",
      "Security Technician",
      "SOC Analyst",
      "Security Administrator",
      "IT Security Officer",
      "Progress to Level 7"
    ],
    fees: {
      tuition: "$2,700 - $4,200 total",
      installments: true
    },
    accreditation: "Partner Institution Accredited",
    rating: 4.4,
    enrolledStudents: 310
  },
  {
    id: "l5-information-technology",
    title: "Level 5 Diploma in Information Technology",
    code: "L5IT-003",
    category: "Professional Diplomas",
    subcategory: "Information Technology",
    level: "Level 5",
    duration: "9-12 months",
    mode: "Online",
    partner: "UeCampus",
    description: "Higher National Diploma covering core IT skills and knowledge.",
    overview: "Comprehensive IT qualification for career progression in technology.",
    learningOutcomes: [
      "Develop software applications",
      "Manage databases",
      "Configure networks",
      "Provide technical support",
      "Implement IT solutions"
    ],
    modules: [
      "Programming Concepts",
      "Database Design",
      "Networking Fundamentals",
      "Web Development",
      "Systems Analysis",
      "IT Security",
      "Project Management",
      "Technical Support"
    ],
    entryRequirements: [
      "Level 4 qualification or equivalent",
      "Basic computer skills",
      "English proficiency (IELTS 5.5 or equivalent)"
    ],
    careerOpportunities: [
      "IT Support Specialist",
      "Junior Developer",
      "Network Technician",
      "Systems Administrator",
      "Web Developer",
      "Progress to BSc"
    ],
    fees: {
      tuition: "$2,600 - $4,100 total",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.4,
    enrolledStudents: 380
  },
  {
    id: "l5-psychology",
    title: "Level 5 Diploma in Psychology",
    code: "L5PSY-004",
    category: "Professional Diplomas",
    subcategory: "Psychology",
    level: "Level 5",
    duration: "9-12 months",
    mode: "Online",
    partner: "Partner Institutions",
    description: "Higher National Diploma in psychology covering foundational theories and applications.",
    overview: "Professional qualification in psychology for counseling and support roles.",
    learningOutcomes: [
      "Apply psychological theories",
      "Understand human behavior",
      "Conduct psychological assessments",
      "Provide basic counseling",
      "Apply research methods"
    ],
    modules: [
      "Introduction to Psychology",
      "Developmental Psychology",
      "Social Psychology",
      "Cognitive Psychology",
      "Abnormal Psychology",
      "Research Methods",
      "Counseling Skills",
      "Psychology in Practice"
    ],
    entryRequirements: [
      "Level 4 qualification or equivalent",
      "Interest in psychology",
      "English proficiency (IELTS 5.5 or equivalent)"
    ],
    careerOpportunities: [
      "Counseling Assistant",
      "Support Worker",
      "Mental Health Worker",
      "Youth Worker",
      "Psychology Assistant",
      "Progress to BA Psychology"
    ],
    fees: {
      tuition: "$2,400 - $3,900 total",
      installments: true
    },
    accreditation: "Partner Institution Accredited",
    rating: 4.3,
    enrolledStudents: 260
  },
  {
    id: "l5-hospitality-tourism",
    title: "Level 5 Diploma in Hospitality and Tourism Management",
    code: "L5HTM-005",
    category: "Professional Diplomas",
    subcategory: "Hospitality & Tourism",
    level: "Level 5",
    duration: "9-12 months",
    mode: "Online",
    partner: "UeCampus",
    description: "Higher National Diploma in hospitality and tourism operations.",
    overview: "Professional qualification for supervisory roles in hospitality and tourism.",
    learningOutcomes: [
      "Manage hospitality operations",
      "Supervise teams",
      "Deliver customer service",
      "Plan events",
      "Understand tourism industry"
    ],
    modules: [
      "Hospitality Operations",
      "Tourism Management",
      "Customer Service",
      "Event Planning",
      "Food & Beverage Service",
      "Marketing for Tourism",
      "Supervision Skills",
      "Industry Placement"
    ],
    entryRequirements: [
      "Level 4 qualification or equivalent",
      "Customer service experience preferred",
      "English proficiency (IELTS 5.5 or equivalent)"
    ],
    careerOpportunities: [
      "Hotel Supervisor",
      "Tourism Coordinator",
      "Event Planner",
      "Restaurant Manager",
      "Travel Consultant",
      "Progress to BA"
    ],
    fees: {
      tuition: "$2,300 - $3,800 total",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.2,
    enrolledStudents: 290
  },
  {
    id: "l5-business-management-extended",
    title: "Extended Level 5 Diploma in Business Management",
    code: "L5BM-EXT-006",
    category: "Professional Diplomas",
    subcategory: "Business Management",
    level: "Level 5",
    duration: "12-18 months",
    mode: "Online",
    partner: "Partner Institutions",
    description: "Extended Higher National Diploma covering comprehensive business management.",
    overview: "Comprehensive business qualification with extended modules for deeper learning.",
    learningOutcomes: [
      "Apply business management principles",
      "Manage business operations",
      "Lead teams effectively",
      "Develop business plans",
      "Analyze business performance"
    ],
    modules: [
      "Business Management",
      "Marketing Principles",
      "Human Resource Management",
      "Financial Management",
      "Operations Management",
      "Strategic Planning",
      "Business Law",
      "Project Management",
      "Entrepreneurship",
      "Business Research"
    ],
    entryRequirements: [
      "Level 3 qualification or equivalent",
      "English proficiency (IELTS 5.5 or equivalent)"
    ],
    careerOpportunities: [
      "Business Supervisor",
      "Team Leader",
      "Operations Coordinator",
      "Junior Manager",
      "Management Trainee",
      "Progress to BBA"
    ],
    fees: {
      tuition: "$2,800 - $4,500 total",
      installments: true
    },
    accreditation: "Partner Institution Accredited",
    rating: 4.4,
    enrolledStudents: 350
  },

  // F. Level 4 Diplomas (5 courses)
  {
    id: "l4-information-technology",
    title: "Level 4 Diploma in Information Technology",
    code: "L4IT-001",
    category: "Professional Diplomas",
    subcategory: "Information Technology",
    level: "Level 4",
    duration: "6-9 months",
    mode: "Online",
    partner: "UeCampus",
    description: "Foundation diploma covering essential IT skills and knowledge.",
    overview: "Entry-level IT qualification for starting a technology career.",
    learningOutcomes: [
      "Understand IT fundamentals",
      "Develop basic programming skills",
      "Configure computer systems",
      "Provide user support",
      "Apply problem-solving techniques"
    ],
    modules: [
      "Introduction to IT",
      "Programming Basics",
      "Computer Systems",
      "Networking Basics",
      "Web Technologies",
      "Database Fundamentals",
      "IT Support",
      "Professional Skills"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Basic computer literacy",
      "English proficiency (IELTS 5.0 or equivalent)"
    ],
    careerOpportunities: [
      "IT Support Trainee",
      "Junior Technician",
      "Help Desk Assistant",
      "Technical Support",
      "IT Administrator Trainee",
      "Progress to Level 5"
    ],
    fees: {
      tuition: "$1,800 - $3,000 total",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.2,
    enrolledStudents: 420
  },
  {
    id: "l4-cyber-security",
    title: "Level 4 Diploma in Cyber Security",
    code: "L4CS-002",
    category: "Professional Diplomas",
    subcategory: "Cyber Security",
    level: "Level 4",
    duration: "6-9 months",
    mode: "Online",
    partner: "Partner Institutions",
    description: "Foundation diploma in cybersecurity principles and practices.",
    overview: "Entry-level qualification introducing cybersecurity concepts.",
    learningOutcomes: [
      "Understand security threats",
      "Apply basic security measures",
      "Recognize vulnerabilities",
      "Follow security policies",
      "Support security operations"
    ],
    modules: [
      "Cybersecurity Basics",
      "Network Security Fundamentals",
      "Security Threats & Risks",
      "Security Tools",
      "Information Security",
      "Security Awareness",
      "Ethical Standards",
      "Security Practices"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Basic IT knowledge",
      "English proficiency (IELTS 5.0 or equivalent)"
    ],
    careerOpportunities: [
      "Security Trainee",
      "Junior Security Analyst",
      "Security Support",
      "IT Security Assistant",
      "Security Administrator Trainee",
      "Progress to Level 5"
    ],
    fees: {
      tuition: "$1,900 - $3,100 total",
      installments: true
    },
    accreditation: "Partner Institution Accredited",
    rating: 4.1,
    enrolledStudents: 380
  },
  {
    id: "l4-psychology",
    title: "Level 4 Diploma in Psychology",
    code: "L4PSY-003",
    category: "Professional Diplomas",
    subcategory: "Psychology",
    level: "Level 4",
    duration: "6-9 months",
    mode: "Online",
    partner: "Partner Institutions",
    description: "Foundation diploma introducing psychological theories and concepts.",
    overview: "Entry-level psychology qualification for support roles.",
    learningOutcomes: [
      "Understand basic psychology",
      "Recognize human behavior patterns",
      "Apply communication skills",
      "Support mental health awareness",
      "Work ethically in psychology contexts"
    ],
    modules: [
      "Psychology Foundations",
      "Human Development",
      "Behavioral Psychology",
      "Mental Health Awareness",
      "Communication Skills",
      "Research Basics",
      "Ethics in Psychology",
      "Applied Psychology"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Interest in psychology",
      "English proficiency (IELTS 5.0 or equivalent)"
    ],
    careerOpportunities: [
      "Support Worker Trainee",
      "Care Assistant",
      "Community Support",
      "Youth Support Worker",
      "Psychology Assistant Trainee",
      "Progress to Level 5"
    ],
    fees: {
      tuition: "$1,700 - $2,900 total",
      installments: true
    },
    accreditation: "Partner Institution Accredited",
    rating: 4.0,
    enrolledStudents: 320
  },
  {
    id: "l4-hospitality-tourism",
    title: "Level 4 Diploma in Hospitality and Tourism Management",
    code: "L4HTM-004",
    category: "Professional Diplomas",
    subcategory: "Hospitality & Tourism",
    level: "Level 4",
    duration: "6-9 months",
    mode: "Online",
    partner: "Partner Institutions",
    description: "Foundation diploma in hospitality and tourism operations.",
    overview: "Entry-level qualification for hospitality and tourism careers.",
    learningOutcomes: [
      "Understand hospitality industry",
      "Deliver customer service",
      "Support tourism operations",
      "Work in hospitality teams",
      "Apply professional standards"
    ],
    modules: [
      "Hospitality Fundamentals",
      "Tourism Industry",
      "Customer Service",
      "Food & Beverage Operations",
      "Accommodation Services",
      "Tourism Geography",
      "Professional Skills",
      "Work Placement"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Customer service interest",
      "English proficiency (IELTS 5.0 or equivalent)"
    ],
    careerOpportunities: [
      "Hotel Receptionist",
      "Tourism Assistant",
      "Restaurant Staff",
      "Travel Agent Trainee",
      "Event Assistant",
      "Progress to Level 5"
    ],
    fees: {
      tuition: "$1,600 - $2,800 total",
      installments: true
    },
    accreditation: "Partner Institution Accredited",
    rating: 4.1,
    enrolledStudents: 360
  },
  {
    id: "l4-accounting-finance",
    title: "Level 4 Diploma in Accounting and Finance",
    code: "L4AF-005",
    category: "Professional Diplomas",
    subcategory: "Accounting & Finance",
    level: "Level 4",
    duration: "6-9 months",
    mode: "Online",
    partner: "Partner Institutions",
    description: "Foundation diploma in accounting and financial principles.",
    overview: "Entry-level qualification for accounting careers.",
    learningOutcomes: [
      "Understand accounting basics",
      "Record financial transactions",
      "Prepare basic financial statements",
      "Apply bookkeeping techniques",
      "Use accounting software"
    ],
    modules: [
      "Accounting Fundamentals",
      "Bookkeeping",
      "Business Mathematics",
      "Financial Statements Basics",
      "Taxation Basics",
      "Business Law Intro",
      "Excel for Accountants",
      "Professional Ethics"
    ],
    entryRequirements: [
      "High school diploma with math",
      "Numerical aptitude",
      "English proficiency (IELTS 5.0 or equivalent)"
    ],
    careerOpportunities: [
      "Accounts Trainee",
      "Bookkeeper",
      "Finance Assistant",
      "Payroll Assistant",
      "Accounts Clerk",
      "Progress to Level 5"
    ],
    fees: {
      tuition: "$1,700 - $2,900 total",
      installments: true
    },
    accreditation: "Partner Institution Accredited",
    rating: 4.2,
    enrolledStudents: 390
  },

  // G. Level 3 / Level 2 / Entry Diplomas (2 courses)
  {
    id: "l3-business-management",
    title: "Level 3 Integrated Diploma in Business and Management",
    code: "L3BM-001",
    category: "Foundation Diplomas",
    subcategory: "Business & Management",
    level: "Level 3",
    duration: "6-9 months",
    mode: "Online",
    partner: "UeCampus",
    description: "Integrated foundation diploma introducing business and management concepts.",
    overview: "Entry-level qualification for business careers or further study.",
    learningOutcomes: [
      "Understand business basics",
      "Apply communication skills",
      "Work in business teams",
      "Use business software",
      "Develop professional skills"
    ],
    modules: [
      "Business Fundamentals",
      "Business Communication",
      "Business Environment",
      "Marketing Basics",
      "Business Accounts",
      "Teamwork Skills",
      "Business Software",
      "Professional Development"
    ],
    entryRequirements: [
      "Basic education (Level 2 or equivalent)",
      "English proficiency",
      "Interest in business"
    ],
    careerOpportunities: [
      "Office Assistant",
      "Administrative Support",
      "Customer Service",
      "Sales Assistant",
      "Business Trainee",
      "Progress to Level 4"
    ],
    fees: {
      tuition: "$1,200 - $2,200 total",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.0,
    enrolledStudents: 450
  },
  {
    id: "l2-cyber-security-beginners",
    title: "Level 2 Diploma in Business Beginners in Cyber Security",
    code: "L2CS-002",
    category: "Foundation Diplomas",
    subcategory: "Cyber Security",
    level: "Level 2",
    duration: "3-6 months",
    mode: "Online",
    partner: "UeCampus",
    description: "Beginner-level introduction to cybersecurity and business IT.",
    overview: "Entry qualification for complete beginners interested in cybersecurity.",
    learningOutcomes: [
      "Understand security basics",
      "Recognize common threats",
      "Apply safe computing practices",
      "Use security tools",
      "Follow security procedures"
    ],
    modules: [
      "IT Basics",
      "Cybersecurity Introduction",
      "Internet Safety",
      "Security Awareness",
      "Computer Fundamentals",
      "Data Protection Basics",
      "Digital Skills",
      "Professional Skills"
    ],
    entryRequirements: [
      "Basic education",
      "Basic computer skills",
      "English proficiency"
    ],
    careerOpportunities: [
      "IT Support Trainee",
      "Help Desk Trainee",
      "Office IT Support",
      "Technical Assistant",
      "Entry-level IT Roles",
      "Progress to Level 3"
    ],
    fees: {
      tuition: "$800 - $1,500 total",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 3.9,
    enrolledStudents: 380
  },

  // H. Walsh College — Accelerated Programs (8 courses)
  {
    id: "bba-general-walsh-accel",
    title: "BBA in General Business (Walsh Accelerated)",
    code: "BBA-WA-001",
    category: "Bachelor's Programs",
    subcategory: "Business Administration",
    level: "Undergraduate",
    duration: "18-24 months (Accelerated)",
    mode: "Online",
    partner: "Walsh College",
    description: "Fast-track general business degree through Walsh College accelerated program.",
    overview: "Intensive accelerated BBA for working professionals seeking rapid completion.",
    learningOutcomes: [
      "Apply business fundamentals quickly",
      "Manage business operations",
      "Lead teams effectively",
      "Make strategic decisions",
      "Adapt to business changes"
    ],
    modules: [
      "Business Fundamentals (Accelerated)",
      "Accounting Essentials",
      "Marketing Strategy",
      "Operations & Supply Chain",
      "Financial Management",
      "Business Law",
      "Leadership & Management",
      "Strategic Business",
      "Business Analytics",
      "Capstone (Intensive)"
    ],
    entryRequirements: [
      "High school diploma or relevant credentials",
      "Work experience preferred",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Self-motivation for accelerated pace"
    ],
    careerOpportunities: [
      "Business Manager",
      "Operations Manager",
      "Project Manager",
      "Business Analyst",
      "Management Consultant",
      "Entrepreneur"
    ],
    fees: {
      tuition: "$15,000 - $20,000 total program",
      installments: true
    },
    accreditation: "Walsh College Accelerated",
    rating: 4.5,
    enrolledStudents: 180
  },
  {
    id: "bba-accounting-walsh-accel",
    title: "Bachelor of Business Administration in Accounting (Walsh)",
    code: "BBA-ACC-WA-002",
    category: "Bachelor's Programs",
    subcategory: "Accounting",
    level: "Undergraduate",
    duration: "2-3 years (Accelerated)",
    mode: "Online",
    partner: "Walsh College",
    description: "Accelerated accounting degree through Walsh College.",
    overview: "Fast-track BBA in Accounting for aspiring accounting professionals.",
    learningOutcomes: [
      "Master accounting principles rapidly",
      "Prepare financial reports",
      "Apply taxation concepts",
      "Conduct audits",
      "Use accounting technology"
    ],
    modules: [
      "Financial Accounting (Intensive)",
      "Managerial Accounting",
      "Cost Accounting",
      "Taxation",
      "Auditing",
      "Accounting Information Systems",
      "Corporate Finance",
      "Advanced Accounting",
      "Forensic Accounting",
      "Capstone"
    ],
    entryRequirements: [
      "High school diploma with math",
      "Numerical skills",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Accountant",
      "Financial Analyst",
      "Tax Specialist",
      "Auditor",
      "Management Accountant",
      "Progress to CPA"
    ],
    fees: {
      tuition: "$16,000 - $22,000 total program",
      installments: true
    },
    accreditation: "Walsh College Accelerated",
    rating: 4.6,
    enrolledStudents: 160
  },
  {
    id: "bsit-walsh-variant",
    title: "Bachelor of Science in Information Technology (Walsh Variant)",
    code: "BSIT-WV-003",
    category: "Bachelor's Programs",
    subcategory: "Information Technology",
    level: "Undergraduate",
    duration: "2-3 years",
    mode: "Online",
    partner: "Walsh College",
    description: "Walsh variant of BSc IT with flexible learning options.",
    overview: "Flexible IT degree designed for working professionals.",
    learningOutcomes: [
      "Develop IT solutions",
      "Manage IT systems",
      "Apply cybersecurity principles",
      "Lead IT projects",
      "Implement cloud technologies"
    ],
    modules: [
      "Programming",
      "Database Systems",
      "Networking",
      "Web Development",
      "IT Security",
      "Cloud Computing",
      "Systems Analysis",
      "IT Management",
      "Software Engineering",
      "Capstone"
    ],
    entryRequirements: [
      "High school diploma or IT credentials",
      "Basic IT knowledge",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "IT Specialist",
      "Systems Analyst",
      "IT Manager",
      "Software Developer",
      "Network Administrator",
      "IT Consultant"
    ],
    fees: {
      tuition: "$17,000 - $23,000 total program",
      installments: true
    },
    accreditation: "Walsh College",
    rating: 4.5,
    enrolledStudents: 140
  },
  {
    id: "bsit-da-walsh-variant",
    title: "Bachelor of Science in Information Technology - Data Analytics (Walsh Variant)",
    code: "BSIT-DA-WV-004",
    category: "Bachelor's Programs",
    subcategory: "Information Technology",
    level: "Undergraduate",
    duration: "2-3 years",
    mode: "Online",
    partner: "Walsh College",
    description: "Walsh variant focusing on IT with data analytics specialization.",
    overview: "IT degree with deep focus on data analytics and business intelligence.",
    learningOutcomes: [
      "Develop IT systems with analytics",
      "Implement data solutions",
      "Apply machine learning",
      "Create business intelligence",
      "Lead analytics projects"
    ],
    modules: [
      "IT Fundamentals",
      "Programming for Analytics",
      "Database Design",
      "Statistics",
      "Data Warehousing",
      "Machine Learning",
      "Data Visualization",
      "Big Data",
      "Analytics Systems",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma with math",
      "Basic IT and analytical skills",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Data Analyst",
      "BI Developer",
      "Analytics Engineer",
      "IT Data Specialist",
      "Data Systems Developer",
      "Analytics Consultant"
    ],
    fees: {
      tuition: "$17,500 - $24,000 total program",
      installments: true
    },
    accreditation: "Walsh College Variant",
    rating: 4.6,
    enrolledStudents: 130
  },
  {
    id: "mba-walsh-partner",
    title: "Master of Business Administration (Walsh Partner Delivery)",
    code: "MBA-WP-005",
    category: "Master's Programs",
    subcategory: "Business Administration",
    level: "Postgraduate",
    duration: "12-18 months",
    mode: "Online",
    partner: "Walsh College",
    description: "MBA delivered through Walsh College partnership.",
    overview: "Flexible MBA for working professionals delivered by Walsh College.",
    learningOutcomes: [
      "Lead business strategy",
      "Manage complex operations",
      "Drive organizational change",
      "Apply financial acumen",
      "Develop executive skills"
    ],
    modules: [
      "Strategic Management",
      "Financial Analysis",
      "Marketing Management",
      "Operations Excellence",
      "Leadership",
      "Business Analytics",
      "Organizational Behavior",
      "Innovation",
      "Global Business",
      "MBA Capstone"
    ],
    entryRequirements: [
      "Bachelor's degree",
      "Work experience preferred",
      "English proficiency (IELTS 6.5 or equivalent)",
      "Professional references"
    ],
    careerOpportunities: [
      "Senior Manager",
      "Director",
      "VP Operations",
      "Business Consultant",
      "Entrepreneur",
      "C-Suite Executive"
    ],
    fees: {
      tuition: "$22,000 - $30,000 total program",
      installments: true
    },
    accreditation: "Walsh College Partner",
    rating: 4.7,
    enrolledStudents: 200
  },
  {
    id: "msda-walsh-partner",
    title: "Master of Science in Data Analytics (Walsh Partner)",
    code: "MSDA-WP-006",
    category: "Master's Programs",
    subcategory: "Data Analytics",
    level: "Postgraduate",
    duration: "12-18 months",
    mode: "Online",
    partner: "Walsh College",
    description: "Master's in Data Analytics through Walsh College partnership.",
    overview: "Advanced analytics degree for data professionals.",
    learningOutcomes: [
      "Apply advanced analytics",
      "Lead data projects",
      "Implement AI/ML solutions",
      "Drive data strategy",
      "Communicate insights"
    ],
    modules: [
      "Advanced Statistics",
      "Machine Learning",
      "Big Data",
      "Predictive Analytics",
      "Data Mining",
      "Business Intelligence",
      "Data Strategy",
      "Analytics Management",
      "Research Methods",
      "Master's Thesis"
    ],
    entryRequirements: [
      "Bachelor's in quantitative field",
      "Programming experience",
      "English proficiency (IELTS 6.5 or equivalent)"
    ],
    careerOpportunities: [
      "Senior Data Scientist",
      "Analytics Director",
      "Data Strategy Manager",
      "Chief Analytics Officer",
      "Analytics Consultant",
      "Research Scientist"
    ],
    fees: {
      tuition: "$20,000 - $28,000 total program",
      installments: true
    },
    accreditation: "Walsh College Partner",
    rating: 4.7,
    enrolledStudents: 150
  },
  {
    id: "msit-walsh-partner",
    title: "Master of Science in Information Technology (Walsh Partner)",
    code: "MSIT-WP-007",
    category: "Master's Programs",
    subcategory: "Information Technology",
    level: "Postgraduate",
    duration: "12-18 months",
    mode: "Online",
    partner: "Walsh College",
    description: "Master's in IT through Walsh College partnership.",
    overview: "Advanced IT management degree for technology leaders.",
    learningOutcomes: [
      "Lead IT strategy",
      "Manage enterprise systems",
      "Implement security solutions",
      "Drive digital transformation",
      "Lead technology teams"
    ],
    modules: [
      "IT Strategy",
      "Enterprise Architecture",
      "Cloud Solutions",
      "Cybersecurity Management",
      "IT Governance",
      "Project Management",
      "Emerging Tech",
      "IT Leadership",
      "Research Methods",
      "Master's Project"
    ],
    entryRequirements: [
      "Bachelor's in IT or related",
      "IT work experience",
      "English proficiency (IELTS 6.5 or equivalent)"
    ],
    careerOpportunities: [
      "IT Director",
      "CTO",
      "Enterprise Architect",
      "IT Consultant",
      "Technology Manager",
      "Solutions Director"
    ],
    fees: {
      tuition: "$19,000 - $27,000 total program",
      installments: true
    },
    accreditation: "Walsh College Partner",
    rating: 4.6,
    enrolledStudents: 135
  },
  {
    id: "macc-is-walsh",
    title: "Master of Accounting - Info Systems (Walsh)",
    code: "MACC-IS-WL-008",
    category: "Master's Programs",
    subcategory: "Accounting",
    level: "Postgraduate",
    duration: "12-18 months",
    mode: "Online",
    partner: "Walsh College",
    description: "Master's combining accounting with information systems through Walsh.",
    overview: "Specialized master's for accounting technology professionals.",
    learningOutcomes: [
      "Lead accounting systems",
      "Implement ERP solutions",
      "Conduct IT audits",
      "Apply data analytics",
      "Manage financial technology"
    ],
    modules: [
      "Advanced Accounting",
      "Accounting Information Systems",
      "ERP Systems",
      "IT Audit",
      "Data Analytics for Finance",
      "Financial Systems",
      "Internal Controls",
      "Technology Management",
      "Research",
      "Master's Project"
    ],
    entryRequirements: [
      "Bachelor's in Accounting or related",
      "Accounting experience",
      "English proficiency (IELTS 6.5 or equivalent)"
    ],
    careerOpportunities: [
      "Accounting Systems Manager",
      "IT Auditor",
      "ERP Consultant",
      "Financial Systems Director",
      "Controller",
      "Finance Technology Manager"
    ],
    fees: {
      tuition: "$21,000 - $29,000 total program",
      installments: true
    },
    accreditation: "Walsh College",
    rating: 4.6,
    enrolledStudents: 95
  },

  // I. PPA / EIE Partner Variants (4 courses)
  {
    id: "mba-eie-variant",
    title: "MBA - eie European Business School Delivered Variant",
    code: "MBA-EIE-001",
    category: "Master's Programs",
    subcategory: "Business Administration",
    level: "Postgraduate",
    duration: "12-18 months",
    mode: "Online/Hybrid",
    partner: "eie European Business School",
    description: "MBA delivered by eie European Business School with European focus.",
    overview: "European-focused MBA with international business perspective.",
    learningOutcomes: [
      "Lead in European markets",
      "Apply international strategy",
      "Manage multicultural teams",
      "Navigate EU regulations",
      "Drive global growth"
    ],
    modules: [
      "Strategic Management",
      "European Business Environment",
      "International Finance",
      "Global Marketing",
      "Leadership in Europe",
      "EU Business Law",
      "Cross-Cultural Management",
      "Innovation & Entrepreneurship",
      "Business Analytics",
      "MBA Dissertation"
    ],
    entryRequirements: [
      "Bachelor's degree",
      "Work experience",
      "English proficiency (IELTS 6.5 or equivalent)",
      "International business interest"
    ],
    careerOpportunities: [
      "International Manager",
      "Business Development Director",
      "European Operations Manager",
      "Global Strategy Consultant",
      "Entrepreneur",
      "General Manager"
    ],
    fees: {
      tuition: "$20,000 - $28,000 total program",
      installments: true
    },
    accreditation: "eie European Business School",
    rating: 4.7,
    enrolledStudents: 175
  },
  {
    id: "mba-acc-finance-eie",
    title: "MBA in Accounting & Finance - EIE Variant",
    code: "MBA-AF-EIE-002",
    category: "Master's Programs",
    subcategory: "Accounting & Finance",
    level: "Postgraduate",
    duration: "12-18 months",
    mode: "Online/Hybrid",
    partner: "eie European Business School",
    description: "MBA with specialization in Accounting & Finance through eie.",
    overview: "Specialized MBA combining business leadership with finance expertise.",
    learningOutcomes: [
      "Lead financial strategy",
      "Apply advanced accounting",
      "Manage corporate finance",
      "Drive financial performance",
      "Execute M&A strategies"
    ],
    modules: [
      "Strategic Management",
      "Advanced Financial Management",
      "Corporate Accounting",
      "Investment Analysis",
      "Financial Risk Management",
      "International Accounting",
      "Treasury Management",
      "Financial Strategy",
      "Leadership",
      "MBA Thesis"
    ],
    entryRequirements: [
      "Bachelor's in finance/accounting or related",
      "Finance work experience",
      "English proficiency (IELTS 6.5 or equivalent)"
    ],
    careerOpportunities: [
      "CFO",
      "Finance Director",
      "Financial Controller",
      "Investment Manager",
      "Corporate Finance Manager",
      "Financial Consultant"
    ],
    fees: {
      tuition: "$21,000 - $29,000 total program",
      installments: true
    },
    accreditation: "eie European Business School",
    rating: 4.6,
    enrolledStudents: 140
  },
  {
    id: "ba-accountancy-finance-eie",
    title: "BA in Accountancy & Finance - EIE Variant",
    code: "BA-AF-EIE-003",
    category: "Bachelor's Programs",
    subcategory: "Accounting & Finance",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online/Hybrid",
    partner: "eie European Business School",
    description: "Bachelor of Arts in Accountancy & Finance through eie.",
    overview: "Comprehensive undergraduate degree in accounting and finance.",
    learningOutcomes: [
      "Apply accounting principles",
      "Analyze financial data",
      "Understand financial markets",
      "Prepare financial reports",
      "Apply taxation and audit"
    ],
    modules: [
      "Financial Accounting",
      "Management Accounting",
      "Corporate Finance",
      "Taxation",
      "Auditing",
      "Financial Markets",
      "Investment Analysis",
      "Business Law",
      "Economics",
      "Financial Reporting",
      "Ethics",
      "Final Year Project"
    ],
    entryRequirements: [
      "High school diploma with math",
      "Numerical aptitude",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Accountant",
      "Financial Analyst",
      "Tax Consultant",
      "Auditor",
      "Finance Officer",
      "Progress to Professional Qualifications"
    ],
    fees: {
      tuition: "$11,000 - $14,500 per year",
      installments: true
    },
    accreditation: "eie European Business School",
    rating: 4.5,
    enrolledStudents: 220
  },
  {
    id: "ba-business-management-eie",
    title: "BA in Business Management - EIE Variant",
    code: "BA-BM-EIE-004",
    category: "Bachelor's Programs",
    subcategory: "Business Management",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online/Hybrid",
    partner: "eie European Business School",
    description: "Bachelor of Arts in Business Management through eie.",
    overview: "Comprehensive business management degree with European perspective.",
    learningOutcomes: [
      "Manage business operations",
      "Lead teams effectively",
      "Apply strategic thinking",
      "Understand marketing principles",
      "Develop business solutions"
    ],
    modules: [
      "Business Management",
      "Marketing",
      "Human Resource Management",
      "Financial Management",
      "Operations Management",
      "Business Strategy",
      "Organizational Behavior",
      "Business Law",
      "Economics",
      "Entrepreneurship",
      "Business Ethics",
      "Capstone Project"
    ],
    entryRequirements: [
      "High school diploma",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Business interest"
    ],
    careerOpportunities: [
      "Business Manager",
      "Operations Manager",
      "Project Manager",
      "Business Analyst",
      "Management Trainee",
      "Entrepreneur"
    ],
    fees: {
      tuition: "$10,500 - $13,500 per year",
      installments: true
    },
    accreditation: "eie European Business School",
    rating: 4.5,
    enrolledStudents: 250
  }
];

export const courseCategories = [
  {
    name: "Bachelor's Programs",
    count: allCoursesData.filter(c => c.category === "Bachelor's Programs").length,
    description: "Undergraduate degrees across various disciplines",
    icon: "🎓"
  },
  {
    name: "Master's Programs",
    count: allCoursesData.filter(c => c.category === "Master's Programs").length,
    description: "Postgraduate master's degrees for career advancement",
    icon: "📚"
  },
  {
    name: "Doctoral Programs",
    count: allCoursesData.filter(c => c.category === "Doctoral Programs").length,
    description: "PhD and DBA programs for research and executive leadership",
    icon: "🎖️"
  },
  {
    name: "Professional Diplomas",
    count: allCoursesData.filter(c => c.category === "Professional Diplomas").length,
    description: "Level 4-7 professional qualifications",
    icon: "📜"
  },
  {
    name: "Foundation Diplomas",
    count: allCoursesData.filter(c => c.category === "Foundation Diplomas").length,
    description: "Entry-level qualifications for career starters",
    icon: "🌟"
  }
];
