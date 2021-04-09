import {
    getEvent,
    getCurrentEvents,
    getPastEvents,
    getCurrentEventsAdmin,
    getPastEventsAdmin,
    addEvent,
    deleteEvent,
    updateEvent,
} from "server/actions/Event";
import EventSchema from "server/models/Event";
import { Event, LoadMorePaginatedData } from "utils/types";
import { startOfMonth, endOfMonth } from "date-fns";

jest.mock("server");

// linter complains about any mock object type
/* eslint-disable */

describe("getEvent() tests", () => {
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

describe("get events tests", () => {
    const mockEvents = [{ name: "test1" }, { name: "test2" }, { name: "test1" }, { name: "test2" }, 
    { name: "test1" }, { name: "test2" }, { name: "test1" }, { name: "test2" }, { name: "test1" }];
    const undefinedEvents = undefined;
    const EVENT_FIELDS = { name: 1, caption: 1, location: 1, startDate: 1, endDate: 1, image: 1 };
    const EVENTS_PER_PAGE = 2;
    const PAST_EVENTS_LIMIT = 3;
    const page = 1;

    // mock the current date 
    const now = new Date(Date.UTC(2021, 4, 15));
    Date.now = jest.fn().mockImplementation(() => now);

    describe("getCurrentEvents tests", () => {
        test("getCurrentEvents success", async () => {
            const mockObj: any = {
                EventSchema, // to be tested,
                sort: jest.fn(() => mockEvents),
            };
            EventSchema.find = jest.fn(() => mockObj);
    
            await expect(getCurrentEvents()).resolves.toEqual(mockEvents);
            expect(EventSchema.find).toHaveBeenLastCalledWith({
                startRegistration: {
                    $lte: now,
                },
                endRegistration: {
                    $gt: now,
                },
            },
            EVENT_FIELDS);
            expect(mockObj.sort).toHaveBeenLastCalledWith({ startDate: -1 });
        });
    
        test("getCurrentEvents failure", async () => {
            expect.assertions(3);
            const mockObj: any = {
                EventSchema, // to be tested,
                sort: jest.fn(() => undefinedEvents),
            };
            EventSchema.find = jest.fn(() => mockObj);
    
            await expect(getCurrentEvents()).rejects.toThrowError("No events.");
            expect(EventSchema.find).toHaveBeenLastCalledWith({
                startRegistration: {
                    $lte: now,
                },
                endRegistration: {
                    $gt: now,
                },
            },
            EVENT_FIELDS);
            expect(mockObj.sort).toHaveBeenLastCalledWith({ startDate: -1 });
        });    
    });

    describe("getPastEvents tests", () => {
        test("success", async () => {
            const mockObj: any = {
                EventSchema, // to be tested,
                sort: jest.fn(() => mockObj),
                limit: jest.fn(() => mockEvents),
            };
            EventSchema.find = jest.fn(() => mockObj);
    
            await expect(getPastEvents()).resolves.toEqual(mockEvents);
            expect(EventSchema.find).toHaveBeenLastCalledWith({ endRegistration: { $lt: now } }, EVENT_FIELDS);
            expect(mockObj.sort).toHaveBeenLastCalledWith({ startDate: -1 });    
            expect(mockObj.limit).toHaveBeenLastCalledWith(PAST_EVENTS_LIMIT);    
        });
    
        test("failure", async () => {
            expect.assertions(4);
            const mockObj: any = {
                EventSchema, // to be tested,
                sort: jest.fn(() => mockObj),
                limit: jest.fn(() => undefinedEvents),
            };
            EventSchema.find = jest.fn(() => mockObj);
    
            await expect(getPastEvents()).rejects.toThrowError("No events.");
            expect(EventSchema.find).toHaveBeenLastCalledWith({ endRegistration: { $lt: now } }, EVENT_FIELDS);
            expect(mockObj.sort).toHaveBeenLastCalledWith({ startDate: -1 });    
            expect(mockObj.limit).toHaveBeenLastCalledWith(PAST_EVENTS_LIMIT);    
        });    
    });

    describe("getCurrentEventsAdmin tests", () => {
        test("success", async () => {
            const mockObj: any = {
                EventSchema, // to be tested,
                sort: jest.fn(() => mockEvents),
            };
            EventSchema.find = jest.fn(() => mockObj);
    
            await expect(getCurrentEventsAdmin()).resolves.toEqual(mockEvents);
            expect(EventSchema.find).toHaveBeenLastCalledWith({ endDate: { $gt: now } }, EVENT_FIELDS);
            expect(mockObj.sort).toHaveBeenLastCalledWith({ startDate: -1 });    
        });
    
        test("failure", async () => {
            expect.assertions(3);
            const mockObj: any = {
                EventSchema, // to be tested,
                sort: jest.fn(() => undefinedEvents),
            };
            EventSchema.find = jest.fn(() => mockObj);
    
            await expect(getCurrentEventsAdmin()).rejects.toThrowError("No events.");
            expect(EventSchema.find).toHaveBeenLastCalledWith({ endDate: { $gt: now } }, EVENT_FIELDS);
            expect(mockObj.sort).toHaveBeenLastCalledWith({ startDate: -1 });    
        });    
    });

    describe("getPastEventsAdmin tests", () => {
        test("success", async () => {
            const expectedReturn: LoadMorePaginatedData = {
                data: mockEvents.slice(0, EVENTS_PER_PAGE),
                isLastPage: mockEvents.length < EVENTS_PER_PAGE + 1,
            }
        
            const mockObj: any = {
                EventSchema, // to be tested,
                sort: jest.fn(() => mockObj),
                skip: jest.fn(() => mockObj),
                limit: jest.fn(() => mockEvents),
            };
            EventSchema.find = jest.fn(() => mockObj);
    
            await expect(getPastEventsAdmin(page)).resolves.toEqual(expectedReturn);
            expect(EventSchema.find).toHaveBeenLastCalledWith({ endDate: { $lt: now } }, EVENT_FIELDS);
            expect(mockObj.sort).toHaveBeenLastCalledWith({ startDate: -1 });    
            expect(mockObj.skip).toHaveBeenLastCalledWith((page-1) * EVENTS_PER_PAGE);    
            expect(mockObj.limit).toHaveBeenLastCalledWith(EVENTS_PER_PAGE + 1);    
        });

        test("success with search", async () => {
            const searchDate = new Date(Date.UTC(2020, 2, 20));
            const expectedStartSearchDate = startOfMonth(searchDate);
            const expectedEndSearchDate = endOfMonth(searchDate);
            const expectedReturn: LoadMorePaginatedData = {
                data: mockEvents.slice(0, EVENTS_PER_PAGE),
                isLastPage: mockEvents.length < EVENTS_PER_PAGE + 1,
            }
        
            const mockObj: any = {
                EventSchema, // to be tested,
                sort: jest.fn(() => mockObj),
                skip: jest.fn(() => mockObj),
                limit: jest.fn(() => mockEvents),
            };
            EventSchema.find = jest.fn(() => mockObj);
    
            await expect(getPastEventsAdmin(page, searchDate)).resolves.toEqual(expectedReturn);
            expect(EventSchema.find).toHaveBeenLastCalledWith({
                endDate: { $lt: now },
                startDate: { $gte: expectedStartSearchDate, $lte: expectedEndSearchDate },
            }, EVENT_FIELDS);
            expect(mockObj.sort).toHaveBeenLastCalledWith({ startDate: -1 });    
            expect(mockObj.skip).toHaveBeenLastCalledWith((page-1) * EVENTS_PER_PAGE);    
            expect(mockObj.limit).toHaveBeenLastCalledWith(EVENTS_PER_PAGE + 1);    
        });

        test("failure", async () => {
            expect.assertions(5);
            const mockObj: any = {
                EventSchema, // to be tested,
                sort: jest.fn(() => mockObj),
                skip: jest.fn(() => mockObj),
                limit: jest.fn(() => undefinedEvents),
            };
            EventSchema.find = jest.fn(() => mockObj);
    
            await expect(getPastEventsAdmin(page)).rejects.toThrowError("Error fetching events.");
            expect(EventSchema.find).toHaveBeenLastCalledWith({ endDate: { $lt: now } }, EVENT_FIELDS);
            expect(mockObj.sort).toHaveBeenLastCalledWith({ startDate: -1 });    
            expect(mockObj.skip).toHaveBeenLastCalledWith((page-1) * EVENTS_PER_PAGE);    
            expect(mockObj.limit).toHaveBeenLastCalledWith(EVENTS_PER_PAGE + 1);    
        });

        test("failure with search", async () => {
            expect.assertions(5);
            const searchDate = new Date(Date.UTC(2020, 2, 20));
            const expectedStartSearchDate = startOfMonth(searchDate);
            const expectedEndSearchDate = endOfMonth(searchDate);
            const expectedReturn: LoadMorePaginatedData = {
                data: mockEvents.slice(0, EVENTS_PER_PAGE),
                isLastPage: mockEvents.length < EVENTS_PER_PAGE + 1,
            }
        
            const mockObj: any = {
                EventSchema, // to be tested,
                sort: jest.fn(() => mockObj),
                skip: jest.fn(() => mockObj),
                limit: jest.fn(() => undefinedEvents),
            };
            EventSchema.find = jest.fn(() => mockObj);
    
            await expect(getPastEventsAdmin(page, searchDate)).rejects.toThrowError("Error fetching events.");
            expect(EventSchema.find).toHaveBeenLastCalledWith({
                endDate: { $lt: now },
                startDate: { $gte: expectedStartSearchDate, $lte: expectedEndSearchDate },
            }, EVENT_FIELDS);
            expect(mockObj.sort).toHaveBeenLastCalledWith({ startDate: -1 });    
            expect(mockObj.skip).toHaveBeenLastCalledWith((page-1) * EVENTS_PER_PAGE);    
            expect(mockObj.limit).toHaveBeenLastCalledWith(EVENTS_PER_PAGE + 1);    
        });
        
        test("invalid page", async () => {
            expect.assertions(1);
        
            EventSchema.find = jest.fn().mockResolvedValue(undefinedEvents);
            await expect(getPastEventsAdmin(0)).rejects.toThrowError("Invalid page number.");
        });    
    });
});

describe("addEvent() tests", () => {
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

        /* eslint @typescript-eslint/unbound-method: "off" */
        await addEvent(mockEvent);
        expect(EventSchema.create).lastCalledWith(mockEvent);
        expect(EventSchema.create).toHaveBeenCalledTimes(1);
    });
});

