import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { useLocation } from "react-router-dom";

import Header from '../components/Header.js';
import Logo from "../components/Logo.js";

import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import StyleSelector from "../components/StyleSelector.js";
import Backdrop from "@material-ui/core/Backdrop";
import DownloadIcon from "@material-ui/icons/GetApp";

import ShareIcon from '@material-ui/icons/Share';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import ImageUploader from "react-images-upload";
import ReactCompareImage from "react-compare-image";
import * as loadImage from "blueimp-load-image";

import GridLoader from "react-spinners/GridLoader";
import beforePlaceholder from "../images/before.jpg";
import afterPlaceholder from "../images/after.jpg";

import { triggerBase64Download } from "react-base64-downloader";
import { transform } from "../api.js";
import { toDataUrl } from "../utils.js";

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
    width: 120,
    backgroundColor: "#e63946",
    margin: 10,
    fontWeight: "bold",
  },
  img: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
    marginBottom: 10,
  },
}));

export default function Home(props) {
  const [before, setBefore] = useState("");
  const [after, setAfter] = useState("");
  const [percentage, setPercentage] = useState(0.5);
  const [modelID, setModelID] = useState(0);
  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [content, setContent] = useState("");
  
  const [userId, setUserId] = useState(0);

  // let location = useLocation();
  const [user, setUser] = useState("");

  useEffect(() => {
    var localUser = localStorage.getItem('user');
    if (typeof localUser !== 'undefined' && localUser !== null) {
      setUser(localUser);
    }
  }, []);

  console.log(user);
  
  // console.log(location.state);

  // useEffect(() => {
  //   if (location.state.user) {
  //     console.log(location.state.user);
  //     setUser(location.state.user);
  //   }
  // }, []);

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

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleShareFeed = () => {
    if (!after) {
      alert('no image shared!')
      return;
    }
    const xhr = new XMLHttpRequest();
    const url = "http://localhost:42069/user";
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    var sendImg = JSON.stringify(
      {
        "dynamic_field": {
          "method": "postnew",
          "author_id": 8,
          "resource_identifier": after
        }
      });
    xhr.send(sendImg);

    xhr.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
          const response = JSON.parse(xhr.responseText);
          console.log(response.Errcode);
          console.log(response.Errmsg);
          alert(xhr.responseText);
      }
  }

    setDialogOpen(false);
  };

  const classes = useStyles();
  return (
    <Box align="center">
      <Header />
      <Logo />

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

        <Chip
          color="secondary"
          label="Share"
          className={classes.chip}
          icon={<ShareIcon style={{ marginTop: 4 }} />}
          onClick={handleOpen}
        />
        <Dialog open={dialogOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Share to Feed</DialogTitle>
          <DialogContent>
            <img src={after} className={classes.img} />
            <TextField
              autoFocus
              id="outlined-multiline-static"
              label="Text Content"
              multiline
              fullWidth
              rows={4}
              placeholder="Share your cartoonified image with optional text content here . . ."
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
            <Button onClick={handleShareFeed} color="primary">
              Share
            </Button>
          </DialogActions>
        </Dialog>
        
      
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