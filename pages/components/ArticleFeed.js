// ---------------------------------------------------
//
// NavBar.js
// - Navigation component at the bottom of the app
// - Uses next/link to handle navigation between pages
//
// Modification Log:
// 01 05 - Thomas O. created index.js
//
// ---------------------------------------------------

// System stuff
import React, { useEffect, useState, useCallback, useContext } from "react";
import Router from "next/router";
import NextLink from 'next/link'
import Link from "next/link";
import Image from "next/image";
import { Buffer } from "buffer";
import { debounce } from "lodash";
import { useRouter } from "next/router";


import Menu from '@mui/material/Menu';
import Fade from '@mui/material/Fade';



import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ContentCut from '@mui/icons-material/ContentCut';
import ContentCopy from '@mui/icons-material/ContentCopy';
import ContentPaste from '@mui/icons-material/ContentPaste';
import Cloud from '@mui/icons-material/Cloud';


// Redux component
// - helps connect to the navbar for article feed data
import { connect } from "react-redux";

// Components
import NavBar from "./NavBar";
import ButtonGroup from '@mui/material/ButtonGroup';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import dropdownMenu from "./dropdown";

import { Virtuoso } from "react-virtuoso";
import { IonContent, IonPage } from "@ionic/react";

import CategoryDropdown from "./CategoryDropdown";

// Styling
import {
    AppBar,
    Toolbar,
    Button,
    Typography,
    IconButton,
    Grid,
    Box,
    Card,
    CardContent,
    TextField,
} from "@mui/material";

import ButtonBase from "@material-ui/core/ButtonBase";

import { makeStyles } from "@material-ui/core/styles";

import SearchIcon from "@mui/icons-material/Search";

import DUIcon from "../../Lib/Images/DU-Small-Icon.png";

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

