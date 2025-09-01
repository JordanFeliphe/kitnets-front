export interface Payment {
  id: string;
  residentName: string;
  amount: string;
  paymentDate: string;
  paymentMethod: "Cash" | "Card" | "Bank Transfer";  
  status: "Paid" | "Pending";
  reference?: string;
}
