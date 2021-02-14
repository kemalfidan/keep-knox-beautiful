import { getEvent } from "server/actions/Event";
import EventSchema from "server/models/Event";

jest.mock('server');

test("valid event", () => {
    const mockEvent = {
        name: "test",
    };

    // when findById is called, jest will return mockEvent so we dont actually
    // connect to the db during unit tests
    EventSchema.findById = jest.fn().mockResolvedValue(mockEvent);
    return expect(getEvent("602734007d7de15fae321153")).resolves.toEqual(mockEvent);
});

test("invalid parameters", () => {
    expect.assertions(1);
    return expect(getEvent("")).rejects.toThrowError("Invalid id");
});

test("no event with that id", () => {
    expect.assertions(1);
    // mongoose returns undefined when a query results in no results
    const mockEvent = undefined;

    //mock EventSchema.findById to return mockEvent, which will then throw an error
    EventSchema.findById = jest.fn().mockResolvedValue(mockEvent);
    return expect(getEvent("602734007d7de15fae321152")).rejects.toThrowError("Event does not exist");
});
