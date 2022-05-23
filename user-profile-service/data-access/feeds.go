package data_access

import (
	"fmt"
	"strconv"
	"strings"
)

type Feed struct {
	Fid                int    `json:"fid"`
	AuthorId           int    `json:"author-id"`
	AuthorUsername     string `json:"author-username"`
	ResourceIdentifier string `json:"resource-identifier"`
	UpvoteCount        int    `json:"upvote-count"`
	CommentCount       int    `json:"comment-count"`
	ShareCount         int    `json:"share-count"`
	CreatedAt          string `json:"created-at"`

	FirstCommentContent   string `json:"first-comment-content"`
	FirstCommentCommenter string `json:"first-comment-commenter"`
}

type Comment struct {
	Cid         int    `json:"cid"`
	FeedId      int    `json:"feed-id"`
	CommenterId int    `json:"commenter-id"`
	Content     string `json:"content"`
	CreatedAt   string `json:"created-at"`
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
	var authors []User
	obj.db.Raw(fmt.Sprintf("SELECT * from users WHERE uid IN (%s)", strings.Join(authorIdList, ","))).Scan(&authors)
	for i := 0; i < len(ret); i = i + 1 {
		ret[i].AuthorUsername = authors[i].Username
	}
	//for _, elem := range ret {
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

func (obj *UserDataAccessObject) IncrementFeedUpvote(fid int) {
	var feed Feed
	obj.db.Where(&Feed{Fid: fid}).First(&feed)
	var currentUpvote int = feed.UpvoteCount
	obj.db.Model(&Feed{}).Where("fid = ?", fid).Update("upvote_count", currentUpvote+1)
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
	obj.db.Select("feed_id", "commenter_id", "content").Create(&comment)
}

//func RetrieveCommentsByFeed(fid int) []Comment {
//
//}
