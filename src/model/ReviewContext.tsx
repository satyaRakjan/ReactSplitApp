import React, { createContext, useContext, useState, useEffect } from "react";
import { reviews as reviewData } from "./review"; // Assuming your reviews data is exported from './reviews'

// --- 1. Interface for a single Review object ---
export interface Review {
  id: number;
  phoneId: number; // Foreign key linking to the Phone
  rating: number;
  description: string;
  uid: string; // User ID or identifier
}


export const emptyReview: Review = {
  id: 0,
  phoneId: 0, // Foreign key linking to the Phone
  rating: 0,
  description:"",
  uid: "", // User ID or identifier
};

// --- 2. Interface for the Context's value (State and Setter) ---
interface ReviewContextType {
  reviews: Review[];
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}

// --- 3. Create the Context object ---
const ReviewContext = createContext<ReviewContextType | undefined>(undefined);


// --- 4. Context Provider Component ---
/**
 * Provides the review data state to all child components.
 */
export const ReviewProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [reviews, setReviews] = useState<Review[]>([]);

  // Load initial review data when the component mounts
  useEffect(() => {
    // In a real application, you would fetch this data from an API
    setReviews(reviewData); 
  }, []);

  return (
    <ReviewContext.Provider value={{ reviews, setReviews }}>
      {children}
    </ReviewContext.Provider>
  );
};

// --- 5. Custom Hook to consume the Context ---
/**
 * Custom hook for components to access the reviews state and setter.
 * Throws an error if used outside of a ReviewProvider.
 */
export const useReviews = (): ReviewContextType => {
  const context = useContext(ReviewContext);
  if (!context) {
    throw new Error("useReviews must be used inside a ReviewProvider");
  }
  return context;
};