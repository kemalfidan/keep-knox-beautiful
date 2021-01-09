  import { getAlteredUsername } from 'server/actions/User';

  test('valid username', () => {
    return expect(getAlteredUsername("Kemal Fidan")).resolves.toBe("Kemal Fidan123");
  });

  test('invalid username', () => {
    expect.assertions(1);
    return expect(getAlteredUsername("")).rejects.toThrowError("Invalid username");
  });
