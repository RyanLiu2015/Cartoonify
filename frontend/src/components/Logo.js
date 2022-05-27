import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../images/logo.svg";

const WIDTH = 400;

const useStyles = makeStyles(() => ({
    logoSty: {
        // backgroundColor: "black",
        // color: "white",
        width: WIDTH * 0.8,
        marginTop: 20,
        // marginBottom: 200,
        marginLeft: 20,
    },
}));

export default function Logo() {
    const { logoSty } = useStyles();

    return (
        <div style={{ textAlign: "center", width: "100%" }}>
            <img alt="Cartoonify" src={logo} className={logoSty} />
        </div>
    );
}
