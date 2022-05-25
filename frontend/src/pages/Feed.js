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

import sampleImg from "../feed-images/1.jpg"

const WIDTH = 400;

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
  const [pageNum, setPageNum] = useState(1);
  const firstPage = pageNum == 1;
  const [lastPage, setLastPage] = useState(false);

  const [posts, setPosts] = useState([
    {
      postId: 8,
      postAuthor: "godtello",
      imageUrl: sampleImg,
      caption: "he center of France welcomes the heart of 21st-century coachbuilding. The DIVO is BUGATTI’s handbuilt hyper sports car that redefines coachbuilding for the modern era with exceptional design elements inside and",
      likeNUm: 10,
      commentNum: 10,
      postTime: "11: 20",
    },
    {
      postId: 8,
      postAuthor: "aaron",
      imageUrl: sampleImg,
      caption: "Oh, I'm a God!",
      likeNUm: 10,
      commentNum: 10,
      postTime: "11: 20",
    },
  ]);
  
  const url = "http://localhost:42069/user";
  var sendjson = JSON.stringify(
    {
      "dynamic-field": {
        "method": "retrieve",
        "page": 1
      }
    });
  
  // useEffect(() => {
  //   toPost("POST", url, sendjson, (postJson) => {
  //     setPosts(
  //       postJson.map((post) => ({
  //         postId: post.fid,
  //         postAuthor: post.author-username,
  //         imageUrl: post.resource-identifier,
  //         likeNUm: post.upvote,
  //         caption: post.first-comment-content,
  //         commentNum: post.comment-count,
  //         postTime: post.created-at,
  //       }))
  //     );
  //   });
  // }, []);

  const classes = useStyles();
  return (
    <Box align="center">
      <Header />
      <Logo />

      <div className={classes.holder}>
        <div className='timeline'>
          {posts.map((post) => (
            <Post
              postId={post.postId}
              postAuthor={post.postAuthor}
              imageUrl={post.imageUrl}
              likeNum={post.likeNUm}
              caption={post.caption}
              commentNum={post.commentNum}
              postTime={post.postTime}
              
            />
          ))}
        </div>
        <div>
            {!firstPage && (
              <Chip
              color="secondary"
              className={classes.chip}
              icon={<NavigateBeforeIcon style={{ marginTop: 4 }} />}
              onClick={() => {}}
              />
            )}
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