
export async function getAlteredUsername(username: String): Promise<String> {
    if (!username) throw new Error("Invalid username");

    return username + "123";
}