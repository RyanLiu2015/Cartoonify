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
}

func (obj *UserDataAccessObject) InsertNewFeed(feed Feed) {
	obj.db.Select("author_id", "resource_identifier").Create(&feed)
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
	return ret
}

func (obj *UserDataAccessObject) IncrementFeedUpvote(fid int) {
	var feed Feed
	obj.db.Where(&Feed{Fid: fid}).First(&feed)
	var currentUpvote int = feed.UpvoteCount
	obj.db.Model(&Feed{}).Where("fid = ?", fid).Update("upvote_count", currentUpvote+1)
}
