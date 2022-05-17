package data_access

type Feeds struct {
	author_id           int
	resource_identifier string
	upvote_count        int
	share_count         int
}

func (obj *UserDataAccessObject) InsertNewFeed(feeds Feeds) {
	obj.db.Select("author_id", "resource_identifier", "upvote_count", "share_count").Create(&feeds)
}

func (obj *UserDataAccessObject) DisplayUserFeeds(feeds []Feeds) {
	var page int = 2
	var pageSize int = 5
	var total int = 0
	obj.db.Model(&Feeds{}).Count(&total)

	offset := (page - 1) * pageSize
	obj.db.Order("fid DESC").Offset(offset).Limit(pageSize).Find(&feeds)

	// c.JSON(http.StatusOK, gin.H{
	// 	"code":    200,
	// 	"message": "success",
	// 	"data"   : map[string]interface{}{
	// 		"data" : data,
	// 		"total": total,
	// 		"page" : page,
	// 		"pageSize": pageSize,
	// 	},
	// })
	// return

}
