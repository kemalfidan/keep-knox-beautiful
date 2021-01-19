export async function getAlteredUsername(username: string): Promise<string> {
  if (!username) throw new Error("Invalid username");
  console.log("Adding random logic for PR");
  return username + "123";
}
