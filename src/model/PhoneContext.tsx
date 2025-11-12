import React, { createContext, useContext, useState, useEffect } from "react";
import { phones as phoneData } from "./phone";

export interface Phone {
  id: number;
  phoneName: string;
  brand: string;
  price: number;
  launchPrice: number;
  storage: string;
  ram: string;
  battery: string;
  camera: string;
  screenSize: number;
  os: string;
  releaseYear: number;
  rating: number;
  inStock: boolean;
  description: string;
}



interface PhoneContextType {
  phones: Phone[];
  setPhones: React.Dispatch<React.SetStateAction<Phone[]>>;
}

const PhoneContext = createContext<PhoneContextType | undefined>(undefined);


export const emptyPhone: Phone = {
  id: 0,
  phoneName: '',
  brand: '',
  price: 0,
  launchPrice: 0,
  storage: '',
  ram: '',
  battery: '',
  camera: '',
  screenSize: 0,
  os: '',
  releaseYear: 0,
  rating: 0,
  inStock: false,
  description: '',
};

export const PhoneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [phones, setPhones] = useState<Phone[]>([]);

  useEffect(() => {
    setPhones(phoneData);
  }, []);

  return (
    <PhoneContext.Provider value={{ phones, setPhones }}>
      {children}
    </PhoneContext.Provider>
  );
};

export const usePhones = (): PhoneContextType => {
  const context = useContext(PhoneContext);
  if (!context) {
    throw new Error("usePhones must be used inside PhoneProvider");
  }
  return context;
};
