import { ResumeData } from '@/types';

export interface SamplePreset {
  id: string;
  title: string;
  role: string;
  targetJobDescription: string;
  data: ResumeData;
}

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'fullstack',
    title: 'Senior Full-Stack Engineer',
    role: 'Full-Stack Developer',
    targetJobDescription: `We are looking for a Senior Full-Stack Engineer proficient in Python, React, Next.js, Node.js, PostgreSQL, AWS, and Microservices architecture. Must have experience optimizing high-throughput REST APIs, implementing CI/CD pipelines, and leading agile dev teams to deliver scalable web platforms with 99.9% availability.`,
    data: {
      personalInfo: {
        fullName: 'Abdul Nabi',
        title: 'Senior Full-Stack Engineer',
        email: 'abdul.nabi@example.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/abdulnabi',
        github: 'github.com/abdulnabii',
        website: 'aiwithab.site',
        summary:
          'Impact-driven Senior Full-Stack Engineer with 6+ years of experience architecting distributed cloud applications, high-throughput microservices, and AI-driven platforms. Proven track record of reducing latency by 40% and scaling web platforms to 2M+ active users.',
      },
      experience: [
        {
          id: 'exp_1',
          company: 'Apex Cloud Systems',
          role: 'Lead Full-Stack Engineer',
          location: 'San Francisco, CA',
          startDate: '2023-01',
          endDate: 'Present',
          isCurrent: true,
          bullets: [
            'Architected microservices backend using Python FastAPI & Node.js on AWS EKS, handling 3.5M daily API requests with 99.98% uptime.',
            'Spearheaded Next.js 14 frontend redesign, boosting core web vitals score by 45% and reducing page load times from 2.8s to 650ms.',
            'Optimized PostgreSQL query execution plans and redis caching layers, cutting database p99 latency by 52%.',
          ],
        },
        {
          id: 'exp_2',
          company: 'DataScale Tech',
          role: 'Software Engineer',
          location: 'San Jose, CA',
          startDate: '2020-06',
          endDate: '2022-12',
          isCurrent: false,
          bullets: [
            'Engineered real-time analytics dashboard with React, WebSockets, and Node.js for 15,000 enterprise users.',
            'Automated CI/CD deployment pipelines using GitHub Actions and Terraform, accelerating release cycles from bi-weekly to daily.',
          ],
        },
      ],
      education: [
        {
          id: 'edu_1',
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          startDate: '2016-08',
          endDate: '2020-05',
          gpa: '3.88',
        },
      ],
      projects: [
        {
          id: 'proj_1',
          name: 'AI Code Review Bot',
          description: 'Automated static code analyzer leveraging LLMs to detect SQL injection vulnerabilities and O(n²) performance bottlenecks.',
          technologies: ['Next.js 14', 'Python', 'Google Gemini API', 'Tailwind CSS'],
          link: 'code-review.aiwithab.site',
        },
      ],
      skills: [
        {
          category: 'Languages & Core',
          skills: ['TypeScript', 'JavaScript', 'Python', 'SQL', 'HTML5/CSS3', 'Node.js'],
        },
        {
          category: 'Frameworks & Databases',
          skills: ['Next.js 14', 'React', 'FastAPI', 'Express', 'PostgreSQL', 'Redis', 'MongoDB'],
        },
        {
          category: 'Cloud & DevOps',
          skills: ['AWS (EKS, S3, Lambda)', 'Docker', 'Kubernetes', 'CI/CD Pipelines', 'Git'],
        },
      ],
      certifications: ['AWS Certified Solutions Architect – Associate', 'Certified Kubernetes Application Developer (CKAD)'],
    },
  },
  {
    id: 'ai_pm',
    title: 'AI Product Manager',
    role: 'Product Lead',
    targetJobDescription: `Seeking an AI Product Manager to drive enterprise LLM product roadmaps, user growth, conversion rate optimization, cross-functional engineering execution, and market strategy for generative AI applications.`,
    data: {
      personalInfo: {
        fullName: 'Sarah Jenkins',
        title: 'Principal AI Product Manager',
        email: 'sarah.j@example.com',
        phone: '+1 (555) 987-6543',
        location: 'New York, NY',
        linkedin: 'linkedin.com/in/sarahjenkins-pm',
        website: 'sarahpm.io',
        summary:
          'Strategic Product Leader with 7+ years directing AI SaaS initiatives from concept to $12M ARR. Specialized in generative AI features, user retention loops, and data-driven product analytics.',
      },
      experience: [
        {
          id: 'exp_pm1',
          company: 'Cognitive AI Labs',
          role: 'Lead Product Manager',
          location: 'New York, NY',
          startDate: '2022-03',
          endDate: 'Present',
          isCurrent: true,
          bullets: [
            'Defined product strategy for enterprise AI assistant, driving 140% YoY ARR growth to $14M within 18 months.',
            'Collaborated with 18 engineers and ML researchers to deploy RAG search pipeline, improving answer accuracy by 34%.',
            'Executed A/B onboarding experiments that boosted user activation rates by 28% across 450,000 monthly active users.',
          ],
        },
      ],
      education: [
        {
          id: 'edu_pm1',
          institution: 'Columbia Business School',
          degree: 'MBA',
          fieldOfStudy: 'Technology Management',
          startDate: '2018-09',
          endDate: '2020-05',
        },
      ],
      projects: [],
      skills: [
        {
          category: 'Product & Strategy',
          skills: ['AI Product Roadmap', 'User Research', 'A/B Testing', 'Growth Loops', 'Go-To-Market'],
        },
        {
          category: 'Technical Knowledge',
          skills: ['Generative AI', 'LLM Prompt Engineering', 'SQL Analytics', 'Mixpanel', 'Jira/Agile'],
        },
      ],
      certifications: ['Pragmatic Institute Certified (PMC-III)', 'Scrum Alliance Certified Product Owner'],
    },
  },
];
