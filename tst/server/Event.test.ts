import { getEvent } from "server/actions/Event";
import { Event } from "utils/types";

test("valid event", () => {
    var mockEvent = {
        name: "test"
    }

    //mock EventSchema.findById to return mockEvent 
    return expect(getEvent("602734007d7de15fae321153")).resolves.toBe(mockEvent);
});

test("invalid parameters", () => {
    expect.assertions(1);
    return expect(getEvent("")).rejects.toThrowError("Invalid id");
});

test("no event with that id", () => {
    expect.assertions(1);
    // mongoose returns undefined when a query results in no results
    var mockEvent = undefined;

    //mock EventSchema.findById to return mockEvent, which will then throw an error
    return expect(getEvent("602734007d7de15fae321152")).rejects.toThrowError("Event does not exist");
});
