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
import { GetStaticPropsContext, NextPage, NextPageContext } from "next";
import Link from "next/link";
import React, { useState } from "react";
import { getVolunteers } from "server/actions/Volunteer";
import colors from "src/components/core/colors";
import constants from "utils/constants";
import { Volunteer, LoadMorePaginatedData } from "utils/types";
import urls from "utils/urls";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
    volsProps: Volunteer[];
    isLastPageProps: boolean;
}

const VolunteersPage: NextPage<Props> = ({ volsProps, isLastPageProps }) => {
    const styles = useStyles();
    const [search, setSearch] = useState("");
    const [vols, setVols] = useState<Volunteer[]>(volsProps);
    const [page, setPage] = useState<number>(1);
    const [isLastPage, setIsLastPage] = useState<boolean>(isLastPageProps);

    // helper func to get the vols by search query
    async function getVolsFromSearch(query: string) {
        const r = await fetch(`${urls.api.volunteers}?page=1&search=${query}`, {
            method: "GET",
        });
        /* eslint-disable */
        const response = await r.json();
        const newVolsData: LoadMorePaginatedData = response.payload;
        /* eslint-enable */

        setVols(newVolsData.data);
        setIsLastPage(newVolsData.isLastPage);
    }

    // helper func to get the vols for a certain page
    async function getVolsForPage(newPage: number) {
        const r = await fetch(`${urls.api.volunteers}?page=${newPage}&search=${search}`, {
            method: "GET",
        });
        /* eslint-disable */
        const response = await r.json();
        const newVolsData: LoadMorePaginatedData = response.payload;
        /* eslint-enable */

        setVols(vols.concat(newVolsData.data));
        setIsLastPage(newVolsData.isLastPage);
    }

    const handleSearchChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(event.target.value);
        setPage(1);
        await getVolsFromSearch(event.target.value);
    };
    const handleLoadMore = async () => {
        await getVolsForPage(page + 1);
        setPage(page + 1);
    };

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
                            color="secondary"
                            onChange={handleSearchChange}
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
                    <InfiniteScroll
                        dataLength={vols.length}
                        next={handleLoadMore}
                        hasMore={!isLastPage}
                        loader={<h4>Loading...</h4>}
                    >
                        <TableContainer component={Paper}>
                            <Table className={styles.table} aria-label="volunteer table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell style={{ fontWeight: "bold" }}>Volunteer Name</TableCell>
                                        <TableCell style={{ fontWeight: "bold" }} align="right">
                                            Email
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {vols.map(vol => (
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
                    </InfiniteScroll>
                </Grid>
            </Grid>
        </Container>
    );
};

export async function getServerSideProps(context: NextPageContext) {
    try {
        // validate admin user
        const cookie = context.req?.headers.cookie;
        const response = await fetch(`${urls.baseUrl}${urls.api.validateLogin}`, {
            method: "POST",
            headers: {
                cookie: cookie || "",
            },
        });

        // redirect
        if (response.status !== 200) {
            context.res?.writeHead(302, {
                Location: urls.pages.login,
            });
            context.res?.end();
        }

        const volsData: LoadMorePaginatedData = await getVolunteers(1);

        return {
            props: {
                volsProps: JSON.parse(JSON.stringify(volsData.data)) as Volunteer[],
                isLastPageProps: volsData.isLastPage,
            },
            //commented out for now, until I know if the change to getServerSide from getStatic is acceptable
            //no way to redirect from getStatic: getServerSide seems to make validation much easier
            //revalidate: constants.revalidate.allVolunteers,
        };
    } catch (error) {
        console.log(error);
        return {
            props: {},
            //revalidate: constants.revalidate.allVolunteers,
        };
    }
}

const useStyles = makeStyles((theme: Theme) => {
    return createStyles({
        table: {
            minWidth: 500,
        },
        container: {
            marginTop: 30,
            marginBottom: 70,
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
