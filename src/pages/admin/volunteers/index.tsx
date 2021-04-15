import {
    createStyles,
    makeStyles,
    Paper,
    Table,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Theme,
    TableBody,
    Container,
    Grid,
    TextField,
    InputAdornment,
} from "@material-ui/core";
import { Search } from "@material-ui/icons";
import { GetStaticPropsContext, NextPage } from "next";
import Link from "next/link";
import { useRef, useState } from "react";
import { getVolunteersForAdmin } from "server/actions/Volunteer";
import colors from "src/components/core/colors";
import constants from "utils/constants";
import { Volunteer } from "utils/types";
import urls from "utils/urls";

interface Props {
    vols: Volunteer[];
}

export async function getStaticProps(context: GetStaticPropsContext) {
    try {
        const vols: Volunteer[] = await getVolunteersForAdmin();

        return {
            props: {
                vols: JSON.parse(JSON.stringify(vols)) as Volunteer[],
            },
            revalidate: constants.revalidate.allVolunteers,
        };
    } catch (error) {
        return {
            props: {},
            revalidate: constants.revalidate.allVolunteers,
        };
    }
}

const VolunteersPage: NextPage<Props> = ({ vols }) => {
    // helper func to get the vols by search query
    function getVolsFromSearch(query: string): Volunteer[] {
        if (query == "") return vols;
        // this search is pretty basic, but i think it works
        return vols.filter(
            vol =>
                vol.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
                vol.email?.toLowerCase().indexOf(query.toLowerCase()) !== -1
        );
    }

    const styles = useStyles();
    const [search, setSearch] = useState("");
    return (
        <Container maxWidth="xl" className={styles.container}>
            <Grid container direction="row" justify="center">
                <Grid item xs={10} md={8} lg={6}>
                    <Grid container direction="row" justify="flex-end">
                        <TextField
                            variant="outlined"
                            label="Search"
                            margin="dense"
                            size="small"
                            style={{ margin: 30 }}
                            onChange={e => {
                                setSearch(e.target.value);
                            }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
            </Grid>
            <Grid container direction="row" spacing={6} justify="center">
                <Grid item xs={10} md={8} lg={6}>
                    <TableContainer component={Paper}>
                        <Table className={styles.table} aria-label="volunteer table">
                            <TableHead>
                                <TableRow>
                                    <TableCell style={{ fontWeight: "bold" }}>Volunteer name</TableCell>
                                    <TableCell style={{ fontWeight: "bold" }} align="right">
                                        Email
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {getVolsFromSearch(search).map(vol => (
                                    <Link href={urls.pages.volunteer(vol._id!)} passHref key={vol._id}>
                                        <TableRow className={styles.tr} hover>
                                            <TableCell>{vol.name}</TableCell>
                                            <TableCell align="right">{vol.email}</TableCell>
                                        </TableRow>
                                    </Link>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </Grid>
        </Container>
    );
};

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        table: {
            minWidth: 500,
        },
        container: {
            margin: 30,
        },
        tr: {
            cursor: "pointer",
            hover: {
                backgroundColor: colors.lightGray,
            },
        },
    });
});

export default VolunteersPage;
