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
  // A. Bachelor's / Undergraduate Degrees
  {
    id: "bsc-information-technology-walsh",
    title: "BSc in Information Technology",
    code: "BSIT-W-001",
    category: "Bachelor's Programs",
    subcategory: "Information Technology",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Walsh College",
    description: "Comprehensive bachelor's program in information technology covering software development, networking, and systems administration.",
    overview: "This program provides a solid foundation in information technology, preparing students for careers in software development, IT management, cybersecurity, and systems administration. Students will learn cutting-edge technologies and industry best practices.",
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
    overview: "This comprehensive cybersecurity program equips students with the knowledge and skills to protect organizations from cyber threats. Students learn ethical hacking, incident response, security architecture, and compliance frameworks.",
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
      "Malware Analysis",
      "Security Compliance & Governance",
      "Incident Response & Recovery",
      "Application Security",
      "Capstone Security Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "Basic understanding of computer systems",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Strong analytical and problem-solving skills"
    ],
    careerOpportunities: [
      "Cybersecurity Analyst",
      "Penetration Tester",
      "Security Operations Center (SOC) Analyst",
      "Information Security Manager",
      "Incident Response Specialist",
      "Security Consultant"
    ],
    fees: {
      tuition: "$12,500 - $16,000 per year",
      installments: true
    },
    accreditation: "Walsh College - Accredited by HLC",
    rating: 4.9,
    enrolledStudents: 380
  },
  {
    id: "bsc-data-analytics-walsh",
    title: "BSc in Data Analytics",
    code: "BSDA-W-003",
    category: "Bachelor's Programs",
    subcategory: "Data Science",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Walsh College",
    description: "Learn to transform data into actionable insights using statistical analysis, machine learning, and data visualization.",
    overview: "This program prepares students to become data professionals who can extract insights from complex datasets. Students master statistical analysis, data mining, machine learning, and business intelligence tools.",
    learningOutcomes: [
      "Analyze large datasets using statistical and computational methods",
      "Build predictive models using machine learning algorithms",
      "Create compelling data visualizations and dashboards",
      "Apply data analytics to solve real-world business problems",
      "Communicate findings effectively to technical and non-technical audiences"
    ],
    modules: [
      "Statistics for Data Analytics",
      "Python for Data Science",
      "R Programming",
      "Database Systems & SQL",
      "Data Mining & Warehousing",
      "Machine Learning Fundamentals",
      "Data Visualization",
      "Big Data Analytics",
      "Business Intelligence",
      "Predictive Analytics",
      "Analytics Project Management",
      "Capstone Analytics Project"
    ],
    entryRequirements: [
      "High school diploma with strong mathematics background",
      "Basic programming knowledge (recommended)",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Analytical mindset"
    ],
    careerOpportunities: [
      "Data Analyst",
      "Business Intelligence Analyst",
      "Data Scientist",
      "Analytics Consultant",
      "Marketing Analyst",
      "Operations Analyst"
    ],
    fees: {
      tuition: "$12,000 - $15,500 per year",
      installments: true
    },
    accreditation: "Walsh College - Accredited by HLC",
    rating: 4.8,
    enrolledStudents: 420
  },
  {
    id: "bba-international-business",
    title: "Bachelor of Business Administration - International Business",
    code: "BBA-IB-004",
    category: "Bachelor's Programs",
    subcategory: "Business Administration",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "PPA / UeCampus",
    description: "Comprehensive business degree with focus on global trade, cross-cultural management, and international markets.",
    overview: "This program prepares students for careers in international business by providing knowledge of global economics, international marketing, cross-cultural management, and international trade regulations.",
    learningOutcomes: [
      "Understand global business environments and international trade",
      "Develop cross-cultural communication and management skills",
      "Analyze international market opportunities and risks",
      "Apply international business strategies and frameworks",
      "Navigate legal and regulatory aspects of global commerce"
    ],
    modules: [
      "International Business Environment",
      "Global Marketing",
      "Cross-Cultural Management",
      "International Finance",
      "Export-Import Management",
      "International Trade Law",
      "Global Supply Chain Management",
      "Strategic Management",
      "International Economics",
      "Foreign Language for Business",
      "International Negotiations",
      "Capstone International Business Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Interest in global affairs and cultures"
    ],
    careerOpportunities: [
      "International Business Manager",
      "Global Marketing Manager",
      "Export Manager",
      "International Trade Specialist",
      "Global Supply Chain Manager",
      "International Business Consultant"
    ],
    fees: {
      tuition: "$10,000 - $14,000 per year",
      installments: true
    },
    accreditation: "PPA Accredited",
    rating: 4.7,
    enrolledStudents: 520
  },
  {
    id: "bba-human-resource-management",
    title: "Bachelor of Business Administration - Human Resource Management",
    code: "BBA-HRM-005",
    category: "Bachelor's Programs",
    subcategory: "Business Administration",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "PPA / UeCampus",
    description: "Specialize in managing people, organizational development, talent acquisition, and employee relations.",
    overview: "This program focuses on developing HR professionals who can manage talent, foster organizational culture, handle employee relations, and drive strategic HR initiatives.",
    learningOutcomes: [
      "Design and implement HR strategies aligned with business objectives",
      "Manage recruitment, selection, and onboarding processes",
      "Develop training and development programs",
      "Handle employee relations and conflict resolution",
      "Apply employment law and HR compliance frameworks"
    ],
    modules: [
      "Human Resource Management Fundamentals",
      "Talent Acquisition & Recruitment",
      "Training & Development",
      "Compensation & Benefits",
      "Employee Relations",
      "HR Analytics",
      "Organizational Behavior",
      "Employment Law",
      "Performance Management",
      "Strategic HR Management",
      "Leadership Development",
      "HR Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Good interpersonal skills"
    ],
    careerOpportunities: [
      "HR Manager",
      "Talent Acquisition Specialist",
      "Training & Development Manager",
      "Compensation & Benefits Analyst",
      "Employee Relations Manager",
      "HR Business Partner"
    ],
    fees: {
      tuition: "$10,000 - $13,500 per year",
      installments: true
    },
    accreditation: "PPA Accredited",
    rating: 4.6,
    enrolledStudents: 480
  },
  {
    id: "bba-marketing",
    title: "Bachelor of Business Administration - Marketing",
    code: "BBA-MKT-006",
    category: "Bachelor's Programs",
    subcategory: "Business Administration",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "PPA / UeCampus",
    description: "Master digital marketing, brand management, consumer behavior, and marketing strategy.",
    overview: "This program prepares students for careers in marketing by teaching modern marketing strategies, digital marketing, brand management, and consumer insights.",
    learningOutcomes: [
      "Develop comprehensive marketing strategies and campaigns",
      "Analyze consumer behavior and market trends",
      "Master digital marketing channels and tools",
      "Create compelling brand positioning and messaging",
      "Measure and optimize marketing performance"
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
      "Strategic Marketing Management",
      "International Marketing",
      "Marketing Capstone Project"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Creative thinking ability"
    ],
    careerOpportunities: [
      "Marketing Manager",
      "Digital Marketing Specialist",
      "Brand Manager",
      "Social Media Manager",
      "Market Research Analyst",
      "Marketing Consultant"
    ],
    fees: {
      tuition: "$10,000 - $13,500 per year",
      installments: true
    },
    accreditation: "PPA Accredited",
    rating: 4.7,
    enrolledStudents: 550
  },
  {
    id: "bachelor-accounting-walsh",
    title: "Bachelor of Business Administration - Accounting",
    code: "BBA-ACC-007",
    category: "Bachelor's Programs",
    subcategory: "Accounting & Finance",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Walsh College / EIE",
    description: "Comprehensive accounting education covering financial reporting, auditing, taxation, and management accounting.",
    overview: "This program provides a strong foundation in accounting principles, preparing students for careers in public accounting, corporate finance, auditing, and tax advisory.",
    learningOutcomes: [
      "Prepare and analyze financial statements",
      "Apply auditing standards and procedures",
      "Understand taxation principles and compliance",
      "Use accounting software and enterprise systems",
      "Make strategic business decisions using financial data"
    ],
    modules: [
      "Financial Accounting I & II",
      "Management Accounting",
      "Cost Accounting",
      "Auditing & Assurance",
      "Taxation",
      "Advanced Financial Reporting",
      "Accounting Information Systems",
      "Corporate Finance",
      "Business Law",
      "Ethics in Accounting",
      "International Accounting Standards",
      "Accounting Capstone"
    ],
    entryRequirements: [
      "High school diploma with strong mathematics",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Attention to detail and analytical skills"
    ],
    careerOpportunities: [
      "Certified Public Accountant (CPA)",
      "Financial Accountant",
      "Management Accountant",
      "Auditor",
      "Tax Consultant",
      "Financial Analyst"
    ],
    fees: {
      tuition: "$11,000 - $14,500 per year",
      installments: true
    },
    accreditation: "Walsh College - AACSB Accredited",
    rating: 4.8,
    enrolledStudents: 490
  },
  {
    id: "bachelor-finance-walsh",
    title: "Bachelor of Finance",
    code: "BFIN-W-008",
    category: "Bachelor's Programs",
    subcategory: "Accounting & Finance",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "Walsh College",
    description: "Specialized degree in corporate finance, investment analysis, financial markets, and risk management.",
    overview: "This program prepares students for careers in finance by providing knowledge of financial markets, investment strategies, corporate finance, and financial risk management.",
    learningOutcomes: [
      "Analyze financial statements and company valuation",
      "Understand financial markets and investment vehicles",
      "Apply corporate finance principles to business decisions",
      "Manage financial risk and portfolio optimization",
      "Use financial modeling and analytical tools"
    ],
    modules: [
      "Corporate Finance",
      "Investment Analysis",
      "Financial Markets & Institutions",
      "Portfolio Management",
      "Risk Management",
      "Financial Modeling",
      "Derivatives & Options",
      "International Finance",
      "Mergers & Acquisitions",
      "Financial Economics",
      "Behavioral Finance",
      "Finance Capstone Project"
    ],
    entryRequirements: [
      "High school diploma with strong mathematics",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Quantitative and analytical aptitude"
    ],
    careerOpportunities: [
      "Financial Analyst",
      "Investment Banker",
      "Portfolio Manager",
      "Risk Manager",
      "Corporate Finance Manager",
      "Financial Advisor"
    ],
    fees: {
      tuition: "$11,500 - $15,000 per year",
      installments: true
    },
    accreditation: "Walsh College - AACSB Accredited",
    rating: 4.9,
    enrolledStudents: 410
  },
  {
    id: "ba-tourism-hospitality-eie",
    title: "Bachelor of Arts in Tourism & Hospitality Management",
    code: "BATH-EIE-009",
    category: "Bachelor's Programs",
    subcategory: "Tourism & Hospitality",
    level: "Undergraduate",
    duration: "3-4 years",
    mode: "Online",
    partner: "eie European Business School",
    description: "Comprehensive program covering hotel management, tourism operations, event planning, and customer service excellence.",
    overview: "This program prepares students for management roles in the hospitality and tourism industry, covering hotel operations, tourism marketing, event management, and service excellence.",
    learningOutcomes: [
      "Manage hospitality operations and guest experiences",
      "Develop tourism marketing and promotional strategies",
      "Plan and execute events and conferences",
      "Apply revenue management and pricing strategies",
      "Lead teams in hospitality environments"
    ],
    modules: [
      "Introduction to Tourism & Hospitality",
      "Hotel Operations Management",
      "Food & Beverage Management",
      "Tourism Marketing",
      "Event Planning & Management",
      "Revenue Management",
      "Customer Service Excellence",
      "Sustainable Tourism",
      "Travel & Tour Operations",
      "Hospitality Law",
      "Cultural Tourism",
      "Industry Internship & Capstone"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "English proficiency (IELTS 6.0 or equivalent)",
      "Customer-oriented mindset"
    ],
    careerOpportunities: [
      "Hotel Manager",
      "Tourism Manager",
      "Event Manager",
      "Revenue Manager",
      "Resort Manager",
      "Tourism Marketing Manager"
    ],
    fees: {
      tuition: "$9,500 - $12,500 per year",
      installments: true
    },
    accreditation: "eie European Business School Accredited",
    rating: 4.6,
    enrolledStudents: 320
  },
  {
    id: "bachelor-business-general-walsh",
    title: "Bachelor of Business (General BBA)",
    code: "BBA-GEN-010",
    category: "Bachelor's Programs",
    subcategory: "Business Administration",
    level: "Undergraduate",
    duration: "3-4 years (Accelerated options available)",
    mode: "Online",
    partner: "Walsh College",
    description: "Flexible general business degree covering all core business disciplines with option to specialize.",
    overview: "This versatile program provides a broad business education covering management, marketing, finance, accounting, and operations, allowing students to customize their learning path.",
    learningOutcomes: [
      "Understand core business functions and their integration",
      "Apply business principles to solve organizational challenges",
      "Develop leadership and management capabilities",
      "Analyze business environments and competitive dynamics",
      "Make data-driven business decisions"
    ],
    modules: [
      "Business Fundamentals",
      "Principles of Management",
      "Marketing Principles",
      "Financial Accounting",
      "Managerial Accounting",
      "Business Finance",
      "Operations Management",
      "Business Law",
      "Business Analytics",
      "Strategic Management",
      "Entrepreneurship",
      "Business Capstone"
    ],
    entryRequirements: [
      "High school diploma or equivalent",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Business Analyst",
      "Operations Manager",
      "Project Manager",
      "Business Development Manager",
      "Management Consultant",
      "Entrepreneur"
    ],
    fees: {
      tuition: "$10,000 - $13,000 per year",
      installments: true
    },
    accreditation: "Walsh College - Accredited",
    rating: 4.7,
    enrolledStudents: 580
  },

  // B. Master's / Postgraduate Degrees
  {
    id: "mba-general",
    title: "Master of Business Administration (MBA)",
    code: "MBA-001",
    category: "Master's Programs",
    subcategory: "Business Administration",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online",
    partner: "UeCampus / EIE",
    description: "Premier MBA program developing strategic leadership, business acumen, and executive decision-making skills.",
    overview: "This flagship MBA program is designed for working professionals seeking to advance their careers. The curriculum covers strategic management, leadership, finance, marketing, and operations with real-world case studies.",
    learningOutcomes: [
      "Develop strategic thinking and executive leadership skills",
      "Apply advanced business concepts to complex challenges",
      "Lead organizational change and innovation",
      "Master financial analysis and business valuation",
      "Build high-performing teams and organizational culture"
    ],
    modules: [
      "Strategic Management",
      "Leadership & Organizational Behavior",
      "Financial Management for Executives",
      "Marketing Strategy",
      "Operations & Supply Chain Management",
      "Business Analytics & Decision Making",
      "Corporate Governance & Ethics",
      "Innovation & Entrepreneurship",
      "Global Business Strategy",
      "Change Management",
      "MBA Capstone Consulting Project"
    ],
    entryRequirements: [
      "Bachelor's degree from accredited institution",
      "2+ years of work experience (recommended)",
      "English proficiency (IELTS 6.5 or equivalent)",
      "GMAT/GRE (waived for experienced professionals)"
    ],
    careerOpportunities: [
      "Senior Manager / Executive",
      "Management Consultant",
      "Business Development Director",
      "Chief Operating Officer (COO)",
      "Entrepreneur / Startup Founder",
      "Strategy Director"
    ],
    fees: {
      tuition: "$18,000 - $25,000 total program",
      installments: true
    },
    accreditation: "UeCampus / EIE Accredited",
    rating: 4.9,
    enrolledStudents: 650
  },
  {
    id: "msit-master",
    title: "Master of Science in Information Technology (MSIT)",
    code: "MSIT-001",
    category: "Master's Programs",
    subcategory: "Information Technology",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online",
    partner: "UeCampus",
    description: "Advanced IT master's focusing on enterprise architecture, cloud computing, cybersecurity, and IT leadership.",
    overview: "This advanced IT program prepares graduates for leadership roles in technology organizations, covering enterprise systems, cloud architecture, IT governance, and emerging technologies.",
    learningOutcomes: [
      "Design and implement enterprise IT architectures",
      "Lead IT strategy and digital transformation initiatives",
      "Manage cloud infrastructure and DevOps practices",
      "Apply advanced cybersecurity frameworks",
      "Drive IT innovation and emerging technology adoption"
    ],
    modules: [
      "Enterprise Architecture",
      "Cloud Computing & Virtualization",
      "Advanced Database Systems",
      "IT Security & Risk Management",
      "DevOps & Continuous Integration",
      "IT Project & Portfolio Management",
      "Business Intelligence & Analytics",
      "Emerging Technologies (AI, IoT, Blockchain)",
      "IT Governance & Compliance",
      "Digital Transformation",
      "Research Methodology",
      "Master's Thesis/Project"
    ],
    entryRequirements: [
      "Bachelor's degree in IT, Computer Science, or related field",
      "English proficiency (IELTS 6.5 or equivalent)",
      "Professional IT experience (recommended)"
    ],
    careerOpportunities: [
      "IT Director / CTO",
      "Enterprise Architect",
      "Cloud Solutions Architect",
      "IT Security Manager",
      "DevOps Manager",
      "Digital Transformation Leader"
    ],
    fees: {
      tuition: "$16,000 - $22,000 total program",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.8,
    enrolledStudents: 380
  },
  {
    id: "ms-data-analytics",
    title: "Master of Science in Data Analytics",
    code: "MSDA-001",
    category: "Master's Programs",
    subcategory: "Data Science",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online",
    partner: "UeCampus",
    description: "Advanced data analytics program covering machine learning, big data, predictive modeling, and data strategy.",
    overview: "This cutting-edge program prepares data professionals for leadership roles in analytics, covering advanced statistical methods, machine learning, big data technologies, and strategic data management.",
    learningOutcomes: [
      "Build advanced predictive and prescriptive models",
      "Lead data strategy and analytics initiatives",
      "Apply machine learning to complex business problems",
      "Manage big data infrastructure and analytics platforms",
      "Communicate data insights to executive stakeholders"
    ],
    modules: [
      "Advanced Statistical Analysis",
      "Machine Learning & Deep Learning",
      "Big Data Technologies (Hadoop, Spark)",
      "Predictive Analytics",
      "Text & Sentiment Analysis",
      "Data Visualization & Storytelling",
      "Data Governance & Ethics",
      "Real-time Analytics",
      "Analytics Strategy & Leadership",
      "Industry-specific Analytics Applications",
      "Research Methods",
      "Master's Capstone Analytics Project"
    ],
    entryRequirements: [
      "Bachelor's degree with quantitative background",
      "Programming experience (Python/R recommended)",
      "English proficiency (IELTS 6.5 or equivalent)",
      "Statistics knowledge recommended"
    ],
    careerOpportunities: [
      "Senior Data Scientist",
      "Chief Data Officer (CDO)",
      "Analytics Manager",
      "Machine Learning Engineer",
      "Business Intelligence Director",
      "Data Strategy Consultant"
    ],
    fees: {
      tuition: "$17,000 - $23,000 total program",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.9,
    enrolledStudents: 420
  },
  {
    id: "ms-ai-ml",
    title: "Master of Science in Artificial Intelligence & Machine Learning",
    code: "MSAI-001",
    category: "Master's Programs",
    subcategory: "Artificial Intelligence",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online",
    partner: "UeCampus",
    description: "Specialized master's in AI covering deep learning, neural networks, NLP, computer vision, and AI ethics.",
    overview: "This advanced program focuses on artificial intelligence and machine learning technologies, preparing students to build intelligent systems, implement AI solutions, and lead AI initiatives.",
    learningOutcomes: [
      "Design and implement deep learning architectures",
      "Build natural language processing applications",
      "Develop computer vision and image recognition systems",
      "Apply reinforcement learning to complex problems",
      "Address AI ethics and responsible AI practices"
    ],
    modules: [
      "Foundations of Artificial Intelligence",
      "Deep Learning & Neural Networks",
      "Natural Language Processing",
      "Computer Vision",
      "Reinforcement Learning",
      "AI for Business Applications",
      "Explainable AI & Model Interpretability",
      "AI Ethics & Responsible AI",
      "Advanced Machine Learning",
      "AI Systems Architecture",
      "Research in AI",
      "AI Capstone Project"
    ],
    entryRequirements: [
      "Bachelor's degree in Computer Science, Engineering, or related field",
      "Strong programming skills (Python essential)",
      "Mathematics background (Linear Algebra, Calculus, Probability)",
      "English proficiency (IELTS 6.5 or equivalent)"
    ],
    careerOpportunities: [
      "AI/ML Engineer",
      "Research Scientist",
      "AI Product Manager",
      "Computer Vision Engineer",
      "NLP Engineer",
      "AI Consultant"
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
    id: "ms-finance",
    title: "Master of Science in Finance (MSF)",
    code: "MSF-001",
    category: "Master's Programs",
    subcategory: "Finance",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online",
    partner: "UeCampus",
    description: "Advanced finance program covering investment management, corporate finance, financial engineering, and risk analytics.",
    overview: "This rigorous program prepares finance professionals for senior roles in investment banking, portfolio management, corporate finance, and financial risk management.",
    learningOutcomes: [
      "Conduct advanced financial analysis and valuation",
      "Manage investment portfolios and risk",
      "Apply financial engineering and derivatives strategies",
      "Lead corporate finance and M&A transactions",
      "Use quantitative methods for financial decision-making"
    ],
    modules: [
      "Advanced Corporate Finance",
      "Investment & Portfolio Management",
      "Financial Risk Management",
      "Derivatives & Financial Engineering",
      "Fixed Income Securities",
      "Equity Valuation",
      "Mergers & Acquisitions",
      "International Finance",
      "Behavioral Finance",
      "Financial Econometrics",
      "FinTech & Financial Innovation",
      "Finance Capstone Project"
    ],
    entryRequirements: [
      "Bachelor's degree (finance/business/economics preferred)",
      "Quantitative aptitude",
      "English proficiency (IELTS 6.5 or equivalent)",
      "GMAT/GRE recommended"
    ],
    careerOpportunities: [
      "Investment Analyst",
      "Portfolio Manager",
      "Corporate Finance Manager",
      "Risk Manager",
      "Financial Consultant",
      "Chief Financial Officer (CFO)"
    ],
    fees: {
      tuition: "$17,500 - $23,500 total program",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.8,
    enrolledStudents: 290
  },
  {
    id: "ms-management",
    title: "Master of Science in Management",
    code: "MSM-001",
    category: "Master's Programs",
    subcategory: "Management",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online",
    partner: "UeCampus",
    description: "Comprehensive management program developing leadership, strategic thinking, and organizational management skills.",
    overview: "This program is designed for early-career professionals and recent graduates seeking to develop management and leadership capabilities across various business functions.",
    learningOutcomes: [
      "Lead teams and manage organizational performance",
      "Apply strategic management frameworks",
      "Drive organizational change and innovation",
      "Make data-driven management decisions",
      "Build effective organizational cultures"
    ],
    modules: [
      "Management Theory & Practice",
      "Strategic Management",
      "Leadership & Team Management",
      "Organizational Behavior",
      "Operations Management",
      "Project Management",
      "Change Management",
      "Human Resource Management",
      "Business Analytics for Managers",
      "Innovation Management",
      "Global Business Management",
      "Management Capstone"
    ],
    entryRequirements: [
      "Bachelor's degree in any field",
      "English proficiency (IELTS 6.5 or equivalent)",
      "Leadership potential"
    ],
    careerOpportunities: [
      "Operations Manager",
      "Project Manager",
      "Business Manager",
      "Team Lead / Supervisor",
      "Management Consultant",
      "General Manager"
    ],
    fees: {
      tuition: "$15,000 - $20,000 total program",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.7,
    enrolledStudents: 310
  },
  {
    id: "ms-marketing",
    title: "Master of Science in Marketing",
    code: "MSMKT-001",
    category: "Master's Programs",
    subcategory: "Marketing",
    level: "Postgraduate",
    duration: "1-2 years",
    mode: "Online",
    partner: "UeCampus",
    description: "Advanced marketing program covering digital marketing, brand strategy, marketing analytics, and customer insights.",
    overview: "This program prepares marketing professionals for leadership roles, covering modern marketing strategies, digital channels, analytics, brand management, and customer experience.",
    learningOutcomes: [
      "Develop integrated marketing strategies",
      "Lead digital marketing and social media campaigns",
      "Apply marketing analytics and consumer insights",
      "Build and manage brand portfolios",
      "Drive customer experience and engagement strategies"
    ],
    modules: [
      "Strategic Marketing Management",
      "Digital Marketing Strategy",
      "Marketing Analytics & ROI",
      "Consumer Behavior & Insights",
      "Brand Management",
      "Content Marketing & Storytelling",
      "Social Media & Influencer Marketing",
      "Marketing Automation",
      "Customer Experience Management",
      "Global Marketing",
      "Marketing Research Methods",
      "Marketing Capstone Project"
    ],
    entryRequirements: [
      "Bachelor's degree in marketing, business, or related field",
      "English proficiency (IELTS 6.5 or equivalent)",
      "Marketing experience recommended"
    ],
    careerOpportunities: [
      "Marketing Director",
      "Digital Marketing Manager",
      "Brand Manager",
      "Marketing Analytics Manager",
      "Chief Marketing Officer (CMO)",
      "Marketing Consultant"
    ],
    fees: {
      tuition: "$16,000 - $21,000 total program",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.8,
    enrolledStudents: 340
  },

  // C. Doctorate / PhD / DBA Programs
  {
    id: "dba-general",
    title: "Doctor of Business Administration (DBA)",
    code: "DBA-001",
    category: "Doctoral Programs",
    subcategory: "Business Administration",
    level: "Doctorate",
    duration: "3-5 years",
    mode: "Online",
    partner: "UeCampus / Walsh",
    description: "Professional doctorate focusing on applied business research, executive leadership, and organizational impact.",
    overview: "The DBA is designed for senior business professionals seeking to conduct applied research and drive organizational change. It emphasizes practical application of research to solve real-world business challenges.",
    learningOutcomes: [
      "Conduct rigorous applied business research",
      "Apply research findings to organizational practice",
      "Lead strategic change at executive level",
      "Contribute original knowledge to business disciplines",
      "Publish research in academic and practitioner outlets"
    ],
    modules: [
      "Advanced Research Methods",
      "Quantitative & Qualitative Analysis",
      "Strategic Leadership Theory",
      "Organizational Theory & Design",
      "Business Ethics & Corporate Governance",
      "Innovation & Entrepreneurship Research",
      "Applied Business Analytics",
      "Literature Review & Conceptual Frameworks",
      "Dissertation Proposal Development",
      "Dissertation Research",
      "Dissertation Defense"
    ],
    entryRequirements: [
      "Master's degree (MBA or relevant field)",
      "5+ years of senior management experience",
      "English proficiency (IELTS 7.0 or equivalent)",
      "Research proposal",
      "Academic references"
    ],
    careerOpportunities: [
      "C-Suite Executive (CEO, COO, CFO)",
      "Senior Consultant",
      "Business School Faculty",
      "Corporate Strategist",
      "Executive Coach",
      "Policy Advisor"
    ],
    fees: {
      tuition: "$30,000 - $45,000 total program",
      installments: true
    },
    accreditation: "UeCampus / Walsh Accredited",
    rating: 4.9,
    enrolledStudents: 85
  },
  {
    id: "phd-data-analytics",
    title: "PhD in Data Analytics",
    code: "PHD-DA-001",
    category: "Doctoral Programs",
    subcategory: "Data Science",
    level: "Doctorate",
    duration: "3-5 years",
    mode: "Online / Hybrid",
    partner: "UeCampus",
    description: "Research-focused doctorate advancing the field of data analytics through original research and scholarly contributions.",
    overview: "This PhD program prepares scholars and researchers to advance data analytics theory and practice through rigorous research, contributing to academic knowledge and industry innovation.",
    learningOutcomes: [
      "Conduct original research in data analytics",
      "Develop novel analytical methods and algorithms",
      "Publish in top-tier academic journals",
      "Teach and mentor at university level",
      "Contribute to data science theory and practice"
    ],
    modules: [
      "Advanced Statistical Theory",
      "Research Design in Analytics",
      "Machine Learning Theory",
      "Computational Methods",
      "Philosophy of Science & Data",
      "Advanced Data Mining",
      "Causal Inference",
      "Publishing & Academic Writing",
      "Comprehensive Exams",
      "Dissertation Research",
      "Dissertation Defense"
    ],
    entryRequirements: [
      "Master's degree in relevant quantitative field",
      "Strong research background",
      "Publications (preferred)",
      "English proficiency (IELTS 7.0 or equivalent)",
      "Research proposal & interview"
    ],
    careerOpportunities: [
      "University Professor / Researcher",
      "Chief Data Scientist",
      "Research Director",
      "AI/ML Research Scientist",
      "Data Science Consultant",
      "Think Tank Researcher"
    ],
    fees: {
      tuition: "$25,000 - $40,000 total program",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.9,
    enrolledStudents: 45
  },
  {
    id: "phd-cyber-security",
    title: "PhD in Cyber Security",
    code: "PHD-CS-001",
    category: "Doctoral Programs",
    subcategory: "Cyber Security",
    level: "Doctorate",
    duration: "3-5 years",
    mode: "Online / Hybrid",
    partner: "UeCampus",
    description: "Research doctorate advancing cybersecurity knowledge through cutting-edge research in security, privacy, and cryptography.",
    overview: "This PhD program focuses on advancing cybersecurity through original research in areas like cryptography, network security, privacy, and secure systems design.",
    learningOutcomes: [
      "Conduct innovative cybersecurity research",
      "Develop new security protocols and methods",
      "Publish in leading security conferences and journals",
      "Contribute to cybersecurity policy and standards",
      "Lead security research teams"
    ],
    modules: [
      "Advanced Cryptography",
      "Network Security Research",
      "Security Research Methods",
      "Privacy-Enhancing Technologies",
      "Secure Systems Design",
      "Cyber Threat Intelligence",
      "Formal Security Models",
      "Research Ethics & Responsible Disclosure",
      "Comprehensive Exams",
      "Dissertation Research",
      "Dissertation Defense"
    ],
    entryRequirements: [
      "Master's degree in Computer Science, Cybersecurity, or related field",
      "Strong technical background",
      "Research experience or publications",
      "English proficiency (IELTS 7.0 or equivalent)",
      "Research proposal"
    ],
    careerOpportunities: [
      "Security Research Scientist",
      "University Professor",
      "Chief Information Security Officer (CISO)",
      "Security Architect (Advanced)",
      "Government Security Advisor",
      "Security Think Tank Researcher"
    ],
    fees: {
      tuition: "$26,000 - $42,000 total program",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.9,
    enrolledStudents: 38
  },
  {
    id: "phd-ai-ml",
    title: "PhD in Artificial Intelligence & Machine Learning",
    code: "PHD-AI-001",
    category: "Doctoral Programs",
    subcategory: "Artificial Intelligence",
    level: "Doctorate",
    duration: "3-5 years",
    mode: "Online / Hybrid",
    partner: "UeCampus",
    description: "Research-intensive doctorate advancing AI/ML through original contributions to theory, algorithms, and applications.",
    overview: "This PhD program prepares researchers to push the boundaries of AI and machine learning through rigorous research in areas like deep learning, reinforcement learning, and AI applications.",
    learningOutcomes: [
      "Develop novel AI/ML algorithms and architectures",
      "Publish in top AI conferences (NeurIPS, ICML, ICLR)",
      "Advance theoretical foundations of AI/ML",
      "Lead AI research teams and projects",
      "Contribute to responsible AI development"
    ],
    modules: [
      "Advanced Machine Learning Theory",
      "Deep Learning Research",
      "Reinforcement Learning Theory",
      "AI Research Methods",
      "Computational Learning Theory",
      "Neural Architecture Search",
      "AI Ethics & Fairness",
      "Research Seminars",
      "Comprehensive Exams",
      "Dissertation Research",
      "Dissertation Defense"
    ],
    entryRequirements: [
      "Master's degree in Computer Science, AI, or related field",
      "Strong mathematical background",
      "Research publications (preferred)",
      "Programming expertise",
      "English proficiency (IELTS 7.0 or equivalent)"
    ],
    careerOpportunities: [
      "AI Research Scientist",
      "University Professor",
      "Chief AI Officer",
      "Research Lab Director",
      "AI Policy Advisor",
      "Senior ML Engineer"
    ],
    fees: {
      tuition: "$28,000 - $45,000 total program",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.9,
    enrolledStudents: 52
  },

  // D. Level 7 Diplomas
  {
    id: "level7-data-science",
    title: "Level 7 Diploma in Data Science",
    code: "L7-DS-001",
    category: "Professional Diplomas",
    subcategory: "Level 7 Qualifications",
    level: "Postgraduate Diploma",
    duration: "9-12 months",
    mode: "Online",
    partner: "Qualifi / Ofqual",
    description: "Professional postgraduate diploma in data science, equivalent to a master's level qualification.",
    overview: "This Level 7 qualification provides advanced data science skills and can be used as a pathway to master's programs or direct career advancement.",
    learningOutcomes: [
      "Apply advanced data analysis techniques",
      "Build machine learning models",
      "Manage data science projects",
      "Use modern data science tools and platforms",
      "Communicate data insights effectively"
    ],
    modules: [
      "Data Analytics for Business",
      "Machine Learning Applications",
      "Big Data Management",
      "Statistical Modeling",
      "Data Visualization",
      "Research Methods in Data Science"
    ],
    entryRequirements: [
      "Bachelor's degree or Level 6 qualification",
      "Work experience in related field (recommended)",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Data Analyst",
      "Junior Data Scientist",
      "Business Analyst",
      "Analytics Consultant"
    ],
    fees: {
      tuition: "$3,500 - $5,000 total",
      installments: true
    },
    accreditation: "Qualifi / Ofqual Regulated",
    rating: 4.7,
    enrolledStudents: 180
  },
  {
    id: "level7-accounting-finance",
    title: "Level 7 Diploma in Accounting and Finance",
    code: "L7-AF-001",
    category: "Professional Diplomas",
    subcategory: "Level 7 Qualifications",
    level: "Postgraduate Diploma",
    duration: "9-12 months",
    mode: "Online",
    partner: "Qualifi / Ofqual",
    description: "Advanced accounting and finance qualification at postgraduate level, recognized by professional bodies.",
    overview: "This qualification provides advanced knowledge in accounting and finance, suitable for accounting professionals and those seeking to progress to chartered accountancy.",
    learningOutcomes: [
      "Prepare advanced financial reports",
      "Apply auditing and assurance principles",
      "Manage corporate finance and investments",
      "Understand international accounting standards",
      "Apply strategic financial management"
    ],
    modules: [
      "Advanced Financial Reporting",
      "Strategic Management Accounting",
      "Auditing & Assurance",
      "Corporate Finance",
      "Taxation Strategy",
      "Financial Strategy"
    ],
    entryRequirements: [
      "Bachelor's degree or relevant professional qualification",
      "Accounting background recommended",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Senior Accountant",
      "Financial Manager",
      "Management Accountant",
      "Internal Auditor",
      "Finance Analyst"
    ],
    fees: {
      tuition: "$3,500 - $5,500 total",
      installments: true
    },
    accreditation: "Qualifi / Ofqual Regulated",
    rating: 4.8,
    enrolledStudents: 220
  },
  {
    id: "level7-strategic-marketing",
    title: "Level 7 Diploma in Strategic Marketing",
    code: "L7-SM-001",
    category: "Professional Diplomas",
    subcategory: "Level 7 Qualifications",
    level: "Postgraduate Diploma",
    duration: "9-12 months",
    mode: "Online",
    partner: "Qualifi / Ofqual",
    description: "Advanced marketing qualification focusing on strategic marketing management and planning.",
    overview: "This postgraduate-level qualification develops strategic marketing capabilities, suitable for marketing managers and those seeking senior marketing roles.",
    learningOutcomes: [
      "Develop strategic marketing plans",
      "Lead marketing teams and projects",
      "Apply digital marketing strategies",
      "Conduct marketing research and analysis",
      "Manage brand and customer relationships"
    ],
    modules: [
      "Strategic Marketing Management",
      "Marketing Planning",
      "Digital Marketing Strategy",
      "Brand Management",
      "Marketing Research",
      "Customer Relationship Management"
    ],
    entryRequirements: [
      "Bachelor's degree or Level 6 qualification",
      "Marketing experience recommended",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Marketing Manager",
      "Brand Manager",
      "Digital Marketing Manager",
      "Marketing Strategist",
      "Marketing Consultant"
    ],
    fees: {
      tuition: "$3,200 - $4,800 total",
      installments: true
    },
    accreditation: "Qualifi / Ofqual Regulated",
    rating: 4.7,
    enrolledStudents: 195
  },
  {
    id: "level7-hrm",
    title: "Level 7 Diploma in Human Resource Management",
    code: "L7-HRM-001",
    category: "Professional Diplomas",
    subcategory: "Level 7 Qualifications",
    level: "Postgraduate Diploma",
    duration: "9-12 months",
    mode: "Online",
    partner: "Qualifi / Ofqual",
    description: "Advanced HR qualification covering strategic HRM, organizational development, and employment law.",
    overview: "This qualification prepares HR professionals for senior roles, covering strategic HRM, talent management, and organizational development.",
    learningOutcomes: [
      "Develop strategic HR policies",
      "Manage talent acquisition and development",
      "Lead organizational change initiatives",
      "Apply employment law and compliance",
      "Build effective employee relations"
    ],
    modules: [
      "Strategic Human Resource Management",
      "Talent Management & Development",
      "Employment Law",
      "Organizational Development",
      "Employee Relations",
      "HR Analytics"
    ],
    entryRequirements: [
      "Bachelor's degree or Level 6 qualification",
      "HR experience recommended",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "HR Manager",
      "Talent Manager",
      "Organizational Development Manager",
      "HR Business Partner",
      "HR Consultant"
    ],
    fees: {
      tuition: "$3,200 - $4,800 total",
      installments: true
    },
    accreditation: "Qualifi / Ofqual Regulated",
    rating: 4.7,
    enrolledStudents: 165
  },
  {
    id: "level7-hospitality-tourism",
    title: "Level 7 Diploma in Hospitality and Tourism Management",
    code: "L7-HTM-001",
    category: "Professional Diplomas",
    subcategory: "Level 7 Qualifications",
    level: "Postgraduate Diploma",
    duration: "9-12 months",
    mode: "Online",
    partner: "Qualifi / Ofqual",
    description: "Advanced hospitality and tourism management qualification at postgraduate level.",
    overview: "This qualification develops strategic management skills for hospitality and tourism professionals, covering operations, marketing, and strategic planning.",
    learningOutcomes: [
      "Manage hospitality and tourism operations strategically",
      "Develop tourism marketing strategies",
      "Apply revenue management techniques",
      "Lead customer service excellence initiatives",
      "Plan sustainable tourism development"
    ],
    modules: [
      "Strategic Hospitality Management",
      "Tourism Marketing & Promotion",
      "Revenue Management",
      "Customer Service Excellence",
      "Sustainable Tourism",
      "Event Management"
    ],
    entryRequirements: [
      "Bachelor's degree or Level 6 qualification",
      "Industry experience recommended",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "Hotel General Manager",
      "Tourism Manager",
      "Revenue Manager",
      "Event Manager",
      "Hospitality Consultant"
    ],
    fees: {
      tuition: "$3,000 - $4,500 total",
      installments: true
    },
    accreditation: "Qualifi / Ofqual Regulated",
    rating: 4.6,
    enrolledStudents: 140
  },
  {
    id: "level7-education-management",
    title: "Level 7 Diploma in Education Management & Leadership",
    code: "L7-EML-001",
    category: "Professional Diplomas",
    subcategory: "Level 7 Qualifications",
    level: "Postgraduate Diploma",
    duration: "9-12 months",
    mode: "Online",
    partner: "Qualifi / Ofqual",
    description: "Advanced qualification for education professionals seeking leadership and management roles.",
    overview: "This qualification develops leadership and management capabilities for education professionals, covering educational leadership, curriculum development, and institutional management.",
    learningOutcomes: [
      "Lead educational institutions effectively",
      "Develop and implement curricula",
      "Manage educational quality and standards",
      "Apply educational policy and legislation",
      "Drive educational innovation and improvement"
    ],
    modules: [
      "Educational Leadership",
      "Curriculum Development & Management",
      "Quality Assurance in Education",
      "Educational Policy & Legislation",
      "Resource Management",
      "Research Methods in Education"
    ],
    entryRequirements: [
      "Bachelor's degree in education or related field",
      "Teaching experience required",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "School Principal / Headteacher",
      "Education Manager",
      "Curriculum Developer",
      "Education Consultant",
      "Academic Director"
    ],
    fees: {
      tuition: "$3,200 - $4,700 total",
      installments: true
    },
    accreditation: "Qualifi / Ofqual Regulated",
    rating: 4.8,
    enrolledStudents: 175
  },
  {
    id: "level7-information-technology",
    title: "Level 7 Diploma in Information Technology",
    code: "L7-IT-001",
    category: "Professional Diplomas",
    subcategory: "Level 7 Qualifications",
    level: "Postgraduate Diploma",
    duration: "9-12 months",
    mode: "Online",
    partner: "Qualifi / Ofqual",
    description: "Advanced IT qualification covering strategic IT management, cybersecurity, and enterprise architecture.",
    overview: "This postgraduate-level IT qualification develops strategic IT management skills, suitable for IT professionals seeking senior technical or management roles.",
    learningOutcomes: [
      "Manage IT infrastructure and operations strategically",
      "Implement cybersecurity frameworks",
      "Lead IT projects and teams",
      "Apply enterprise architecture principles",
      "Drive digital transformation initiatives"
    ],
    modules: [
      "Strategic IT Management",
      "IT Security & Risk Management",
      "Enterprise Architecture",
      "IT Project Management",
      "Cloud Computing",
      "Research Methods in IT"
    ],
    entryRequirements: [
      "Bachelor's degree or Level 6 qualification in IT",
      "IT experience recommended",
      "English proficiency (IELTS 6.0 or equivalent)"
    ],
    careerOpportunities: [
      "IT Manager",
      "Systems Architect",
      "IT Security Manager",
      "IT Project Manager",
      "IT Consultant"
    ],
    fees: {
      tuition: "$3,500 - $5,000 total",
      installments: true
    },
    accreditation: "Qualifi / Ofqual Regulated",
    rating: 4.7,
    enrolledStudents: 205
  },

  // E. Level 5 Diplomas
  {
    id: "level5-accounting-finance",
    title: "Level 5 Diploma in Accounting and Finance",
    code: "L5-AF-001",
    category: "Professional Diplomas",
    subcategory: "Level 5 Qualifications",
    level: "Higher National Diploma",
    duration: "12-18 months",
    mode: "Online",
    partner: "Qualifi",
    description: "Higher National Diploma in accounting and finance, equivalent to the second year of a bachelor's degree.",
    overview: "This qualification provides comprehensive accounting and finance knowledge, suitable for accounting technicians and those seeking progression to degree programs.",
    learningOutcomes: [
      "Prepare financial statements",
      "Apply management accounting techniques",
      "Understand taxation basics",
      "Perform financial analysis",
      "Use accounting software"
    ],
    modules: [
      "Financial Accounting",
      "Management Accounting",
      "Taxation",
      "Business Law",
      "Financial Analysis",
      "Auditing Basics"
    ],
    entryRequirements: [
      "Level 3 qualification or equivalent",
      "English proficiency (IELTS 5.5 or equivalent)"
    ],
    careerOpportunities: [
      "Accounts Assistant",
      "Bookkeeper",
      "Finance Assistant",
      "Payroll Administrator",
      "Tax Assistant"
    ],
    fees: {
      tuition: "$2,500 - $3,500 total",
      installments: true
    },
    accreditation: "Qualifi Accredited",
    rating: 4.6,
    enrolledStudents: 280
  },
  {
    id: "level5-cyber-security",
    title: "Level 5 Diploma in Cyber Security",
    code: "L5-CS-001",
    category: "Professional Diplomas",
    subcategory: "Level 5 Qualifications",
    level: "Higher National Diploma",
    duration: "12-18 months",
    mode: "Online",
    partner: "Qualifi",
    description: "Higher National Diploma in cybersecurity covering network security, ethical hacking, and security operations.",
    overview: "This qualification provides practical cybersecurity skills and knowledge, preparing students for technical security roles or progression to degree programs.",
    learningOutcomes: [
      "Implement network security measures",
      "Conduct basic penetration testing",
      "Monitor and respond to security incidents",
      "Apply security policies and procedures",
      "Use security tools and technologies"
    ],
    modules: [
      "Network Security Fundamentals",
      "Ethical Hacking Basics",
      "Security Operations",
      "Digital Forensics Introduction",
      "Security Policies & Compliance",
      "Cryptography Basics"
    ],
    entryRequirements: [
      "Level 3 qualification in IT or related field",
      "Basic IT knowledge",
      "English proficiency (IELTS 5.5 or equivalent)"
    ],
    careerOpportunities: [
      "Junior Security Analyst",
      "Security Operations Assistant",
      "IT Security Technician",
      "Network Security Technician"
    ],
    fees: {
      tuition: "$2,800 - $4,000 total",
      installments: true
    },
    accreditation: "Qualifi Accredited",
    rating: 4.7,
    enrolledStudents: 240
  },
  {
    id: "level5-information-technology",
    title: "Level 5 Diploma in Information Technology",
    code: "L5-IT-001",
    category: "Professional Diplomas",
    subcategory: "Level 5 Qualifications",
    level: "Higher National Diploma",
    duration: "12-18 months",
    mode: "Online",
    partner: "Qualifi",
    description: "Comprehensive IT qualification covering software development, networking, and database management.",
    overview: "This HND provides broad IT skills and knowledge, suitable for IT technicians and those seeking to progress to bachelor's degree programs.",
    learningOutcomes: [
      "Develop software applications",
      "Manage computer networks",
      "Design and maintain databases",
      "Provide IT technical support",
      "Implement IT solutions"
    ],
    modules: [
      "Programming Fundamentals",
      "Networking Basics",
      "Database Design",
      "Web Development",
      "Systems Analysis",
      "IT Project Management Basics"
    ],
    entryRequirements: [
      "Level 3 qualification or equivalent",
      "Basic computer skills",
      "English proficiency (IELTS 5.5 or equivalent)"
    ],
    careerOpportunities: [
      "Junior Software Developer",
      "IT Support Technician",
      "Network Technician",
      "Database Assistant",
      "Web Developer"
    ],
    fees: {
      tuition: "$2,500 - $3,800 total",
      installments: true
    },
    accreditation: "Qualifi Accredited",
    rating: 4.6,
    enrolledStudents: 320
  },
  {
    id: "level5-psychology",
    title: "Level 5 Diploma in Psychology",
    code: "L5-PSY-001",
    category: "Professional Diplomas",
    subcategory: "Level 5 Qualifications",
    level: "Higher National Diploma",
    duration: "12-18 months",
    mode: "Online",
    partner: "Qualifi",
    description: "Higher National Diploma in psychology covering developmental, cognitive, and social psychology.",
    overview: "This qualification provides foundational psychology knowledge and research skills, suitable for those seeking careers in psychology support roles or progression to psychology degrees.",
    learningOutcomes: [
      "Understand major psychological theories",
      "Apply research methods in psychology",
      "Analyze human behavior and cognition",
      "Understand developmental psychology",
      "Apply psychological principles ethically"
    ],
    modules: [
      "Introduction to Psychology",
      "Cognitive Psychology",
      "Developmental Psychology",
      "Social Psychology",
      "Research Methods in Psychology",
      "Biological Psychology"
    ],
    entryRequirements: [
      "Level 3 qualification or equivalent",
      "Interest in human behavior",
      "English proficiency (IELTS 5.5 or equivalent)"
    ],
    careerOpportunities: [
      "Psychology Assistant",
      "Mental Health Support Worker",
      "Research Assistant",
      "Counselling Assistant",
      "Community Support Worker"
    ],
    fees: {
      tuition: "$2,400 - $3,600 total",
      installments: true
    },
    accreditation: "Qualifi Accredited",
    rating: 4.5,
    enrolledStudents: 190
  },
  {
    id: "level5-hospitality-tourism",
    title: "Level 5 Diploma in Hospitality and Tourism Management",
    code: "L5-HTM-001",
    category: "Professional Diplomas",
    subcategory: "Level 5 Qualifications",
    level: "Higher National Diploma",
    duration: "12-18 months",
    mode: "Online",
    partner: "Qualifi",
    description: "HND in hospitality and tourism covering operations management, customer service, and event planning.",
    overview: "This qualification develops practical hospitality and tourism management skills, preparing students for supervisory roles or degree progression.",
    learningOutcomes: [
      "Manage hospitality operations",
      "Deliver excellent customer service",
      "Plan and coordinate events",
      "Apply tourism marketing basics",
      "Understand hospitality industry standards"
    ],
    modules: [
      "Hospitality Operations",
      "Customer Service Management",
      "Food & Beverage Operations",
      "Tourism Management",
      "Event Planning",
      "Hospitality Marketing"
    ],
    entryRequirements: [
      "Level 3 qualification or equivalent",
      "Customer service experience recommended",
      "English proficiency (IELTS 5.5 or equivalent)"
    ],
    careerOpportunities: [
      "Hotel Supervisor",
      "Restaurant Manager",
      "Event Coordinator",
      "Tourism Coordinator",
      "Guest Relations Manager"
    ],
    fees: {
      tuition: "$2,300 - $3,400 total",
      installments: true
    },
    accreditation: "Qualifi Accredited",
    rating: 4.5,
    enrolledStudents: 170
  },
  {
    id: "level5-business-management-extended",
    title: "Extended Level 5 Diploma in Business Management",
    code: "L5-BM-EXT-001",
    category: "Professional Diplomas",
    subcategory: "Level 5 Qualifications",
    level: "Higher National Diploma",
    duration: "12-18 months",
    mode: "Online",
    partner: "Qualifi",
    description: "Extended HND in business management with additional units for comprehensive business education.",
    overview: "This extended qualification provides comprehensive business management knowledge and skills, offering a broad foundation for career progression or degree completion.",
    learningOutcomes: [
      "Understand core business functions",
      "Apply management principles",
      "Analyze business environments",
      "Develop business strategies",
      "Lead and motivate teams"
    ],
    modules: [
      "Business Environment",
      "Management & Leadership",
      "Marketing Principles",
      "Financial Management",
      "Human Resource Management",
      "Operations Management",
      "Business Strategy",
      "Project Management"
    ],
    entryRequirements: [
      "Level 3 qualification or equivalent",
      "English proficiency (IELTS 5.5 or equivalent)"
    ],
    careerOpportunities: [
      "Business Administrator",
      "Team Leader",
      "Operations Supervisor",
      "Business Analyst",
      "Project Coordinator"
    ],
    fees: {
      tuition: "$2,600 - $3,800 total",
      installments: true
    },
    accreditation: "Qualifi Accredited",
    rating: 4.6,
    enrolledStudents: 350
  },

  // F. Level 4 Diplomas
  {
    id: "level4-information-technology",
    title: "Level 4 Diploma in Information Technology",
    code: "L4-IT-001",
    category: "Professional Diplomas",
    subcategory: "Level 4 Qualifications",
    level: "Higher Education Certificate",
    duration: "6-12 months",
    mode: "Online",
    partner: "Qualifi",
    description: "Foundation IT qualification covering basic programming, networking, and systems administration.",
    overview: "This qualification provides entry-level IT knowledge and skills, equivalent to the first year of a bachelor's degree, suitable for career starters or progression to higher qualifications.",
    learningOutcomes: [
      "Understand IT fundamentals",
      "Write basic programs",
      "Configure computer networks",
      "Troubleshoot IT problems",
      "Use IT tools effectively"
    ],
    modules: [
      "IT Fundamentals",
      "Introduction to Programming",
      "Computer Networks Basics",
      "Operating Systems",
      "Web Design Basics",
      "IT Support"
    ],
    entryRequirements: [
      "Level 3 qualification or equivalent work experience",
      "Basic computer literacy",
      "English proficiency (IELTS 5.0 or equivalent)"
    ],
    careerOpportunities: [
      "IT Support Assistant",
      "Junior Developer",
      "Help Desk Technician",
      "IT Administrator",
      "Web Assistant"
    ],
    fees: {
      tuition: "$1,800 - $2,800 total",
      installments: true
    },
    accreditation: "Qualifi Accredited",
    rating: 4.5,
    enrolledStudents: 280
  },
  {
    id: "level4-cyber-security",
    title: "Level 4 Diploma in Cyber Security",
    code: "L4-CS-001",
    category: "Professional Diplomas",
    subcategory: "Level 4 Qualifications",
    level: "Higher Education Certificate",
    duration: "6-12 months",
    mode: "Online",
    partner: "Qualifi",
    description: "Foundation cybersecurity qualification introducing security concepts, threats, and basic defense mechanisms.",
    overview: "This entry-level qualification introduces cybersecurity fundamentals, preparing students for junior security roles or further study.",
    learningOutcomes: [
      "Understand cybersecurity fundamentals",
      "Identify common security threats",
      "Apply basic security controls",
      "Follow security policies",
      "Use security tools"
    ],
    modules: [
      "Introduction to Cybersecurity",
      "Network Security Basics",
      "Threat Landscape",
      "Security Policies",
      "Basic Cryptography",
      "Security Tools"
    ],
    entryRequirements: [
      "Level 3 qualification or IT experience",
      "Basic IT knowledge",
      "English proficiency (IELTS 5.0 or equivalent)"
    ],
    careerOpportunities: [
      "Security Assistant",
      "IT Security Support",
      "Security Operations Intern",
      "Junior Security Analyst"
    ],
    fees: {
      tuition: "$1,900 - $2,900 total",
      installments: true
    },
    accreditation: "Qualifi Accredited",
    rating: 4.6,
    enrolledStudents: 220
  },
  {
    id: "level4-psychology",
    title: "Level 4 Diploma in Psychology",
    code: "L4-PSY-001",
    category: "Professional Diplomas",
    subcategory: "Level 4 Qualifications",
    level: "Higher Education Certificate",
    duration: "6-12 months",
    mode: "Online",
    partner: "Qualifi",
    description: "Introduction to psychology covering basic theories, research methods, and key psychological concepts.",
    overview: "This foundational qualification introduces psychology as a discipline, covering basic theories and research methods.",
    learningOutcomes: [
      "Understand basic psychological concepts",
      "Identify major psychological perspectives",
      "Apply basic research methods",
      "Analyze human behavior",
      "Understand psychological ethics"
    ],
    modules: [
      "Foundations of Psychology",
      "Research Methods Basics",
      "Introduction to Cognitive Psychology",
      "Introduction to Social Psychology",
      "Psychology of Learning",
      "Psychology Ethics"
    ],
    entryRequirements: [
      "Level 3 qualification or equivalent",
      "English proficiency (IELTS 5.0 or equivalent)"
    ],
    careerOpportunities: [
      "Support Worker",
      "Research Assistant",
      "Care Assistant",
      "Community Worker"
    ],
    fees: {
      tuition: "$1,700 - $2,600 total",
      installments: true
    },
    accreditation: "Qualifi Accredited",
    rating: 4.4,
    enrolledStudents: 160
  },
  {
    id: "level4-hospitality-tourism",
    title: "Level 4 Diploma in Hospitality and Tourism Management",
    code: "L4-HTM-001",
    category: "Professional Diplomas",
    subcategory: "Level 4 Qualifications",
    level: "Higher Education Certificate",
    duration: "6-12 months",
    mode: "Online",
    partner: "Qualifi",
    description: "Foundation qualification in hospitality and tourism covering industry basics and customer service.",
    overview: "This entry-level qualification introduces hospitality and tourism industry operations, customer service, and management basics.",
    learningOutcomes: [
      "Understand hospitality industry structure",
      "Deliver customer service",
      "Understand tourism operations",
      "Apply hospitality standards",
      "Work in hospitality teams"
    ],
    modules: [
      "Introduction to Hospitality",
      "Customer Service",
      "Tourism Industry Overview",
      "Food Safety & Hygiene",
      "Front Office Operations",
      "Hospitality Marketing Basics"
    ],
    entryRequirements: [
      "Level 3 qualification or work experience",
      "English proficiency (IELTS 5.0 or equivalent)"
    ],
    careerOpportunities: [
      "Hotel Receptionist",
      "Restaurant Assistant",
      "Tour Guide",
      "Guest Services Assistant",
      "Travel Agent Assistant"
    ],
    fees: {
      tuition: "$1,600 - $2,500 total",
      installments: true
    },
    accreditation: "Qualifi Accredited",
    rating: 4.4,
    enrolledStudents: 145
  },
  {
    id: "level4-accounting-finance",
    title: "Level 4 Diploma in Accounting and Finance",
    code: "L4-AF-001",
    category: "Professional Diplomas",
    subcategory: "Level 4 Qualifications",
    level: "Higher Education Certificate",
    duration: "6-12 months",
    mode: "Online",
    partner: "Qualifi",
    description: "Foundation accounting qualification covering bookkeeping, financial accounting basics, and business finance.",
    overview: "This entry-level qualification introduces accounting principles and practices, suitable for those starting careers in accounting or finance.",
    learningOutcomes: [
      "Maintain basic accounting records",
      "Prepare simple financial statements",
      "Understand business finance basics",
      "Use accounting software",
      "Apply accounting principles"
    ],
    modules: [
      "Introduction to Accounting",
      "Bookkeeping",
      "Financial Accounting Basics",
      "Business Finance Introduction",
      "Computerized Accounting",
      "Business Law Basics"
    ],
    entryRequirements: [
      "Level 3 qualification or equivalent",
      "Basic numeracy skills",
      "English proficiency (IELTS 5.0 or equivalent)"
    ],
    careerOpportunities: [
      "Accounts Clerk",
      "Bookkeeper",
      "Finance Assistant",
      "Payroll Assistant",
      "Accounts Payable/Receivable Clerk"
    ],
    fees: {
      tuition: "$1,700 - $2,700 total",
      installments: true
    },
    accreditation: "Qualifi Accredited",
    rating: 4.5,
    enrolledStudents: 240
  },

  // G. Level 3 / Level 2 Programs
  {
    id: "level3-business-management",
    title: "Level 3 Integrated Diploma in Business and Management",
    code: "L3-BM-001",
    category: "Foundation Diplomas",
    subcategory: "Level 3 Qualifications",
    level: "Advanced",
    duration: "6-12 months",
    mode: "Online",
    partner: "UeCampus",
    description: "Advanced foundation qualification in business and management, equivalent to A-Level.",
    overview: "This qualification provides a solid foundation in business principles, preparing students for employment or higher education in business fields.",
    learningOutcomes: [
      "Understand business organizations",
      "Apply basic management principles",
      "Understand marketing basics",
      "Use business communication skills",
      "Work in business teams"
    ],
    modules: [
      "Introduction to Business",
      "Business Communication",
      "Marketing Basics",
      "Customer Service",
      "Business Environment",
      "Team Working"
    ],
    entryRequirements: [
      "Level 2 qualification or equivalent work experience",
      "English proficiency"
    ],
    careerOpportunities: [
      "Administrative Assistant",
      "Customer Service Representative",
      "Sales Assistant",
      "Office Coordinator"
    ],
    fees: {
      tuition: "$1,200 - $2,000 total",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.3,
    enrolledStudents: 320
  },
  {
    id: "level2-cyber-security-beginners",
    title: "Level 2 Diploma for Beginners in Cyber Security",
    code: "L2-CS-BEG-001",
    category: "Foundation Diplomas",
    subcategory: "Level 2 Qualifications",
    level: "Intermediate",
    duration: "3-6 months",
    mode: "Online",
    partner: "UeCampus",
    description: "Introductory qualification for complete beginners interested in cybersecurity careers.",
    overview: "This beginner-friendly qualification introduces cybersecurity concepts and basic IT security practices, perfect for career starters.",
    learningOutcomes: [
      "Understand cybersecurity importance",
      "Identify common cyber threats",
      "Practice safe computing",
      "Use basic security tools",
      "Follow security best practices"
    ],
    modules: [
      "Introduction to IT Security",
      "Cyber Threats Overview",
      "Safe Internet Practices",
      "Password Security",
      "Basic Security Tools",
      "Privacy & Data Protection"
    ],
    entryRequirements: [
      "No formal qualifications required",
      "Basic computer literacy",
      "English proficiency"
    ],
    careerOpportunities: [
      "IT Support Trainee",
      "Security Awareness Coordinator",
      "Junior Help Desk",
      "Entry IT Security Roles"
    ],
    fees: {
      tuition: "$800 - $1,500 total",
      installments: true
    },
    accreditation: "UeCampus Accredited",
    rating: 4.2,
    enrolledStudents: 280
  },
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
