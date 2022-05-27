import React, { useState, useEffect } from "react";
import { makeStyles } from '@material-ui/core/styles';
import "./Post.css";

import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';

import { Favorite, Chat } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export default function Post({ postId, postAuthor, imageUrl, likeNum, caption, commentNum, postTime, userId, username  }) {
  const [like, setLike] = useState(false);
  const [showPostOnly, setShowPostOnly] = useState(false);

  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");

  // useEffect(() => {
  //   let unsubscribe;

  //   if (postId) {
  //     unsubscribe = db
  //       .collection("posts")
  //       .doc(postId)
  //       .collection("comments")
  //       .orderBy("timestamp", "desc")
  //       .onSnapshot((snapshot) => {
  //         setComments(snapshot.docs.map((doc) => doc.data()));
  //       });
  //   }

  //   return () => {
  //     unsubscribe();
  //   };
  // }, [postId]);

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
          "commenter_id": userId,
          "content": comment
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
    setComment("");
  };

  const handleLike = () => {
    const xhr = new XMLHttpRequest();
    const url = "http://localhost:42069/user";
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json');
    var sendJson = JSON.stringify(
      {
        "dynamic-field": {
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

  const classes = useStyles();

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

      <div className="post__comment_counts">

      </div>

      <div className="post__time">

      </div>

      {/* <div style={{
        padding: '0 20px',
        paddingBottom: 20
      }}>
        <TextField
          id="outlined-multiline-flexible"
          label="Comment"
          multiline
          maxRows={4}
          style={{
            width: '100%',
            marginBottom: 30
          }}
          value={comment}
          onChange={(e) => {
            setComment(e.target.value)
          }}
          InputProps={{ disableUnderline: true }}
        />
        <Button onClick={() => {
          let deepComments = [...comments];
          deepComments.push({
            username: 'admin',
            text: comment
          })
          setComments(deepComments)
          
        }} size="small" color="primary" variant="contained">publish</Button>
      </div> */}

      {/* List of comments */}
      {
        <div className={comments.length > 0 ? "post__comments" : ""}>
          {comments.map((comment) => (
            <p>
              <strong>{comment.username}</strong> {comment.text}
            </p>
          ))}
        </div>
      }

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
    </div>
  );
}