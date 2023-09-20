export const calculateDob = (originDate:Date, returnDate: Date, dateString: string) => {
  
  let age = null;
  console.log("AgeIntital", returnDate, originDate, dateString);
  if (returnDate) {
    const today = returnDate;
    const birthDate = new Date(dateString?.replace(/-/g, '/'));
    age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
  } 
}else{
    const today = originDate;
    const birthDate = new Date(dateString?.replace(/-/g, '/'));
    age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  }
  console.log("Age", age);
  return age;
};
