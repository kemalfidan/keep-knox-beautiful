import {
    addVolunteer,
    getVolunteer,
    getVolunteers,
    markVolunteerNotPresent,
    markVolunteerPresent,
    registerVolunteerToEvent,
    updateVolunteer,
    getVolunteerEvents,
    sudoRegisterVolunteerToEvent,
} from "server/actions/Volunteer";
import VolunteerSchema from "server/models/Volunteer";
import EventSchema from "server/models/Event";
import { Volunteer, Event } from "utils/types";
import { addDays } from "date-fns";

jest.mock("server");

// linter complains about any mock object type
/* eslint-disable */

describe("getVolunteer() tests", () => {
    test("valid volunteer", async () => {
        const mockVol = {
            email: "test",
            name: "test",
            phone: "123-123-1234",
        };

        VolunteerSchema.findById = jest.fn().mockResolvedValue(mockVol);
        await expect(getVolunteer("602734007d7de15fae321153")).resolves.toEqual(mockVol);
    });

    test("invalid parameters", async () => {
        expect.assertions(1);
        await expect(getVolunteer("")).rejects.toThrowError("Invalid id");
    });

    test("no event with that id", async () => {
        expect.assertions(1);
        const mockVol = undefined;

        VolunteerSchema.findById = jest.fn().mockReturnValue(mockVol);
        await expect(getVolunteer("602734007d7de15fae321152")).rejects.toThrowError("Volunteer does not exist");
    });
});

describe("getVolunteers() tests", () => {
    test("valid volunteer", async () => {
        const testVol = {
            email: "test1@test.com",
            name: "test1",
            phone: "123-123-1234",
        };
        const mockVols = Array(20).fill(testVol, 0, 20);
        const VOLS_PER_PAGE = 10;
        const search = "test search";
        const page = 1;

        const expectedFilter = { name: { $regex: `.*${search}.*`, $options: "i" } };
        const expectedProjection = { name: 1, email: 1, _id: 1 };

        // the return value of each chained call is this VolsMock object.
        // then the next call in the chain will call these functions again
        const VolsMock: any = {
            getVolunteers, // to be tested
            sort: jest.fn(() => VolsMock),
            skip: jest.fn(() => VolsMock),
            limit: jest.fn(() => []),
        };
        VolunteerSchema.find = jest.fn(() => VolsMock);
        VolsMock.limit.mockImplementation(() => mockVols); // mock final return val

        await VolsMock.getVolunteers(page, search);
        expect(VolunteerSchema.find).toHaveBeenLastCalledWith(expectedFilter, expectedProjection);
        expect(VolsMock.skip).toHaveBeenLastCalledWith((page-1) * VOLS_PER_PAGE);
        expect(VolsMock.limit).toHaveBeenLastCalledWith(VOLS_PER_PAGE+1);
    });

    test("negative page number", async () => {
        expect.assertions(1);
        await expect(getVolunteers(-1, "search string")).rejects.toThrowError("Invalid page number.");
    });

    test("page is not a number", async () => {
        expect.assertions(1);
        await expect(getVolunteers(NaN)).rejects.toThrowError("Invalid page number.");
    });
});

// Begin addVolunteer test cases
describe("addVolunteer() tests", () => {
    test("valid volunteer", async () => {
        const mockVol: Volunteer = {
            email: "test",
            name: "test",
            phone: "123-123-1234",
            // filledForm: false,
            // attendedEvents and signedUpEvents default to empty arrays in mongoose
        };

        VolunteerSchema.create = jest.fn().mockImplementation(async (vol: Volunteer) => vol);

        /* eslint @typescript-eslint/unbound-method: "off" */
        await addVolunteer(mockVol);
        expect(VolunteerSchema.create).lastCalledWith(mockVol);
        expect(VolunteerSchema.create).toHaveBeenCalledTimes(1);
    });
});

