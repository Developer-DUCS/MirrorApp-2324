// CategorySelector.js
//
// Component Description:
//                      options for cateogries related to article
//                      the cateogry options can be toggled and if categories have already been saved for an article they will load in toggled on
//

import { Box, Button } from "@mui/material";
import React, { useState, useEffect } from "react";

export default function CategorySelector(props) {

    //console.log(props.categories);

    //Categories states
	const [frontPage, setFrontPage] = useState(0);
    const [sports, setSports] = useState(0);
    const [lifestyle, setLifestyle] = useState(0);
    const [campusNews, setCampusNews] = useState(0);
    const [news, setNews] = useState(0);
    const [weekend, setWeekend] = useState(0);
    const [editorial, setEditorial] = useState(0);

    // toggles state of categories when category button is clicked
    const toggleCategory = (categoryState, setCategoryState) => {
        setCategoryState((prevState) => (prevState === 0 ? 1 : 0));

        //console.log([frontPage, sports, lifestyle, campusNews, news, weekend, editorial]);
    };

    useEffect(() => {

        props.setter([frontPage, sports, lifestyle, campusNews, news, weekend, editorial]);

    }, [frontPage, sports, lifestyle, campusNews, news, weekend, editorial]);

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 2,
                marginBottom: 2,
                //bargin on the right looks better but when shrinking the page can be an issue
                marginRight: 20,
                //margin left same as the save as draft below
                marginLeft: 1,
            }}>
            {[
                //handling category buttons states and dynamic rendering 
                { label: "Front Page", state: frontPage, setState: setFrontPage },
                { label: "Sports", state: sports, setState: setSports },
                { label: "Lifestyle", state: lifestyle, setState: setLifestyle },
                { label: "Campus News", state: campusNews, setState: setCampusNews },
                { label: "News", state: news, setState: setNews },
                { label: "Weekend", state: weekend, setState: setWeekend },
                { label: "Editorial", state: editorial, setState: setEditorial },
            ].map((category, index) => (
                <Button
                    key={index}
                    sx={{
                        //categories button styles when toggled 
                        backgroundColor: category.state === 1 ? "darkgrey" : "white",
                        color: category.state === 1 ? "white" : "black",
                        border: "1px solid darkgrey",
                        borderRadius: 1,
                        minWidth: 50,
                        margin: 1,
                        "&:hover": {
                        backgroundColor: category.state === 1 ? "darkgrey" : "lightgrey",
                        },
                    }}
                    //pass state and setSate props to category object
                    onClick={() => toggleCategory(category.state, category.setState)}
                    >
                    {category.label}
                </Button>
            ))}
        </Box>
    )
}