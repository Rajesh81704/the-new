import { createContext, useContext, useState, ReactNode } from "react";

export interface MyProfile {
  name: string;
  role: string;
  company: string;
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
    linkedin: string;
    twitter: string;
    instagram: string;
    whatsapp: string;
  };
}

const defaultProfile: MyProfile = {
  name: "Alex Johnson",
  role: "Product Designer",
  company: "Freelance",
  business: {
    category: "Design / Product",
    phone: "+1 (555) 123-4567",
    email: "alex@alexjohnson.design",
    website: "https://alexjohnson.design",
    address: "123 Creative Ave, San Francisco, CA 94102",
    description: "Independent product designer specializing in mobile-first experiences for startups. Focused on creating intuitive interfaces that drive user engagement and business growth.",
  },
  personal: {
    city: "San Francisco, CA",
    phone: "+1 (555) 123-4568",
    email: "alex.johnson@gmail.com",
    dob: "May 20, 1992",
  },
  social: {
    linkedin: "https://linkedin.com/in/alexjohnson",
    twitter: "https://twitter.com/alexjdesign",
    instagram: "https://instagram.com/alexjdesign",
    whatsapp: "https://wa.me/15551234568",
  },
};

interface ProfileContextType {
  profile: MyProfile;
  updateProfile: (profile: MyProfile) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<MyProfile>(defaultProfile);
  return (
    <ProfileContext.Provider value={{ profile, updateProfile: setProfile }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useMyProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useMyProfile must be used within ProfileProvider");
  return ctx;
};
