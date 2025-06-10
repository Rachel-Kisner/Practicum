import { useContext } from "react";
import { AuthContext } from "../stores/AuthStore";
 
// הוק מותאם המאפשר גישה נוחה לנתוני אימות ולפעולות (לוגין, רישום, ריענון טוקן)
export function useAuth() {
    const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}