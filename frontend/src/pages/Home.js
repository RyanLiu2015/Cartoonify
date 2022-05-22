import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  useNavigate,
} from "react-router-dom";
import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import StyleSelector from "../components/StyleSelector.js";
import Backdrop from "@material-ui/core/Backdrop";
import DownloadIcon from "@material-ui/icons/GetApp";

import ImageUploader from "react-images-upload";
import ReactCompareImage from "react-compare-image";
import * as loadImage from "blueimp-load-image";

import GridLoader from "react-spinners/GridLoader";
import beforePlaceholder from "../images/before.jpg";
import afterPlaceholder from "../images/after.jpg";
import logo from "../images/logo.svg";

import { triggerBase64Download } from "react-base64-downloader";
import { transform } from "../api.js";
import { toDataUrl } from "../utils.js";
import menu from '../images/menu.png'
import sty from './home.module.css';

const LOAD_SIZE = 450;
const WIDTH = 400;

const useStyles = makeStyles((theme) => ({
  formControl: {
    width: "70%",
    margin: theme.spacing(1),
  },
  holder: {
    width: WIDTH,
    maxWidth: 350,
    margin: 10,
  },
  chip: {
    width: 200,
    backgroundColor: "#e63946",
    margin: 10,
    fontWeight: "bold",
  },
  logo: {
    width: WIDTH * 0.8,
    marginTop: 10,
    marginLeft: 20,
  },
}));

export default function Home() {
  const username = window.localStorage.username;
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const [percentage, setPercentage] = useState(0.5);
  const [modelID, setModelID] = useState(0);
  const [open, setOpen] = useState(false);
  let navigate = useNavigate();
  let [menuActive, setMenuActive] = useState(false);
  useEffect(() => {
    toDataUrl(beforePlaceholder, (base64) => {
      setBefore(base64);
    });
  }, []);

  useEffect(() => {
    toDataUrl(afterPlaceholder, (base64) => {
      setAfter(base64);
    });
  }, []);

  const classes = useStyles();
  return (
    <Box align="center">
      <div className={sty.headerBox}>
        <div className={sty.headCenter}>
          <div className={sty.headerTit}>
            Cartoonify
          </div>

          <div style={{
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            fontWeight: 'bold'
          }}>
            {username && (
              <span style={{
                marginRight: 15
              }}>{username}</span>
            )}
            <img onClick={() => {
              setMenuActive(!menuActive)
            }} style={{
              width: 30
            }} src={menu} />
          </div>
        </div>
        <div style={{
          transform: `translate(0, ${menuActive ? '0' : '-100%'})`
        }} className={sty.headNavBox}>
          <div onClick={() => {
            navigate('/')
          }} className={sty.headNavItem}>
            Home
          </div>
          <div onClick={() => {
            navigate('/login')
          }} className={sty.headNavItem}>
            Login/Register
          </div>
          <div onClick={() => {
            navigate('/list')
          }} className={sty.headNavItem}>
            Feed
          </div>
          {username && (
            <div onClick={() => {
              window.localStorage.removeItem("username")
              navigate('/login')

            }} style={{
              textAlign: 'center',
              color: 'red'
            }} className={sty.headNavItem}>
              退出
            </div>
          )}
        </div>
      </div>

      <div className={sty.padding}>

      </div>

      <div style={{ textAlign: "center", width: "100%" }}>
        <img src={logo} className={classes.logo} />
      </div>

      <div className={classes.holder}>
        <StyleSelector
          modelID={modelID}
          setModelID={setModelID}
          setPercentage={setPercentage}
          setOpen={setOpen}
          before={before}
          LOAD_SIZE={LOAD_SIZE}
          setAfter={setAfter}
        />

        <ImageUploader
          singleImage
          buttonText="Choose images"
          onChange={(pictureFiles, pictureDataURL) => {
            setOpen(true);
            setPercentage(1);

            loadImage(
              pictureDataURL[0],
              (cnv) => {
                setBefore(cnv.toDataURL());
                setAfter(cnv.toDataURL());
                const data = {
                  image: cnv.toDataURL(),
                  model_id: modelID,
                  load_size: LOAD_SIZE,
                };
                transform(data)
                  .then((response) => {
                    console.log("success");
                    console.log(response.data);
                    setAfter(response.data.output);
                    setPercentage(0.0);
                    setOpen(false);
                  })
                  .catch((response) => {
                    console.log(response);
                  });
              },
              {
                orientation: true,
                canvas: true,
                crossOrigin: "anonymous",
                maxWidth: 600,
              }
            );
          }}
          imgExtension={[".jpg", ".gif", ".png", ".gif", "jpeg"]}
          maxFileSize={5242880}
        />

        <ReactCompareImage
          aspectRatio="wider"
          leftImage={before}
          rightImage={after}
          leftImageLabel="Before"
          rightImageLabel="After"
          sliderPositionPercentage={percentage}
          sliderLineColor="black"
          leftImageCss={{ borderRadius: 10 }}
          rightImageCss={{ borderRadius: 10 }}
        />

        <Chip
          color="secondary"
          label="Download"
          className={classes.chip}
          icon={<DownloadIcon style={{ marginTop: 4 }} />}
          onClick={() => {
            triggerBase64Download(after, "styled_image");
          }}
        />
      </div>
      <Backdrop
        open={open}
        style={{ zIndex: 999 }}
        onClick={() => {
          setOpen(false);
        }}
      >
        <GridLoader size={30} margin={2} color="#e63946" />
      </Backdrop>
    </Box>
  );
}