import { getAlteredUsername, addVolunteer } from "server/actions/Volunteer";
import VolunteerSchema from "server/models/Volunteer";
import { Event, Volunteer } from "utils/types";

jest.mock("server");

// Begin getAlteredUsername test cases
test("valid username", () => {
    return expect(getAlteredUsername("Kemal Fidan")).resolves.toBe("Kemal Fidan123");
});

test("invalid username", () => {
    expect.assertions(1);
    return expect(getAlteredUsername("")).rejects.toThrowError("Invalid username");
});

// Begin addUser test cases
describe("addUser() tests", () => {
    test("valid volunteer", async () => {
        const mockVol: Volunteer = {
            email: "test",
            name: "test",
            phone: "123-123-1234",
            filledForm: false,
            // attendedEvents and signedUpEvents default to empty arrays in mongoose
        };

        VolunteerSchema.create = jest.fn().mockImplementation(async (vol: Volunteer) => vol);

        /* eslint @typescript-eslint/unbound-method: "off" */
        await addVolunteer(mockVol);
        expect(VolunteerSchema.create).lastCalledWith(mockVol);
        expect(VolunteerSchema.create).toHaveBeenCalledTimes(1);
    });
});

// Begin getUser test cases
