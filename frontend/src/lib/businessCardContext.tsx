import { createContext, useContext, useState, ReactNode } from "react";

export interface BusinessCard {
  id: string;
  template: "modern" | "classic";
  name: string;
  role: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  description: string;
  imageUrl: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  whatsapp: string;
}

interface BusinessCardContextType {
  cards: BusinessCard[];
  addCard: (card: BusinessCard) => void;
  updateCard: (card: BusinessCard) => void;
  deleteCard: (id: string) => void;
  getCard: (id: string) => BusinessCard | undefined;
}

const BusinessCardContext = createContext<BusinessCardContextType | undefined>(undefined);

export const BusinessCardProvider = ({ children }: { children: ReactNode }) => {
  const [cards, setCards] = useState<BusinessCard[]>([]);

  const addCard = (card: BusinessCard) => setCards((prev) => [...prev, card]);
  const updateCard = (card: BusinessCard) => setCards((prev) => prev.map((c) => (c.id === card.id ? card : c)));
  const deleteCard = (id: string) => setCards((prev) => prev.filter((c) => c.id !== id));
  const getCard = (id: string) => cards.find((c) => c.id === id);

  return (
    <BusinessCardContext.Provider value={{ cards, addCard, updateCard, deleteCard, getCard }}>
      {children}
    </BusinessCardContext.Provider>
  );
};

export const useBusinessCards = () => {
  const ctx = useContext(BusinessCardContext);
  if (!ctx) throw new Error("useBusinessCards must be used within BusinessCardProvider");
  return ctx;
};
