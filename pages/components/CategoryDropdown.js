
// System stuff
import React from "react";
import Link from "next/link";

import { connect } from "react-redux";

import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Grow from '@mui/material/Grow';
import ClickAwayListener from '@mui/material/ClickAwayListener';

function CategoryDropdown(props) {

    const options = ['Front Page','Sports','Lifestyle', 'Campus News', 'Weekend', 'Editorial'];
    
    const [open, setOpen] = React.useState(false);
    const anchorRef = React.useRef(null);
    const [selectedIndex, setSelectedIndex] = React.useState(1);

    const handleMenuItemClick = (event, index) => {
        setSelectedIndex(index);
        setOpen(false);
    };

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
        return;
        }

        setOpen(false);
    };

    function handleCategorySelected(filter) {
        props.dispatch({ type: "SET_CURRENT_PAGE", payload: filter });
        console.log('Changed to: ', props.currentPage);
    }

    return(
        <React.Fragment >
            <ButtonGroup variant="contained" ref={anchorRef} sx={{ marginBottom: "12px" }} aria-label="split button">
                <Button
                size="small"
                aria-controls={open ? 'split-button-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-label="select merge strategy"
                aria-haspopup="menu"
                onClick={handleToggle}
                variant="text"
                        sx={{
                            backgroundColor: "#e03d3d",
                            color: "white",
                            paddingLeft: "10px",
                            paddingRight: "10px",
                            zIndex: "50000",
                        }}
                >
                <ArrowDropDownIcon />
                </Button>
            </ButtonGroup >
            <Popper
                open={open}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement }) => (
                <Grow
                    {...TransitionProps}
                    style={{
                    transformOrigin:
                        placement === 'bottom' ? 'center top' : 'center bottom',
                    }}
                >
                    <Paper>
                    <ClickAwayListener onClickAway={handleClose}>
                        <MenuList id="split-button-menu">
                        {options.map((option, index) => (
                            <MenuItem
                            key={option}
                            selected={index === selectedIndex}
                            onClick={(event) => {
                                handleMenuItemClick(event, index)
                                console.log(props);
                                console.log(option);
                                handleCategorySelected(option);
                            }}
                            >
                            {option}
                            </MenuItem>
                        ))}
                        </MenuList>
                    </ClickAwayListener>
                    </Paper>
                </Grow>
                )}
            </Popper>
        </React.Fragment>
    )

    
}

const mapStateToProps = (state) => {
    return {
        currentPage: state.article.currentPage,
    }
}

export default connect(mapStateToProps)(CategoryDropdown);
