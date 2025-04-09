
const users  = [
  {
    id: "1",
    name: "J Smith",
    email: "ndminhnhat1234@gmail.com",
    password: "123",
  },
  {
    id: "2",
    name: "J Smith 2",
    email: "ndminhnhat1234.com",
    password: "123",
  }
]
export const getUserByEmail = async (email: string) => {
  try {
    const user = await users.find((u) => u.email === email && u.password === "123");
    if (!user) return null;
    return user;
  } catch {
    return null;
  }
};
