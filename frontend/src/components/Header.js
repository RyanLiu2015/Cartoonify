import React, { useState, useEffect } from "react";
import { AppBar, Toolbar, Typography, makeStyles, Button, IconButton, Drawer, Link, MenuItem } from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const HEIGHT = 64;

const headersData = [
    {
      label: "Home",
      href: "/*",
    },
    {
      label: "Login",
      href: "/login",
    },
    {
      label: "Feed",
      href: "/feed",
    },
];

const useStyles = makeStyles(() => ({
    headerContainer: {
        height: HEIGHT,
    },
    header: {
        height: HEIGHT,
        backgroundColor: "#2D2D30",
        paddingRight: "79px",
        paddingLeft: "118px",
        "@media (max-width: 700px)": {
          paddingLeft: 0,
        },
    },
    logo: {
      fontFamily: "Work Sans, sans-serif",
      fontWeight: 600,
      color: "#FFFEFE",
      textAlign: "left",
    },
    menuButton: {
        fontFamily: "Open Sans, sans-serif",
        fontWeight: 700,
        size: "18px",
        marginLeft: "38px",
    },
    toolbar: {
        display: "flex",
        justifyContent: "space-between",
    },
    drawerContainer: {
        padding: "20px 30px",
    },
  }));

export default function Header() {
    const [state, setState] = useState({
        mobileView: false,
        drawerOpen: false
    });

    const { mobileView, drawerOpen } = state;

    let navigate = useNavigate();
    
    useEffect(() => {
        const setResponsiveness = () => {
        return window.innerWidth < 900
            ? setState((prevState) => ({ ...prevState, mobileView: true }))
            : setState((prevState) => ({ ...prevState, mobileView: false }));
        };
    
        setResponsiveness();
        window.addEventListener("resize", () => setResponsiveness());
    
        return () => {
            window.removeEventListener("resize", () => setResponsiveness());
        }
    }, []);

    const { headerContainer, header, logo, menuButton, toolbar, drawerContainer } = useStyles();

    const displayDesktop = () => {
        return (
            <Toolbar className={toolbar}>
                {cartoonifyLogo}
                <div>
                    {getMenuButtons()}
                    <Button 
                        className={menuButton}
                        color="inherit"
                        onClick={() => {
                            // not finished yet, need check if user already logged out.
                            localStorage.removeItem('user');
                            localStorage.removeItem('userId');
                            alert("Log out successful!")
                        }}
                    >
                        Log Out
                    </Button>
                </div>
            </Toolbar>
        );
    };

    const cartoonifyLogo = (
        <Typography variant="h6" component="h1" className={logo}>Cartoonify</Typography>
    );

    // const handleClickDirect = ( { href } ) => {
    //     navigate({
    //         pathname: href,
    //         search: createSearchParams({
    //             user: username
    //         }).toString()

    //     });
    // };

    const getMenuButtons = () => {
        return headersData.map(({ label, href }) => {
            return (
                <Button
                    {...{
                        key: label,
                        color: "inherit",
                        to: href,
                        component: RouterLink,
                        className: menuButton,
                        // onClick: handleClickDirect(href)
                    }}
                >
                    {label}
                </Button>
            );
        });
    };

    const displayMobile = () => {
        const handleDrawerOpen = () => 
            setState((prevState) => ({ ...prevState, drawerOpen: true }));
        const handleDrawerClose = () =>
            setState((prevState) => ({ ...prevState, drawerOpen: false }));
        return (
            <Toolbar>
                <IconButton
                {...{
                    edge: "start",
                    color: "inherit",
                    "aria-label": "menu",
                    "aria-haspopup": "true",
                    onClick: handleDrawerOpen,
                }}
                >
                    <MenuIcon />
                </IconButton>
                <Drawer
                    {...{
                        anchor: "left",
                        open: drawerOpen,
                        onClose: handleDrawerClose,
                    }}
                >
                    <div className={drawerContainer}>{getDrawerChoices()}</div>
                </Drawer>
                <div>{cartoonifyLogo}</div>
            </Toolbar>
        );
    };

    const getDrawerChoices = () => {
        return headersData.map(({ label, href }) => {
            return (
            <Link
                {...{
                    component: RouterLink,
                    to: href,
                    color: "inherit",
                    style: { textDecoration: "none" },
                    key: label,
                    // onClick: handleClickDirect(href)
                }}
            >
                <MenuItem>{label}</MenuItem>
            </Link>
            );
        });
    };

    return (
        <header className={headerContainer}>
            <AppBar className={header}>
                {mobileView ? displayMobile() : displayDesktop()}
            </AppBar>
        </header>
    );
}