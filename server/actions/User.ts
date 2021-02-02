export async function getAlteredUsername(username: string): Promise<string> {
    if (!username) throw new Error("Invalid username");
    console.log("testing");
    return username + "123";
}
