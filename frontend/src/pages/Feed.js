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

import { postRequest } from '../utils.js';

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

  const [posts, setPosts] = useState([]);
  
  const url = "http://localhost:42069/user";
  var sendjson = JSON.stringify(
    {
      "dynamic_field": {
        "method": "retrieve",
        "page": 1
      }
    });
  
  useEffect(() => {
    postRequest(url, sendjson, (postJson) => {
      setPosts(
        postJson.map((post) => ({
          postId: post.fid,
          postAuthor: post.author_username,
          imageUrl: post.resource_identifier,
          likeNum: post.upvote,
          caption: post.first_comment_content,
          commentNum: post.comment_count,
          postTime: post.created_at,
        }))
      );
    });
  }, []);

  console.log(posts);

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
              likeNum={post.likeNum}
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