package data_access

type Feed struct {
	AuthorId           int
	ResourceIdentifier string
	UpvoteCount        int
	CommentCount       int
	ShareCount         int
	CreatedAt          string
}

func (obj *UserDataAccessObject) InsertNewFeed(feed Feed) {
	obj.db.Select("author_id", "resource_identifier").Create(&feed)
}

func (obj *UserDataAccessObject) DisplayUserFeeds(page int) []Feed {
	var ret []Feed
	obj.db.Raw("SELECT * from user order by created_at desc limit ?, 10", page*10).Scan(&ret)
	return ret
}