// Begin updateVolunteer test cases
describe("updateVolunteer() tests", () => {
    test("invalid parameters", async () => {
        expect.assertions(1);
        await expect(updateVolunteer("", { name: "volunteer name" })).rejects.toThrowError(
            "Invalid previous volunteer or invalid new volunteer."
        );
    });

    test("existing volunteer not found", async () => {
        const mockVol = {
            name: "volunteer name",
        };
        const mockId = "6061e27251c1c60dffeac829";
        expect.assertions(1);
        VolunteerSchema.findByIdAndUpdate = jest.fn().mockImplementation(async (vol: Volunteer) => undefined);
        await expect(updateVolunteer(mockId, mockVol)).rejects.toThrowError("Volunteer not found.");
    });

    test("volunteer successfully updated", async () => {
        const mockVol = {
            name: "volunteer name",
        };
        const mockId = "6061e27251c1c60dffeac829";
        VolunteerSchema.findByIdAndUpdate = jest.fn().mockImplementation(async (vol: Volunteer) => vol);
        await updateVolunteer(mockId, mockVol);
        expect(VolunteerSchema.findByIdAndUpdate).lastCalledWith(mockId, mockVol);
        expect(VolunteerSchema.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });
});

describe("registerVolunteerToEvent() tests", () => {
    const now = Date.now();
    const newVolunteer: Volunteer = {
        name: "John Smith",
        email: "jsmith@gmail.com",
        phone: "(931) 931-9319",
    };
    const mockEvent: Event = {
        _id: "604d6730ca1c1d7fcd4fbdc9",
        name: "February Spruce Up",
        description: "We are sprucing in February. Come spruce with us :)",
        caption: "It's spruce season",
        maxVolunteers: 10,
        volunteerCount: 4,
        location: "1234 Neyland Dr\nKnoxville, TN 37916",
        startDate: new Date(now),
        endDate: new Date(addDays(now, 2)),
        startRegistration: new Date(now),
        endRegistration: new Date(addDays(now, 1)),
        hours: 3,
        image: {
            assetID: "aASDuiHWIDUOHWEff",
            url: "https://i.imgur.com/MrGY5EL.jpeg",
        },
        registeredVolunteers: ["604d6730ca1c1d7fcd4fbdd2", "604d6730ca1c1d7fcd4fbdd3"],
        attendedVolunteers: ["604d6730ca1c1d7fcd4fbdd4", "604d6730ca1c1d7fcd4fbdd5"],
    };
    const mockVolunteer: Volunteer = {
        _id: "604d6730ca1c1d7fcd4fbde0",
        name: "John Smith",
        email: "jsmith@gmail.com",
        phone: "(931) 931-9319",
        totalEvents: 2,
        totalHours: 5,
        registeredEvents: ["604d6730ca1c1d7fcd4fbdc2"],
        attendedEvents: ["604d6730ca1c1d7fcd4fbdc3", "604d6730ca1c1d7fcd4fbdc4"],
    };

    test("successful sign up", async () => {
        const eventId = "604d6730ca1c1d7fcd4fbdc9";
        const options = { new: true, upsert: true };

        // insert vol into this event and update vol's fields
        const updatedEvent: Event = {
            _id: "604d6730ca1c1d7fcd4fbdc9",
            name: "February Spruce Up",
            description: "We are sprucing in February. Come spruce with us :)",
            caption: "It's spruce season",
            maxVolunteers: 10,
            volunteerCount: 5,
            location: "1234 Neyland Dr\nKnoxville, TN 37916",
            startDate: new Date(now),
            endDate: new Date(addDays(now, 2)),
            startRegistration: new Date(now),
            endRegistration: new Date(addDays(now, 1)),
                hours: 3,
            image: {
                assetID: "aASDuiHWIDUOHWEff",
                url: "https://i.imgur.com/MrGY5EL.jpeg",
            },
            registeredVolunteers: ["604d6730ca1c1d7fcd4fbdd2", "604d6730ca1c1d7fcd4fbdd3", "604d6730ca1c1d7fcd4fbde0"],
            attendedVolunteers: ["604d6730ca1c1d7fcd4fbdd4", "604d6730ca1c1d7fcd4fbdd5"],
        };
        const updatedVolunteer: Volunteer = {
            _id: "604d6730ca1c1d7fcd4fbde0",
            name: "John Smith",
            email: "jsmith@gmail.com",
            phone: "(931) 931-9319",
            totalEvents: 2,
            totalHours: 5,
            registeredEvents: ["604d6730ca1c1d7fcd4fbdc2", "604d6730ca1c1d7fcd4fbdc9"],
            attendedEvents: ["604d6730ca1c1d7fcd4fbdc3", "604d6730ca1c1d7fcd4fbdc4"],
        };

        EventSchema.findById = jest.fn().mockResolvedValue(mockEvent);
        VolunteerSchema.findOneAndUpdate = jest.fn().mockResolvedValue(mockVolunteer);
        // the return vals here don't matter, just doing so updateOne's dont get called
        EventSchema.updateOne = jest.fn().mockResolvedValue(mockVolunteer);
        VolunteerSchema.updateOne = jest.fn().mockResolvedValue(mockVolunteer);

        await sudoRegisterVolunteerToEvent(newVolunteer, eventId);
        expect(EventSchema.findById).lastCalledWith(eventId);
        expect(EventSchema.findById).toHaveBeenCalledTimes(1);
        expect(VolunteerSchema.findOneAndUpdate).lastCalledWith({ email: newVolunteer.email }, newVolunteer, options);
        expect(VolunteerSchema.findOneAndUpdate).toHaveBeenCalledTimes(1);
        expect(EventSchema.updateOne).lastCalledWith({ _id: eventId }, updatedEvent);
        expect(EventSchema.updateOne).toHaveBeenCalledTimes(1);
        expect(VolunteerSchema.updateOne).lastCalledWith({ email: newVolunteer.email }, updatedVolunteer);
        expect(VolunteerSchema.updateOne).toHaveBeenCalledTimes(1);
    });

    test("event doesnt exist", async () => {
        expect.assertions(3);
        const mockEvent = undefined;
        const eventId = "604d6730ca1c1d7fcd4fbdc4";

        EventSchema.findById = jest.fn().mockResolvedValue(mockEvent);
        await expect(sudoRegisterVolunteerToEvent(newVolunteer, eventId)).rejects.toThrowError("Event does not exist.");
        expect(EventSchema.findById).lastCalledWith(eventId);
        expect(EventSchema.findById).toHaveBeenCalledTimes(1);
    });

    test("user already registered", async () => {
        expect.assertions(5);
        const eventId = "604d6730ca1c1d7fcd4fbdc4";
        const options = { new: true, upsert: true };
        const mockEvent: Event = {
            _id: "604d6730ca1c1d7fcd4fbdc4",
            name: "February Spruce Up",
            description: "We are sprucing in February. Come spruce with us :)",
            caption: "It's spruce season",
            maxVolunteers: 10,
            volunteerCount: 4,
            location: "1234 Neyland Dr\nKnoxville, TN 37916",
            startDate: new Date(now),
            endDate: new Date(addDays(now, 2)),
            startRegistration: new Date(now),
            endRegistration: new Date(addDays(now, 1)),
                hours: 3,
            image: {
                assetID: "aASDuiHWIDUOHWEff",
                url: "https://i.imgur.com/MrGY5EL.jpeg",
            },
            registeredVolunteers: ["604d6730ca1c1d7fcd4fbdd2", "604d6730ca1c1d7fcd4fbde0"],
            attendedVolunteers: ["604d6730ca1c1d7fcd4fbdd4", "604d6730ca1c1d7fcd4fbdd5"],
        };

        // this volunteer is already in the registeredVolunteers array above
        const mockVolunteer: Volunteer = {
            _id: "604d6730ca1c1d7fcd4fbde0",
            name: "John Smith",
            email: "jsmith@gmail.com",
            phone: "(931) 931-9319",
            totalEvents: 2,
            totalHours: 5,
            registeredEvents: ["604d6730ca1c1d7fcd4fbdc2"],
            attendedEvents: ["604d6730ca1c1d7fcd4fbdc3", "604d6730ca1c1d7fcd4fbdc4"],
        };

        EventSchema.findById = jest.fn().mockResolvedValue(mockEvent);
        VolunteerSchema.findOneAndUpdate = jest.fn().mockResolvedValue(mockVolunteer);
        await expect(registerVolunteerToEvent(newVolunteer, eventId)).rejects.toThrowError(
            "You have already been registered to this event."
        );
        expect(EventSchema.findById).lastCalledWith(eventId);
        expect(EventSchema.findById).toHaveBeenCalledTimes(1);
        expect(VolunteerSchema.findOneAndUpdate).lastCalledWith({ email: newVolunteer.email }, newVolunteer, options);
        expect(VolunteerSchema.findOneAndUpdate).toHaveBeenCalledTimes(1);
    });

    test("event already at capacity", async () => {
        expect.assertions(4);
        const eventId = "604d6730ca1c1d7fcd4fbdc4";
        // this event is already at capacity
        const mockEvent: Event = {
            _id: "604d6730ca1c1d7fcd4fbdc4",
            name: "February Spruce Up",
            description: "We are sprucing in February. Come spruce with us :)",
            caption: "It's spruce season",
            maxVolunteers: 4,
            volunteerCount: 4,
            location: "1234 Neyland Dr\nKnoxville, TN 37916",
            startDate: new Date(now),
            endDate: new Date(addDays(now, 2)),
            startRegistration: new Date(now),
            endRegistration: new Date(addDays(now, 1)),
                hours: 3,
            image: {
                assetID: "aASDuiHWIDUOHWEff",
                url: "https://i.imgur.com/MrGY5EL.jpeg",
            },
            registeredVolunteers: ["604d6730ca1c1d7fcd4fbdd2", "604d6730ca1c1d7fcd4fbde0"],
            attendedVolunteers: ["604d6730ca1c1d7fcd4fbdd4", "604d6730ca1c1d7fcd4fbdd5"],
        };
        const mockVolunteer: Volunteer = {
            _id: "604d6730ca1c1d7fcd4fbde0",
            name: "John Smith",
            email: "jsmith@gmail.com",
            phone: "(931) 931-9319",
            totalEvents: 2,
            totalHours: 5,
            registeredEvents: ["604d6730ca1c1d7fcd4fbdc2"],
            attendedEvents: ["604d6730ca1c1d7fcd4fbdc3", "604d6730ca1c1d7fcd4fbdc4"],
        };

        EventSchema.findById = jest.fn().mockResolvedValue(mockEvent);
        VolunteerSchema.findOneAndUpdate = jest.fn().mockResolvedValue(mockVolunteer);
        await expect(registerVolunteerToEvent(newVolunteer, eventId)).rejects.toThrowError(
            "Event is at max volunteers."
        );
        expect(EventSchema.findById).lastCalledWith(eventId);
        expect(EventSchema.findById).toHaveBeenCalledTimes(1);
        expect(VolunteerSchema.findOneAndUpdate).toHaveBeenCalledTimes(0);
    });
});

describe("sudoRegisterVolunteerToEvent() tests", () => {
    const now = Date.now();
    const newVolunteer: Volunteer = {
        name: "John Smith",
        email: "jsmith@gmail.com",
        phone: "(931) 931-9319",
    };

    test("successful registration", async () => {
        const eventId = "604d6730ca1c1d7fcd4fbdc9";
        const mockEvent: Event = {
            _id: "604d6730ca1c1d7fcd4fbdc9",
            name: "February Spruce Up",
            description: "We are sprucing in February. Come spruce with us :)",
            caption: "It's spruce season",
            maxVolunteers: 10,
            volunteerCount: 4,
            location: "1234 Neyland Dr\nKnoxville, TN 37916",
            startDate: new Date(now),
            endDate: new Date(addDays(now, 2)),
            startRegistration: new Date(now),
            endRegistration: new Date(addDays(now, 1)),
            hours: 3,
            image: {
                assetID: "aASDuiHWIDUOHWEff",
                url: "https://i.imgur.com/MrGY5EL.jpeg",
            },
            registeredVolunteers: ["604d6730ca1c1d7fcd4fbdd2", "604d6730ca1c1d7fcd4fbdd3"],
            attendedVolunteers: ["604d6730ca1c1d7fcd4fbdd4", "604d6730ca1c1d7fcd4fbdd5"],
        };
        const mockVolunteer: Volunteer = {
            _id: "604d6730ca1c1d7fcd4fbde0",
            name: "John Smith",
            email: "jsmith@gmail.com",
            phone: "(931) 931-9319",
            totalEvents: 2,
            totalHours: 5,
            registeredEvents: ["604d6730ca1c1d7fcd4fbdc2"],
            attendedEvents: ["604d6730ca1c1d7fcd4fbdc3", "604d6730ca1c1d7fcd4fbdc4"],
        };
        const options = { new: true, upsert: true };

        // insert vol into this event and update vol's fields
        const updatedEvent: Event = {
            _id: "604d6730ca1c1d7fcd4fbdc9",
            name: "February Spruce Up",
            description: "We are sprucing in February. Come spruce with us :)",
            caption: "It's spruce season",
            maxVolunteers: 10,
            volunteerCount: 5,
            location: "1234 Neyland Dr\nKnoxville, TN 37916",
            startDate: new Date(now),
            endDate: new Date(addDays(now, 2)),
            startRegistration: new Date(now),
            endRegistration: new Date(addDays(now, 1)),
            hours: 3,
            image: {
                assetID: "aASDuiHWIDUOHWEff",
                url: "https://i.imgur.com/MrGY5EL.jpeg",
            },
            registeredVolunteers: ["604d6730ca1c1d7fcd4fbdd2", "604d6730ca1c1d7fcd4fbdd3", "604d6730ca1c1d7fcd4fbde0"],
            attendedVolunteers: ["604d6730ca1c1d7fcd4fbdd4", "604d6730ca1c1d7fcd4fbdd5"],
        };
        const updatedVolunteer: Volunteer = {
            _id: "604d6730ca1c1d7fcd4fbde0",
            name: "John Smith",
            email: "jsmith@gmail.com",
            phone: "(931) 931-9319",
            totalEvents: 2,
            totalHours: 5,
            registeredEvents: ["604d6730ca1c1d7fcd4fbdc2", "604d6730ca1c1d7fcd4fbdc9"],
            attendedEvents: ["604d6730ca1c1d7fcd4fbdc3", "604d6730ca1c1d7fcd4fbdc4"],
        };

        EventSchema.findById = jest.fn().mockResolvedValue(mockEvent);
        VolunteerSchema.findOneAndUpdate = jest.fn().mockResolvedValue(mockVolunteer);
        // the return vals here don't matter, just doing so updateOne's dont get called
        EventSchema.updateOne = jest.fn().mockResolvedValue(mockVolunteer);
        VolunteerSchema.updateOne = jest.fn().mockResolvedValue(mockVolunteer);

        await registerVolunteerToEvent(newVolunteer, eventId);
        expect(EventSchema.findById).lastCalledWith(eventId);
        expect(EventSchema.findById).toHaveBeenCalledTimes(1);
        expect(VolunteerSchema.findOneAndUpdate).lastCalledWith({ email: newVolunteer.email }, newVolunteer, options);
        expect(VolunteerSchema.findOneAndUpdate).toHaveBeenCalledTimes(1);
        expect(EventSchema.updateOne).lastCalledWith({ _id: eventId }, updatedEvent);
        expect(EventSchema.updateOne).toHaveBeenCalledTimes(1);
        expect(VolunteerSchema.updateOne).lastCalledWith({ email: newVolunteer.email }, updatedVolunteer);
        expect(VolunteerSchema.updateOne).toHaveBeenCalledTimes(1);
    });

    test("fail since event doesnt exist", async () => {
        expect.assertions(3);
        const mockEvent = undefined;
        const eventId = "604d6730ca1c1d7fcd4fbdc4";

        EventSchema.findById = jest.fn().mockResolvedValue(mockEvent);
        await expect(registerVolunteerToEvent(newVolunteer, eventId)).rejects.toThrowError("Event does not exist.");
        expect(EventSchema.findById).lastCalledWith(eventId);
        expect(EventSchema.findById).toHaveBeenCalledTimes(1);
    });
});


describe("markVolunteerPresent() tests", () => {
    test("successfully checked in", async () => {
        const mockEvent: Event = {
            _id: "604d6730ca1c1d7fcd4fbdc9",
            name: "February Spruce Up",
            description: "We are sprucing in February. Come spruce with us :)",
            caption: "It's spruce season",
            maxVolunteers: 10,
            volunteerCount: 4,
            location: "1234 Neyland Dr\nKnoxville, TN 37916",
            startDate: new Date(Date.now()),
            endDate: new Date(Date.now()),
            startRegistration: new Date(Date.now()),
            endRegistration: new Date(Date.now()),
            hours: 3,
            image: {
                assetID: "aASDuiHWIDUOHWEff",
                url: "https://i.imgur.com/MrGY5EL.jpeg",
            },
            registeredVolunteers: ["604d6730ca1c1d7fcd4fbdd2", "604d6730ca1c1d7fcd4fbdd3", "604d6730ca1c1d7fcd4fbde0"],
            attendedVolunteers: [],
        };
        const mockVolunteer: Volunteer = {
            _id: "604d6730ca1c1d7fcd4fbde0",
            name: "John Smith",
            email: "jsmith@gmail.com",
            phone: "(931) 931-9319",
            totalEvents: 2,
            totalHours: 5,
            registeredEvents: ["604d6730ca1c1d7fcd4fbdc9", "604d6730ca1c1d7fcd4fbbb1"],
            attendedEvents: [],
        };
        EventSchema.findById = jest.fn().mockResolvedValue(mockEvent);
        VolunteerSchema.findById = jest.fn().mockResolvedValue(mockVolunteer);
        EventSchema.findByIdAndUpdate = jest.fn().mockResolvedValue(mockEvent);
        VolunteerSchema.findByIdAndUpdate = jest.fn().mockResolvedValue(mockVolunteer);
        await markVolunteerPresent(mockVolunteer._id!, mockEvent._id!);
        expect(EventSchema.findById).lastCalledWith(mockEvent._id);
        expect(EventSchema.findById).toHaveBeenCalledTimes(1);
        expect(VolunteerSchema.findById).lastCalledWith(mockVolunteer._id);
        expect(VolunteerSchema.findById).toHaveBeenCalledTimes(1);
        expect(EventSchema.findByIdAndUpdate).lastCalledWith(mockEvent._id, {
            $pull: { registeredVolunteers: mockVolunteer._id },
            $push: { attendedVolunteers: mockVolunteer._id },
        });
        expect(EventSchema.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(VolunteerSchema.findByIdAndUpdate).lastCalledWith(mockVolunteer._id, {
            $pull: { registeredEvents: mockEvent._id },
            $push: { attendedEvents: mockEvent._id },
            $inc: { totalEvents: 1, totalHours: mockEvent.hours },
        });
        expect(VolunteerSchema.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    test("volunteer not registered", async () => {
        const mockEvent: Event = {
            _id: "604d6730ca1c1d7fcd4fbdc9",
            name: "February Spruce Up",
            description: "We are sprucing in February. Come spruce with us :)",
            caption: "It's spruce season",
            maxVolunteers: 10,
            volunteerCount: 4,
            location: "1234 Neyland Dr\nKnoxville, TN 37916",
            startDate: new Date(Date.now()),
            endDate: new Date(Date.now()),
            startRegistration: new Date(Date.now()),
            endRegistration: new Date(Date.now()),
            hours: 3,
            image: {
                assetID: "aASDuiHWIDUOHWEff",
                url: "https://i.imgur.com/MrGY5EL.jpeg",
            },
            registeredVolunteers: ["604d6730ca1c1d7fcd4fbdd2", "604d6730ca1c1d7fcd4fbdd3"],
            attendedVolunteers: [],
        };
        const mockVolunteer: Volunteer = {
            _id: "604d6730ca1c1d7fcd4fbde0",
            name: "John Smith",
            email: "jsmith@gmail.com",
            phone: "(931) 931-9319",
            totalEvents: 2,
            totalHours: 5,
            registeredEvents: ["604d6730ca1c1d7fcd4fbbb1"],
            attendedEvents: [],
        };
        EventSchema.findById = jest.fn().mockResolvedValue(mockEvent);
        VolunteerSchema.findById = jest.fn().mockResolvedValue(mockVolunteer);
        EventSchema.findByIdAndUpdate = jest.fn().mockResolvedValue(mockEvent);
        VolunteerSchema.findByIdAndUpdate = jest.fn().mockResolvedValue(mockVolunteer);
        await expect(markVolunteerPresent(mockVolunteer._id!, mockEvent._id!)).rejects.toThrowError(
            "The volunteer is not registered for this event."
        );
        expect(EventSchema.findById).lastCalledWith(mockEvent._id);
        expect(EventSchema.findById).toHaveBeenCalledTimes(1);
        expect(VolunteerSchema.findById).lastCalledWith(mockVolunteer._id);
        expect(VolunteerSchema.findById).toHaveBeenCalledTimes(1);
    });

    test("volunteer already checked in", async () => {
        const mockEvent: Event = {
            _id: "604d6730ca1c1d7fcd4fbdc9",
            name: "February Spruce Up",
            description: "We are sprucing in February. Come spruce with us :)",
            caption: "It's spruce season",
            maxVolunteers: 10,
            volunteerCount: 4,
            location: "1234 Neyland Dr\nKnoxville, TN 37916",
            startDate: new Date(Date.now()),
            endDate: new Date(Date.now()),
            startRegistration: new Date(Date.now()),
            endRegistration: new Date(Date.now()),
            hours: 3,
            image: {
                assetID: "aASDuiHWIDUOHWEff",
                url: "https://i.imgur.com/MrGY5EL.jpeg",
            },
            registeredVolunteers: ["604d6730ca1c1d7fcd4fbdd2", "604d6730ca1c1d7fcd4fbdd3"],
            attendedVolunteers: ["604d6730ca1c1d7fcd4fbde0"],
        };
        const mockVolunteer: Volunteer = {
            _id: "604d6730ca1c1d7fcd4fbde0",
            name: "John Smith",
            email: "jsmith@gmail.com",
            phone: "(931) 931-9319",
            totalEvents: 2,
            totalHours: 5,
            registeredEvents: ["604d6730ca1c1d7fcd4fbbb1"],
            attendedEvents: ["604d6730ca1c1d7fcd4fbdc9"],
        };
        EventSchema.findById = jest.fn().mockResolvedValue(mockEvent);
        VolunteerSchema.findById = jest.fn().mockResolvedValue(mockVolunteer);
        EventSchema.findByIdAndUpdate = jest.fn().mockResolvedValue(mockEvent);
        VolunteerSchema.findByIdAndUpdate = jest.fn().mockResolvedValue(mockVolunteer);
        await expect(markVolunteerPresent(mockVolunteer._id!, mockEvent._id!)).rejects.toThrowError(
            "The volunteer has already been checked in to this event."
        );
        expect(EventSchema.findById).lastCalledWith(mockEvent._id);
        expect(EventSchema.findById).toHaveBeenCalledTimes(1);
        expect(VolunteerSchema.findById).lastCalledWith(mockVolunteer._id);
        expect(VolunteerSchema.findById).toHaveBeenCalledTimes(1);
    });
});

describe("markVolunteerNotPresent() tests", () => {
    test("successfully un-checked in", async () => {
        const mockEvent: Event = {
            _id: "604d6730ca1c1d7fcd4fbdc9",
            name: "February Spruce Up",
            description: "We are sprucing in February. Come spruce with us :)",
            caption: "It's spruce season",
            maxVolunteers: 10,
            volunteerCount: 4,
            location: "1234 Neyland Dr\nKnoxville, TN 37916",
            startDate: new Date(Date.now()),
            endDate: new Date(Date.now()),
            startRegistration: new Date(Date.now()),
            endRegistration: new Date(Date.now()),
            hours: 3,
            image: {
                assetID: "aASDuiHWIDUOHWEff",
                url: "https://i.imgur.com/MrGY5EL.jpeg",
            },
            registeredVolunteers: ["604d6730ca1c1d7fcd4fbdd2", "604d6730ca1c1d7fcd4fbdd3"],
            attendedVolunteers: ["604d6730ca1c1d7fcd4fbde0"],
        };
        const mockVolunteer: Volunteer = {
            _id: "604d6730ca1c1d7fcd4fbde0",
            name: "John Smith",
            email: "jsmith@gmail.com",
            phone: "(931) 931-9319",
            totalEvents: 2,
            totalHours: 5,
            registeredEvents: ["604d6730ca1c1d7fcd4fbbb1"],
            attendedEvents: ["604d6730ca1c1d7fcd4fbdc9"],
        };
        EventSchema.findById = jest.fn().mockResolvedValue(mockEvent);
        VolunteerSchema.findById = jest.fn().mockResolvedValue(mockVolunteer);
        EventSchema.findByIdAndUpdate = jest.fn().mockResolvedValue(mockEvent);
        VolunteerSchema.findByIdAndUpdate = jest.fn().mockResolvedValue(mockVolunteer);
        await markVolunteerNotPresent(mockVolunteer._id!, mockEvent._id!);
        expect(EventSchema.findById).lastCalledWith(mockEvent._id);
        expect(EventSchema.findById).toHaveBeenCalledTimes(1);
        expect(VolunteerSchema.findById).lastCalledWith(mockVolunteer._id);
        expect(VolunteerSchema.findById).toHaveBeenCalledTimes(1);
        expect(EventSchema.findByIdAndUpdate).lastCalledWith(mockEvent._id, {
            $pull: { attendedVolunteers: mockVolunteer._id },
            $push: { registeredVolunteers: mockVolunteer._id },
        });
        expect(EventSchema.findByIdAndUpdate).toHaveBeenCalledTimes(1);
        expect(VolunteerSchema.findByIdAndUpdate).lastCalledWith(mockVolunteer._id, {
            $pull: { attendedEvents: mockEvent._id },
            $push: { registeredEvents: mockEvent._id },
            $inc: { totalEvents: -1, totalHours: -1 * mockEvent.hours! },
        });
        expect(VolunteerSchema.findByIdAndUpdate).toHaveBeenCalledTimes(1);
    });

    test("volunteer not checked in event-side", async () => {
        const mockEvent: Event = {
            _id: "604d6730ca1c1d7fcd4fbdc9",
            name: "February Spruce Up",
            description: "We are sprucing in February. Come spruce with us :)",
            caption: "It's spruce season",
            maxVolunteers: 10,
            volunteerCount: 4,
            location: "1234 Neyland Dr\nKnoxville, TN 37916",
            startDate: new Date(Date.now()),
            endDate: new Date(Date.now()),
            startRegistration: new Date(Date.now()),
            endRegistration: new Date(Date.now()),
            hours: 3,
            image: {
                assetID: "aASDuiHWIDUOHWEff",
                url: "https://i.imgur.com/MrGY5EL.jpeg",
            },
            registeredVolunteers: ["604d6730ca1c1d7fcd4fbdd2", "604d6730ca1c1d7fcd4fbdd3", "604d6730ca1c1d7fcd4fbde0"],
            attendedVolunteers: [],
        };
        const mockVolunteer: Volunteer = {
            _id: "604d6730ca1c1d7fcd4fbde0",
            name: "John Smith",
            email: "jsmith@gmail.com",
            phone: "(931) 931-9319",
            totalEvents: 2,
            totalHours: 5,
            registeredEvents: ["604d6730ca1c1d7fcd4fbbb1"],
            attendedEvents: ["604d6730ca1c1d7fcd4fbdc9"],
        };
        EventSchema.findById = jest.fn().mockResolvedValue(mockEvent);
        VolunteerSchema.findById = jest.fn().mockResolvedValue(mockVolunteer);
        EventSchema.findByIdAndUpdate = jest.fn().mockResolvedValue(mockEvent);
        VolunteerSchema.findByIdAndUpdate = jest.fn().mockResolvedValue(mockVolunteer);
        await expect(markVolunteerNotPresent(mockVolunteer._id!, mockEvent._id!)).rejects.toThrowError(
            "The volunteer is not checked in to this event."
        );
        expect(EventSchema.findById).lastCalledWith(mockEvent._id);
        expect(EventSchema.findById).toHaveBeenCalledTimes(1);
        expect(VolunteerSchema.findById).lastCalledWith(mockVolunteer._id);
        expect(VolunteerSchema.findById).toHaveBeenCalledTimes(1);
    });

    test("volunteer not checked in volunteer-side", async () => {
        const mockEvent: Event = {
            _id: "604d6730ca1c1d7fcd4fbdc9",
            name: "February Spruce Up",
            description: "We are sprucing in February. Come spruce with us :)",
            caption: "It's spruce season",
            maxVolunteers: 10,
            volunteerCount: 4,
            location: "1234 Neyland Dr\nKnoxville, TN 37916",
            startDate: new Date(Date.now()),
            endDate: new Date(Date.now()),
            startRegistration: new Date(Date.now()),
            endRegistration: new Date(Date.now()),
            hours: 3,
            image: {
                assetID: "aASDuiHWIDUOHWEff",
                url: "https://i.imgur.com/MrGY5EL.jpeg",
            },
            registeredVolunteers: ["604d6730ca1c1d7fcd4fbdd2", "604d6730ca1c1d7fcd4fbdd3"],
            attendedVolunteers: ["604d6730ca1c1d7fcd4fbde0"],
        };
        const mockVolunteer: Volunteer = {
            _id: "604d6730ca1c1d7fcd4fbde0",
            name: "John Smith",
            email: "jsmith@gmail.com",
            phone: "(931) 931-9319",
            totalEvents: 2,
            totalHours: 5,
            registeredEvents: ["604d6730ca1c1d7fcd4fbbb1", "604d6730ca1c1d7fcd4fbdc9", "604d6730ca1c1d7fcd4fbdc9"],
            attendedEvents: [],
        };
        EventSchema.findById = jest.fn().mockResolvedValue(mockEvent);
        VolunteerSchema.findById = jest.fn().mockResolvedValue(mockVolunteer);
        EventSchema.findByIdAndUpdate = jest.fn().mockResolvedValue(mockEvent);
        VolunteerSchema.findByIdAndUpdate = jest.fn().mockResolvedValue(mockVolunteer);
        await expect(markVolunteerNotPresent(mockVolunteer._id!, mockEvent._id!)).rejects.toThrowError(
            "The volunteer is not checked in to this event."
        );
        expect(EventSchema.findById).lastCalledWith(mockEvent._id);
        expect(EventSchema.findById).toHaveBeenCalledTimes(1);
        expect(VolunteerSchema.findById).lastCalledWith(mockVolunteer._id);
        expect(VolunteerSchema.findById).toHaveBeenCalledTimes(1);
    });
});

describe("getVolunteerEvents() tests", () => {
    const volId = "602734007d7de15fae321153";

    test("successful return", async () => {
        const mockEvents = [
            {
                _id: "604d6730ca1c1d7fcd4fbdc9",
                name: "0",
                description: "We are sprucing in February. Come spruce with us :)",
                caption: "It's spruce season",
            },
            {
                _id: "604d6730ca1c1d7fcd4fbdc9",
                name: "1",
                description: "We are sprucing in February. Come spruce with us :)",
                caption: "It's spruce season",
            },
            {
                _id: "604d6730ca1c1d7fcd4fbdc9",
                name: "2",
                description: "We are sprucing in February. Come spruce with us :)",
                caption: "It's spruce season",
            },
        ];

        const VolsMock: any = {
            getVolunteerEvents, // to be tested,
            populate: jest.fn(() => []),
        };
        VolunteerSchema.findById = jest.fn(() => VolsMock);
        VolsMock.populate.mockImplementation(() => mockEvents); // mock final return val

        const EVENTS_PER_PAGE = 3;
        const page = 2;
        const EVENT_FIELDS = { _id: 1, name: 1, startDate: 1, hours: 1 };

        await VolsMock.getVolunteerEvents(volId, page);
        expect(VolunteerSchema.findById).toHaveBeenLastCalledWith(volId);
        expect(VolsMock.populate).toHaveBeenLastCalledWith({
            path: "attendedEvents",
            select: EVENT_FIELDS,
            options: {
                sort: { startDate: -1, name: 1 },
                skip: (page-1) * EVENTS_PER_PAGE,
                limit: EVENTS_PER_PAGE,
            },
        });
    });

    test("invalid page number", async () => {
        expect.assertions(2);
        await expect(getVolunteerEvents(volId, 0)).rejects.toThrowError("Invalid page number.");
        await expect(getVolunteerEvents(volId, -10)).rejects.toThrowError("Invalid page number.");
    });

    test("no volunteer with that id", async () => {
        expect.assertions(1);
        const mockEvents = undefined;
        const page = 2;

        const VolsMock: any = {
            getVolunteerEvents, // to be tested,
            populate: jest.fn(() => []),
        };
        VolunteerSchema.findById = jest.fn(() => VolsMock);
        VolsMock.populate.mockImplementation(() => mockEvents); // mock final return val

        await expect(VolsMock.getVolunteerEvents(volId, page)).rejects.toThrowError("Volunteer not found.");
    });
});