describe("deleteEvent() tests", () => {
    test("invalid parameters", async () => {
        expect.assertions(1);
        await expect(deleteEvent("")).rejects.toThrowError("Invalid id");
    });

    test("event deleted", async () => {
        const mockEvent = {
            name: "test",
        };

        EventSchema.findByIdAndDelete = jest.fn().mockImplementation(async (event: Event) => event);
        await deleteEvent("testid123");
        expect(EventSchema.findByIdAndDelete).lastCalledWith("testid123");
        expect(EventSchema.findByIdAndDelete).toHaveBeenCalledTimes(1);
    });
});

describe("updateEvent() tests", () => {
    test("invalid parameters", async () => {
        expect.assertions(1);
        await expect(updateEvent("", { name: "event name" })).rejects.toThrowError(
            "Invalid past event or invalid event."
        );
    });

    test("existing event not found", async () => {
        const mockEvent = {
            name: "event name",
        };
        const mockId = "602734007d7de15fae123456";
        expect.assertions(1);
        EventSchema.findByIdAndUpdate = jest.fn().mockImplementation(async (event: Event) => undefined);

        await expect(updateEvent(mockId, mockEvent)).rejects.toThrowError("Event not found.");
    });

    test("event successfully updated", async () => {
        const mockEvent = {
            name: "event name",
        };
        const mockId = "602734007d7de15fae123456";

        EventSchema.findByIdAndUpdate = jest.fn().mockImplementation(async (event: Event) => event);
        await updateEvent(mockId, mockEvent);
        expect(EventSchema.findByIdAndUpdate).lastCalledWith(mockId, mockEvent);
        expect(EventSchema.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
});
