export async function getAlteredUsername(username: string): Promise<string> {
  if (!username) throw new Error("Invalid username");

  return username + "123";
}
