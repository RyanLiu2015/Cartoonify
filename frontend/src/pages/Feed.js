import React, { useState, useEffect } from 'react';
import { makeStyles } from "@material-ui/core/styles";
import { useNavigate } from "react-router-dom";

import Header from '../components/Header.js';
import Logo from "../components/Logo.js";
import Post from '../components/Post';

import Box from "@material-ui/core/Box";
import Chip from "@material-ui/core/Chip";
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';


import { toPost } from '../utils.js';


const WIDTH = 400;

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles(() => ({
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
}));

export default function Feed() {
  const [modalStyle] = useState(getModalStyle);
  
  const [posts, setPosts] = useState([
    {
      username: "godtello",
      caption: "Oh, I'm a God!",
      imageUrl:
        "https://images.unsplash.com/photo-1637019838019-5f14d84ee308?ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
    },
  ]);
  
  const url = "http://localhost:42069/user";
  var sendjson = JSON.stringify({

  });
  useEffect(() => {
    toPost("POST", url, sendjson, (postJson) => {
      setPosts(
        postJson.map((post) => ({
          id: post.id,
          user: post.user,
          caption: post.caption,
          imageUrl: post.url,
        }))
      );
    });
  }, []);

  const classes = useStyles();
  return (
    <Box align="center">
      <Header />
      <Logo />

      <div className={classes.holder}>
        <div className='timeline'>
          {posts.map((post) => (
            <Post
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </div>
        <div>
            <Chip
              color="secondary"
              className={classes.chip}
              icon={<NavigateBeforeIcon style={{ marginTop: 4 }} />}
              onClick={() => {}}
            />
            <Chip
              color="secondary"
              className={classes.chip}
              icon={<NavigateNextIcon style={{ marginTop: 4 }} />}
              onClick={() => {}}
            />
        </div>
      </div>
    </Box>
  );
}