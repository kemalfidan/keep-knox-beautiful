import { getEvent, addEvent } from "server/actions/Event";
import EventSchema from "server/models/Event";
import { Event } from "utils/types";

jest.mock("server");

describe ("getEvent() tests", () => {
    test("valid event", async () => {
        const mockEvent = {
            name: "test",
        };

        // when findById is called, jest will return mockEvent so we dont actually
        // connect to the db during unit tests
        EventSchema.findById = jest.fn().mockResolvedValue(mockEvent);
        await expect(getEvent("602734007d7de15fae321153")).resolves.toEqual(mockEvent);
    });

    test("invalid parameters", async () => {
        expect.assertions(1);
        await expect(getEvent("")).rejects.toThrowError("Invalid id");
    });

    test("no event with that id", async () => {
        expect.assertions(1);
        // mongoose returns undefined when a query results in no results
        const mockEvent = undefined;

        //mock EventSchema.findById to return mockEvent, which will then throw an error
        EventSchema.findById = jest.fn().mockResolvedValue(mockEvent);
        await expect(getEvent("602734007d7de15fae321152")).rejects.toThrowError("Event does not exist");
    });
});


describe ("addEvent() tests", () => {
    test("valid event", async () => {
        const mockEvent = {
            name: "test",
            description: "test",
            location: "test",
            hours: 2,
            start_time: new Date("2021-05-20T00:32"),
            end_time: new Date("2021-05-20T00:32"),
            start_registration: new Date("2021-05-20T00:32"),
            end_registration: new Date("2021-05-20T00:32"),
        };

        EventSchema.create = jest.fn().mockImplementation(async (event: Event) => event);
                
        await addEvent(mockEvent);
        expect(EventSchema.create).lastCalledWith(mockEvent);
        expect(EventSchema.create).toHaveBeenCalledTimes(1);
    });
});