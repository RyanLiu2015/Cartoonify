import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import "./Post.css";

import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { Favorite, Chat } from '@material-ui/icons';
import { postRequest } from "../utils.js";

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  img: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: 10,
    marginBottom: 10,
  },
}));

export default function Post({ postId, postAuthor, imageUrl, likeNum, caption, commentNum, postTime, userId, username  }) {
  const [like, setLike] = useState(false);
  const [showPostOnly, setShowPostOnly] = useState(false);

  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  console.log(likeNum);

  const postComment = () => {
    const xhr = new XMLHttpRequest();
    const url = "http://localhost:42069/user";
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    var sendJson = JSON.stringify(
      {
        "dynamic_field": {
          "method": "comment",
          "feed_id": postId,
          "commenter_id": userId * 1,
          "content": comment
        }
      });
    xhr.send(sendJson);
    // var response = JSON.parse(xhr.response);
    // alert(response);

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response);
            // if (response.errcode === 0) {
            //   // setComments(currComments => [...currComments, comment]);
            // }
            
            // alert(xhr.responseText);
        }
    }

    setComment("");
  };

  const handleLike = () => {
    const xhr = new XMLHttpRequest();
    const url = "http://localhost:42069/user";
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    var sendJson = JSON.stringify(
      {
        "dynamic_field": {
          "method": "upvote",
          "fid": postId
        }
      });
    xhr.send(sendJson);
    // var response = JSON.parse(xhr.response);
    // alert(response);

    xhr.onreadystatechange = function() {
        if (this.readyState === 4 && this.status === 200) {
            const response = JSON.parse(xhr.responseText);
            console.log(response.Errcode);
            console.log(response.Errmsg);
            alert(xhr.responseText);
        }
    }
    setLike(true);
  };

  const handleOpen = () => {
    const url = "http://localhost:42069/user";
    var sendJson = JSON.stringify(
      {
        "dynamic_field": {
          "method": "retrieve_comments",
          "fid": postId
        }
      });

    postRequest(url, sendJson, (response) => {
      setComments(
        response.map((cmts) => ({
          username: cmts.commenter_username,
          content: cmts.content,
        }))
      );
    });
    console.log(comments);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };



  const classes = useStyles();

  const showThreeComments = () => {
    if (commentNum > 1 && commentNum < 6) {
      return (
        <div className="post__comments">
          div
        </div>
      );
    } else {
      return (
        <div className="post__comment_counts">
          View all <span>{commentNum - 1}</span> {commentNum == 1 || commentNum == 2 ? "comment" : "comments"}
        </div>
      );
      
    }
  };

  return (
    <div className="post">
      <div className="post__header">
        {/* Header - avatar with username */}
        <Avatar
          className="post__avatar"
          alt={postAuthor}
          src="/static/images/avatar/1.jpg"
        />
        <h3>{postAuthor}</h3>
      </div>

      {/* Image */}
      <img className="post__image" src={imageUrl} alt="" />

      {/* Toolbar */}
      <div className="tool_bar">
        <Favorite 
          onClick={handleLike}
          style={{
            marginRight: 15,
            color: like ? 'red' : '#888'
          }}
        />
        <Chat 
          onClick={() => {}}
          style={{color: '#888'}}
        />
      </div>

      {/* Like Numbers */}
      <div className="like_numbers">
        <span>{like ? likeNum + 1 : likeNum} </span>
        {likeNum == 1 || likeNum == 0 ? "like" : "likes"}
      </div>

      {/* Username + caption */}
      <div className="post__text">
        <strong>{postAuthor}</strong> {caption}
      </div>

      {commentNum > 1 && 
        <div className="post__comment_counts" onClick={handleOpen}>
          View all <span>{commentNum - 1}</span> {commentNum == 1 || commentNum == 2 ? "comment" : "comments"}
        </div>
      }

      <div className="post__time">
          {postTime}
      </div>

      {/* List of comments */}
      {/* {
        <div className={comments.length > 0 ? "post__comments" : ""}>
          {comments.map((cmt) => (
            <p>
              <strong>{comment.username}</strong> {comment.text}
            </p>
          ))}
        </div>
      } */}

      {/* send comment tool bar */}
      <div className="comment__wrapper">
        <TextField
          className="comment__Input"
          id="outlined-multiline-flexible"
          multiline
          maxRows={4}
          type="text"
          placeholder="Add a comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          InputProps={{ disableUnderline: true }}
        />
        <div className={classes.root}>
          <Button
            className="comment__Button"
            disabled={!comment}
            size="small"
            color="primary"

            onClick={postComment}
          >
            Post
          </Button>
        </div>
      </div>

      <Dialog open={dialogOpen} onClose={handleClose} >
        <DialogContent>
          <img src={imageUrl} className={classes.img} />
          <div className="post__comments">
            {comments.map((cmt) => (
              <p>
                <strong>{comment.username}</strong> {comment.content}
              </p>
            ))}
          </div>
          <div className="comment__wrapper">
            <TextField
              className="comment__Input"
              id="outlined-multiline-flexible"
              multiline
              maxRows={4}
              type="text"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              InputProps={{ disableUnderline: true }}
            />
            <div className={classes.root}>
              <Button
                className="comment__Button"
                disabled={!comment}
                size="small"
                color="primary"
                onClick={postComment}
              >
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          {/* <Button onClick={handleShareFeed} color="primary">
            Share
          </Button> */}
        </DialogActions>
      </Dialog>
  
    </div>
  );
}