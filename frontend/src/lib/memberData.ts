export interface MemberProfile {
  initials: string;
  name: string;
  role: string;
  company?: string;
  isFriend: boolean;
  business: {
    category: string;
    phone: string;
    email: string;
    website: string;
    address: string;
    description: string;
  };
  personal: {
    city: string;
    phone: string;
    email: string;
    dob: string;
  };
  social: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

export const memberProfiles: Record<string, MemberProfile> = {
  SL: {
    initials: "SL",
    name: "Sarah Lawson",
    role: "CEO",
    company: "Nexora Labs",
    isFriend: true,
    business: {
      category: "Technology / AI",
      phone: "+1 (415) 555-0101",
      email: "sarah@nexoralabs.com",
      website: "https://nexoralabs.com",
      address: "350 Mission St, San Francisco, CA 94105",
      description: "Nexora Labs builds AI-powered workflow automation tools for enterprise teams. Founded in 2023, we help companies reduce operational overhead by 40%.",
    },
    personal: {
      city: "San Francisco, CA",
      phone: "+1 (415) 555-0102",
      email: "sarah.lawson@gmail.com",
      dob: "March 14, 1990",
    },
    social: {
      linkedin: "https://linkedin.com/in/sarahlawson",
      twitter: "https://twitter.com/sarahlawson",
      instagram: "https://instagram.com/sarahlawson",
      whatsapp: "https://wa.me/14155550102",
    },
  },
  MK: {
    initials: "MK",
    name: "Michael Kerr",
    role: "Marketing Director",
    company: "GrowthCo",
    isFriend: true,
    business: {
      category: "Marketing / SaaS",
      phone: "+1 (212) 555-0201",
      email: "michael@growthco.io",
      website: "https://growthco.io",
      address: "88 7th Ave, New York, NY 10011",
      description: "GrowthCo is a performance marketing agency specializing in B2B SaaS growth strategies, from brand positioning to demand generation.",
    },
    personal: {
      city: "New York, NY",
      phone: "+1 (212) 555-0202",
      email: "m.kerr@outlook.com",
      dob: "July 22, 1988",
    },
    social: {
      linkedin: "https://linkedin.com/in/michaelkerr",
      twitter: "https://twitter.com/mkerr",
      whatsapp: "https://wa.me/12125550202",
    },
  },
  JP: {
    initials: "JP",
    name: "Jessica Park",
    role: "UX Designer",
    company: "Craft Studio",
    isFriend: true,
    business: {
      category: "Design / UX",
      phone: "+1 (310) 555-0301",
      email: "jessica@craftstudio.design",
      website: "https://craftstudio.design",
      address: "1200 Abbot Kinney Blvd, Venice, CA 90291",
      description: "Craft Studio is a boutique design agency creating human-centered digital experiences for startups and enterprise clients.",
    },
    personal: {
      city: "Los Angeles, CA",
      phone: "+1 (310) 555-0302",
      email: "jessicapark@gmail.com",
      dob: "November 5, 1992",
    },
    social: {
      linkedin: "https://linkedin.com/in/jessicapark",
      instagram: "https://instagram.com/jessicaparkux",
      whatsapp: "https://wa.me/13105550302",
    },
  },
  RD: {
    initials: "RD",
    name: "Ryan Davis",
    role: "Venture Partner",
    company: "Horizon Ventures",
    isFriend: false,
    business: {
      category: "Finance / Venture Capital",
      phone: "+1 (650) 555-0401",
      email: "ryan@horizonvc.com",
      website: "https://horizonvc.com",
      address: "2500 Sand Hill Rd, Menlo Park, CA 94025",
      description: "Horizon Ventures is an early-stage VC firm backing bold founders in fintech, healthtech, and climate tech with $200M under management.",
    },
    personal: {
      city: "Menlo Park, CA",
      phone: "+1 (650) 555-0402",
      email: "ryandavis@gmail.com",
      dob: "January 18, 1985",
    },
    social: {
      linkedin: "https://linkedin.com/in/ryandavis",
      twitter: "https://twitter.com/ryandavisvc",
    },
  },
  AK: {
    initials: "AK",
    name: "Amara Kim",
    role: "Product Manager",
    company: "BuildFlow",
    isFriend: true,
    business: {
      category: "Technology / Product",
      phone: "+1 (206) 555-0501",
      email: "amara@buildflow.io",
      website: "https://buildflow.io",
      address: "400 Westlake Ave N, Seattle, WA 98109",
      description: "BuildFlow provides no-code project management tools designed for cross-functional teams to ship products faster.",
    },
    personal: {
      city: "Seattle, WA",
      phone: "+1 (206) 555-0502",
      email: "amara.kim@gmail.com",
      dob: "September 30, 1991",
    },
    social: {
      linkedin: "https://linkedin.com/in/amarakim",
      twitter: "https://twitter.com/amarakim",
      whatsapp: "https://wa.me/12065550502",
    },
  },
  TC: {
    initials: "TC",
    name: "Tom Chen",
    role: "Software Engineer",
    company: "CodeStack",
    isFriend: true,
    business: {
      category: "Technology / Engineering",
      phone: "+1 (512) 555-0601",
      email: "tom@codestack.dev",
      website: "https://codestack.dev",
      address: "1100 Congress Ave, Austin, TX 78701",
      description: "CodeStack builds developer tools and open-source frameworks that simplify full-stack application development.",
    },
    personal: {
      city: "Austin, TX",
      phone: "+1 (512) 555-0602",
      email: "tomchen@proton.me",
      dob: "April 12, 1993",
    },
    social: {
      linkedin: "https://linkedin.com/in/tomchen",
      twitter: "https://twitter.com/tomchendev",
      whatsapp: "https://wa.me/15125550602",
    },
  },
  LR: {
    initials: "LR",
    name: "Laura Reyes",
    role: "Business Development",
    company: "ScaleUp",
    isFriend: true,
    business: {
      category: "Business / Consulting",
      phone: "+1 (305) 555-0701",
      email: "laura@scaleup.co",
      website: "https://scaleup.co",
      address: "200 S Biscayne Blvd, Miami, FL 33131",
      description: "ScaleUp is a business consulting firm helping startups expand into Latin American markets with go-to-market strategy and partnerships.",
    },
    personal: {
      city: "Miami, FL",
      phone: "+1 (305) 555-0702",
      email: "laura.reyes@yahoo.com",
      dob: "June 8, 1989",
    },
    social: {
      linkedin: "https://linkedin.com/in/laurareyes",
      instagram: "https://instagram.com/laurareyes",
      whatsapp: "https://wa.me/13055550702",
    },
  },
  EM: {
    initials: "EM",
    name: "Elena Moretti",
    role: "Startup Advisor",
    company: "Founders Network",
    isFriend: false,
    business: {
      category: "Consulting / Startups",
      phone: "+1 (415) 555-0801",
      email: "elena@foundersnetwork.com",
      website: "https://foundersnetwork.com",
      address: "500 Howard St, San Francisco, CA 94105",
      description: "Founders Network is a curated community of 5,000+ tech founders sharing resources, mentorship, and deal flow.",
    },
    personal: {
      city: "San Francisco, CA",
      phone: "+1 (415) 555-0802",
      email: "elena.moretti@gmail.com",
      dob: "December 3, 1987",
    },
    social: {
      linkedin: "https://linkedin.com/in/elenamoretti",
      twitter: "https://twitter.com/elenamoretti",
    },
  },
  DW: {
    initials: "DW",
    name: "David Wong",
    role: "Data Scientist",
    company: "InsightAI",
    isFriend: false,
    business: {
      category: "Technology / Data Science",
      phone: "+1 (408) 555-0901",
      email: "david@insightai.com",
      website: "https://insightai.com",
      address: "1600 Technology Dr, San Jose, CA 95110",
      description: "InsightAI provides predictive analytics and machine learning solutions for e-commerce and retail businesses.",
    },
    personal: {
      city: "San Jose, CA",
      phone: "+1 (408) 555-0902",
      email: "david.wong@gmail.com",
      dob: "August 25, 1990",
    },
    social: {
      linkedin: "https://linkedin.com/in/davidwong",
      twitter: "https://twitter.com/davidwongai",
      whatsapp: "https://wa.me/14085550902",
    },
  },
};
