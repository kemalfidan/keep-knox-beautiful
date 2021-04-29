import React from "react";
import CoreTypography from "src/components/core/typography";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";

export default function Waiver() {
    const styles = useStyles();

    return (
        <React.Fragment>
            <Container maxWidth="md" className={styles.container}>
                <Container className={styles.header}>
                    <CoreTypography variant="h1">KKB Volunteer Waiver</CoreTypography>
                    <CoreTypography variant="h2">Release and Waiver of Liability</CoreTypography>
                </Container>
                <CoreTypography variant="body1">
                    This Release and Waiver of Liability (the “Release”) is in favor of Keep Knoxville Beautiful, a
                    nonprofit corporation, and its directors, officers, board members, employees, agents, along with
                    other organizations and businesses associated with this event. <br /> <br />
                </CoreTypography>
                <CoreTypography variant="body1">
                    The Volunteer desires to work as a volunteer for Keep Knoxville Beautiful and engage in the
                    activities related to being a volunteer (the “Activities”). The Volunteer understands that the
                    Activities may include removing debris from roadsides, clearing a variety of weeds and trash from an
                    uneven and unkempt site, and disposing of such materials in a proper manner. <br /> <br />
                    The Volunteer hereby freely, voluntarily and without duress executes this Release under the
                    following terms: <br />
                </CoreTypography>
                <CoreTypography variant="body1">
                    <ol className={styles.list}>
                        <li>
                            <CoreTypography variant="body1">
                                RELEASE AND WAIVER. Volunteer does hereby release and forever discharge and hold
                                harmless Keep Knoxville Beautiful and its successors and assigns from any and all
                                liability, claims, and demands of whatever kind or nature, either in law or in equity,
                                which arise or may hereafter arise from Volunteer’s Activities through Keep Knoxville
                                Beautiful. Volunteer understands that this Release discharges Keep Knoxville Beautiful
                                from any liability or claim that the Volunteer may have against Keep Knoxville Beautiful
                                with respect to bodily injury, illness, or death that may result from Volunteer’s
                                Activities with Keep Knoxville Beautiful. Volunteer also understands that Keep Knoxville
                                Beautiful does not assume any responsibility for or obligation to provide financial
                                assistance or other assistance, including, but not limited to, medical, health, or
                                disability insurance or in the event of injury or illness. <br /> <br />
                            </CoreTypography>
                        </li>
                        <li>
                            <CoreTypography variant="body1">
                                MEDICAL TREATMENT. Volunteer does hereby release and forever discharge Keep Knoxville
                                Beautiful from any claim whatsoever that arises or may hereafter arise on account of any
                                first aid, treatment, or service rendered in connection with the Volunteer’s Activities
                                with Keep Knoxville Beautiful. I hereby consent to receive medical treatment which may
                                be deemed advisable in the event of injury, accident, and/or illness during this
                                activity or event. <br /> <br />
                            </CoreTypography>
                        </li>
                        <li>
                            <CoreTypography variant="body1">
                                ASSUMPTION OF THE RISK. The Volunteer understands that the Activities including work
                                that may be hazardous to the Volunteer, including, but not limited to, lifting, climbing
                                steep and/or uneven terrain, removing trash and limbs, and working in unsanitary
                                conditions. Volunteer hereby expressly and specifically assumes the risk of injury or
                                harm in the Activities and releases Keep Knoxville Beautiful from all liability for
                                injury, illness, death or property damage resulting from the Activities. <br /> <br />
                            </CoreTypography>
                        </li>
                        <li>
                            <CoreTypography variant="body1">
                                PHOTOGRAPHIC RELEASE. Volunteer does hereby grant and convey unto Keep Knoxville
                                Beautiful all right, title, and interest in any and all photographic images and video or
                                audio recordings made by Keep Knoxville Beautiful during the Volunteer’s Activities with
                                Keep Knoxville Beautiful, including, but limited to, any royalties, proceeds, or other
                                benefits derived from such photographs or recordings. <br /> <br />
                            </CoreTypography>
                        </li>
                        <li>
                            <CoreTypography variant="body1">
                                OTHER. Volunteer expressly agrees that this Release is intended to be as broad and
                                inclusive as permitted by the laws of the State of Tennessee, and that this Release
                                shall be governed by and interpreted in accordance with the laws of the State of
                                Tennessee. Volunteer agrees that in the event that any clause or provision of this
                                Release shall be held to be invalid by any court of competent jurisdiction, the
                                invalidity of such clause or provision shall not otherwise affect the remaining
                                provisions of this Release which shall continue to be enforceable. <br /> <br />
                            </CoreTypography>
                        </li>
                    </ol>
                </CoreTypography>
                <CoreTypography variant="body2" className={styles.bottomText}>
                    BY ACKNOWLEDGING THIS WAIVER I CERTIFY THAT I HAVE READ THIS DOCUMENT, AND I FULLY UNDERSTAND ITS
                    CONTENT. I AM AWARE THAT THIS IS A RELEASE OF LIABILITY AND A CONTRACT AND THAT I AM SIGNING IT OF
                    MY OWN FREE WILL.
                </CoreTypography>
            </Container>
        </React.Fragment>
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        container: {
            display: "flex",
            flexDirection: "column",
            textAlign: "justify",
            marginTop: "50px",
            marginBottom: "50px",
        },
        header: {
            textAlign: "center",
            paddingBottom: "30px",
        },
        list: {
            paddingLeft: "10px",
        },
        bottomText: {
            textAlign: "center",
            paddingBottom: "20px",
        },
    })
);