function ArticleFeed(props) {
    const articleStyles = makeStyles((theme) => ({
        container: {
            boxShadow: "0px 4px 5px rgba(0, 0, 0, 1)",
            backgroundColor: "white",
        },
        featuredImage: {
            height: "100%",
            width: "100%"
        },
        headline: {
            fontFamily: "AvantGarde",
            fontSize: 16,
            width: "100%",
        },
        author: {
            fontFamily: "AvantGarde",
            fontSize: 12,
            width: 200,
        },
    }));

    // For error handling
    const [getArticles, setArticles] = useState([]);

    // For searcb bar display property
    const [getDisplay, setDisplay] = useState("none");

    // For search value
    const [getSearchTerm, setSearchTerm] = useState("");

    // To adjust header height
    const [getHeight, setHeight] = useState("55px");

    // To adjust card margin (search header expanded)
    const [getPaddingTop, setPaddingTop] = useState("50px");

    const [age, setAge] = React.useState('');


    // On search click, set display property to block or none respectively
    function onSearchButtonClick() {
        if (getDisplay == "none") {
            setDisplay("flex");
        }
        if (getDisplay == "flex") {
            setDisplay("none");
        }
        if (getHeight == "55px") {
            setHeight("100px");
        }
        if (getPaddingTop == "50px") {
            setPaddingTop("135px");
        }
        if (getPaddingTop == "135px") {
            setPaddingTop("50px");
        }
    }

    // For routing articles
    const router = useRouter();

    // handleSearch - debounce function
    // - Calls the last onChange event from SearchBar
    // - Prevents database-lookup everytime user inputs a letter rapidly (fast typers)
    const handleSearch = debounce(async (getSearchTerm) => {
        let payload = {
            searchText: getSearchTerm,
        };

        let JSONdata = JSON.stringify(payload);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSONdata,
        };

        const response = await fetch("/api/GetArticleData", options);

        const data = await response.json();

        if (data) {
            console.log(
                "🚀 ~ file: ArticleFeed.js:88 ~ handleSearch ~ data",
                data
            );
            setArticles(data);
        }
    }, 500);

    // handleInputChange
    // - handles the input change from textfield
    // - react friendly
    const handleInputChange = (event) => {
        setSearchTerm(event.target.value);
        handleSearch(event.target.value);
    };

    const handleFilterClear = () => {
        props.dispatch({ type: "SET_CURRENT_PAGE", payload: "All" });
        console.log('Filter Cleared');
    }

    // useEffects
    // - On page load, return the list of articles according to what's being filtered
    // - Updates every time the user chooses a different tag
    useEffect(() => {
        async function updateFeed() {
            let payload = {
                filterBy: props.currentPage,
            };

            console.log("Searching for: " + props.currentPage);

            let JSONdata = JSON.stringify(payload);

            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSONdata,
            };

            const response = await fetch("/api/GetArticleByTag", options);

            if (response.status === 201){
                setArticles(null);
            }
            else if (response.status === 200) {
                const data = await response.json()

                console.log(
                    "🚀 ~ file: ArticleFeed.js:88 ~ handleSearch ~ data",
                    data
                );
                setArticles(data);
            }
            else {
                console.log("error filtering articles by category");
            }
        }

        updateFeed();
    }, [props.currentPage]);

    // truncateString
    // - shortens headlines so they fit on cards
    function truncateString(str) {
        let truncated = str.slice(0, 25);
        if (str.length > 25) {
            truncated += "...";
        }
        return truncated;
    }

    // Article Card - stateless functional component
    // - Creates a MUI card component from props with article data
    const ArticleCard = (props) => {
        let thumbnail;

        if (
            typeof props.article.thumbnailImageData == "string" ||
            typeof props.article.thumbnailImageData === "array" ||
            typeof props.article.thumbnailImageData === "buffer"
        ) {
            const imageData = Buffer.from(
                props.article.thumbnailImageData,
                "base64"
            );
            // const decodedString = atob(imageData);
            console.log(imageData);

            thumbnail = (
                <img
                    alt="thumbnail"
                    src={`${imageData}`}
                    width="80"
                    height="80"
                />
            );
        } else {
            thumbnail = (
                <Image
                    alt="thumbnail"
                    src={DUIcon.src}
                    width = "150"
                    height = "150"
                />
            );
        }

        let newHeadline = truncateString(props.article.headline);

        function handleArticleClick(e) {
            e.preventDefault();
            console.log("Going to: " + `${asPath}/articles/[${props.article.aid}]`)
            router.push(`${asPath}/articles/[${props.article.aid}]`);
        }

        const { asPath } = useRouter();

            
        return (
            <Card
                style={articleStyles.container}
                sx={{ m: 2, marginBottom: 3 }}>
                <Button
                    sx={{
                        padding: 0,
                        width: '100%'
                    }}
                    href={`${asPath}/articles/[${props.article.aid}]`}
                    component="a"
                    LinkComponent={Link}
                    onClick={handleArticleClick}>
                    <CardContent
                        sx={{
                            padding: 0,
                        }}
                    >
                        <Box
                            sx={{
                                display:'flex',
                                flexDirection:'row',
                                
                            }}>
                            
                            <Box>
                                <Box
                                sx={{
                                    display:'flex',
                                    flexDirection:'row',
                                    justifyContent: 'center',
                                    
                                }}>
                                    {thumbnail}
                                </Box>
                                
                                <Typography
                                    sx={{
                                        
                                        fontSize: 18,
                                        fontFamily: "AvantGrande",
                                        color: "black",
                                        textAlign: "center",
                                    }}>
                                    {newHeadline}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        fontFamily: "AvantGrande",
                                        color: "black",
                                        textAlign: "center",
                                    }}>
                                    By {props.article.author}
                                </Typography>
                            </Box>

                            
                        </Box>
                    </CardContent>
                    
                </Button>
            </Card>
        );
    };

    return (
        
        <Box sx={{ backgroundColor: "#F3F3F3" }}>
            <Box>
                <Box
                    style={{
                        position: "absolute",
                        top: 0,
                        width: "100%",
                        marginBottom: 10,
                    }}>
                        
                    <AppBar
                        position="fixed"
                        sx={{
                            backgroundColor: "#e03d3d",
                            height: { getHeight },
                        }}>
                            
                        
                        <Toolbar
                            sx={{ display: "flex", flexDirection: "column" }}>

                            

                            <Grid container>
                                <Grid
                                    xs={11}
                                    sx={{ display: "flex", alignItems: "end" }}
                                    item>
                                    <NextLink
                                        href="/"
                                        style={{ color: "white" }}>
                                        <Button
                                            variant="text"
                                            sx={{
                                                color: "white",
                                                fontSize: "24px",
                                                justifyContent: "space-around",
                                                fontFamily: "TrajanPro-Regular",
                                                paddingTop: "35px",
                                                paddingRight: "25px"
                                            }}>
                                            Drury Mirror
                                        </Button>
                                    </NextLink>

                                    <CategoryDropdown />

                                </Grid>                              

                                <Grid
                                    xs={1}
                                    item
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                    }}>
                                    <IconButton
                                        edge="start"
                                        onClick={() => {
                                            onSearchButtonClick();
                                        }}
                                        sx={{ color: "white", display: "flex", paddingTop: "35px" }}
                                        aria-label="menu">
                                        <SearchIcon />
                                    </IconButton>
                                    
                                </Grid>                                                                                               
                            </Grid>
                            <TextField
                                value={getSearchTerm}
                                onChange={handleInputChange}
                                variant="standard"
                                sx={{
                                    borderWidth: 0,
                                    display: getDisplay,
                                    m: 1,
                                    p: 1,
                                    borderRadius: 5,
                                    marginTop: 0,
                                    width: "99%",
                                    backgroundColor: "white",
                                    color: "black",
                                    disabledUnderline: true,
                                    inputProps: {
                                        width: "99%",
                                        backgroundColor: "white",
                                        disabledUnderline: true,
                                    },
                                }}
                            />
                        </Toolbar>
                    </AppBar>
                </Box>
                <Box>
                    <IonPage>
                        {getArticles ?
                        <IonContent>
                            <Box sx={{ paddingTop: getPaddingTop }}></Box>
                            <Virtuoso
                                totalCount={getArticles.length}
                                data={getArticles}
                                itemContent={(index, article) => {
                                    return (
                                        <ArticleCard
                                            article={article}
                                            key={index}
                                        />
                                    );
                                }}
                            />
                            <Box sx={{ marginBottom: 9 }}></Box>
                        </IonContent>                        
                        :
                        <IonContent>
                            <Box 
                            sx={{ paddingTop: "200px",
                            color: "black",
                            fontSize: "16px",
                            justifyContent: "space-around",
                            textAlign: "center",
                            fontFamily: "TrajanPro-Regular",
                            fontSize: "24px"
                         }}>
                            no results found for
                            <br></br>
                            {props.currentPage}
                            </Box>
                            <Box sx={{ marginBottom: 9 }}></Box>
                        </IonContent>
                        }
                    </IonPage>
                </Box>
            </Box>

            <Button sx={{
                backgroundColor:"#e03d3d",
                color: "white",
                fontSize: "16px",
                justifyContent: "space-around",
                fontFamily: "TrajanPro-Regular",
                marginLeft: "115px",
                marginTop: "790px",
                position: "fixed"
            }}
                onClick={handleFilterClear}
            >
                Clear Filter
            </Button>

        </Box>
    );
}

const mapStateToProps = (state) => {
    return {
        currentPage: state.article.currentPage,
    };
};

export default connect(mapStateToProps)(ArticleFeed);
