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
  name: "",
  role: "",
  company: "",
  business: {
    category: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    description: "",
  },
  personal: {
    city: "",
    phone: "",
    email: "",
    dob: "",
  },
  social: {
    linkedin: "",
    twitter: "",
    instagram: "",
    whatsapp: "",
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
