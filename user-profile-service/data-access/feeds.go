package data_access

import (
	"fmt"
	"strconv"
	"strings"
)

type Feed struct {
	Fid                int    `json:"fid"`
	AuthorId           int    `json:"author_id"`
	AuthorUsername     string `json:"author_username"`
	ResourceIdentifier string `json:"resource_identifier"`
	UpvoteCount        int    `json:"upvote_count"`
	CommentCount       int    `json:"comment_count"`
	ShareCount         int    `json:"share_count"`
	CreatedAt          string `json:"created_at"`

	FirstCommentContent   string `json:"first_comment_content"`
	FirstCommentCommenter string `json:"first_comment_commenter"`
}

type Comment struct {
	Cid               int    `json:"cid"`
	FeedId            int    `json:"feed_id"`
	CommenterId       int    `json:"commenter_id"`
	CommenterUsername string `json:"commenter_username"`
	Content           string `json:"content"`
	CreatedAt         string `json:"created_at"`
}

// InsertNewFeed return feed id
func (obj *UserDataAccessObject) InsertNewFeed(feed Feed) int {
	obj.db.Select("author_id", "resource_identifier").Create(&feed)
	var reSelectFeed Feed
	obj.db.Where(&Feed{AuthorId: feed.AuthorId}).Order("created_at DESC").First(&reSelectFeed)
	return reSelectFeed.Fid
}

func (obj *UserDataAccessObject) GetFeedsByPage(page int) []Feed {
	var ret []Feed
	obj.db.Raw("SELECT * FROM feeds ORDER BY created_at DESC LIMIT ?, 10", (page-1)*10).Scan(&ret)
	authorIdList := make([]string, len(ret))
	for i, elem := range ret {
		authorIdList[i] = strconv.Itoa(elem.AuthorId)
	}
	// find usernames using author_ids
	for i := 0; i < len(ret); i = i + 1 {
		var thisAuthor User
		obj.db.Raw(fmt.Sprintf("SELECT * FROM users WHERE uid = %s", authorIdList[i])).Scan(&thisAuthor)
		ret[i].AuthorUsername = thisAuthor.Username
	}
	for i := 0; i < len(ret); i = i + 1 {
		thisFirstComment, err := obj.GetFirstComment(ret[i].Fid)
		if err != nil {
			fmt.Println(err)
			continue
		}
		ret[i].FirstCommentContent = thisFirstComment.Content
		var thisUser User
		obj.db.Table("users").Where(&User{Uid: thisFirstComment.CommenterId}).First(&thisUser)
		ret[i].FirstCommentCommenter = thisUser.Username
		fmt.Printf("%s : %s", ret[i].FirstCommentCommenter, ret[i].FirstCommentContent)
	}
	return ret
}

func (obj *UserDataAccessObject) IncrementFeedUpvoteCount(fid int) {
	var feed Feed
	obj.db.Where(&Feed{Fid: fid}).First(&feed)
	var currentUpvoteCount int = feed.UpvoteCount
	obj.db.Model(&Feed{}).Where("fid = ?", fid).Update("upvote_count", currentUpvoteCount+1)
}

func (obj *UserDataAccessObject) IncrementFeedCommentCount(fid int) {
	var feed Feed
	obj.db.Where(&Feed{Fid: fid}).First(&feed)
	var currentCommentCount int = feed.CommentCount
	obj.db.Model(&Feed{}).Where("fid = ?", fid).Update("comment_count", currentCommentCount+1)
}

func (obj *UserDataAccessObject) GetFirstComment(fid int) (*Comment, error) {
	var firstComment Comment
	err := obj.db.Where(&Comment{FeedId: fid}).Order("created_at ASC").First(&firstComment).Error
	//if obj.db.RowsAffected != 1 {
	//	return nil, errors.New(fmt.Sprintf("error retrieving first comment, rows affected =%d", obj.db.RowsAffected))
	//}
	return &firstComment, err
}

func (obj *UserDataAccessObject) InsertNewComment(comment Comment) {
	// insert new entry in comment database
	obj.db.Select("feed_id", "commenter_id", "content").Create(&comment)
	// update comment count
	obj.IncrementFeedCommentCount(comment.FeedId)
}

func (obj *UserDataAccessObject) RetrieveCommentsByFeed(fid int) []Comment {
	var ret []Comment
	obj.db.Raw("SELECT * FROM comments WHERE feed_id = ?", fid).Scan(&ret)
	commenterIdList := make([]string, len(ret))
	for i, elem := range ret {
		commenterIdList[i] = strconv.Itoa(elem.CommenterId)
	}
	// find usernames using author_ids
	var commenters []User
	obj.db.Raw(fmt.Sprintf("SELECT * from users WHERE uid IN (%s)", strings.Join(commenterIdList, ","))).Scan(&commenters)
	for i := 0; i < len(ret); i = i + 1 {
		ret[i].CommenterUsername = commenters[i].Username
	}
	return ret
}
