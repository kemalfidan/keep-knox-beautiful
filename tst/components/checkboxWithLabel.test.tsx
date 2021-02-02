import * as React from "react";
import { shallow } from "enzyme";
import { CheckboxWithLabel } from "src/components/checkboxWithLabel";

test("CheckboxWithLabel changes the text after click", () => {
    const checkbox = shallow(<CheckboxWithLabel labelOn="On" labelOff="Off" />);

    // test interaction
    expect(checkbox.text()).toEqual("Off");
    checkbox.find("input").simulate("change");
    expect(checkbox.text()).toEqual("On");

    // test snapshot
    expect(checkbox).toMatchSnapshot();
});
