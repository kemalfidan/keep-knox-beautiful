import { shallow } from "enzyme";
import React, { useState } from "react";

import EventCard from "src/components/EventCard";

import { Event } from "utils/types";

const evNoImg: Event = {
    name: "Test Event",
    description: "This is an event with a test description an no image",
    location: "1200 Baker St Knoxville, TN",
    startDate: new Date("3/1/21 12:00 pm"),
    endDate: new Date("3/1/21 2:00 pm"),
    hours: 2,
};

describe("EventCard.tsx", () => {
    it("renders information from event prop correctly", () => {
        const component = shallow(<EventCard event={evNoImg} />);

        const evName = component.find("#eventName");
        const evDesc = component.find("#eventDesc");
        const evLoc = component.find("#eventLoc");
        const evTime = component.find("#eventTime");

        expect(evName.children().text()).toBe(evNoImg.name);
        expect(evDesc.children().text()).toBe(evNoImg.description);
        expect(evLoc.children().text()).toBe(evNoImg.location?.split(",")[0]);
        expect(evTime.children().reduce((acc, cur) => (acc += cur.text()), "")).toBe("12:00 PM - 2:00 PM");
    });

    // it("renders placeholder when image is missing", () => {
    //     const component = shallow(<EventCard event={evNoImg} />);

    //     const thumbnail = component.find("#eventThumb");

    //     console.log(thumbnail.getElement().props);
    // });

    it("handles hover correctly", () => {
        const component = shallow(<EventCard event={evNoImg} />);
    });
});
