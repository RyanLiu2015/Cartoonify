package data_access

import (
	"errors"
	"fmt"
	"gorm.io/driver/mysql"
	"gorm.io/gorm"
)

type MysqlConfig struct {
	Host     string `toml:"host"`
	Port     int    `toml:"port"`
	User     string `toml:"user"`
	Password string `toml:"password"`
	DBName   string `toml:"dbname"`
}

type User struct {
	Uid      int
	Username string
	Password string
	Email    string
}

type UserDataAccessObject struct {
	db *gorm.DB
}

func InitializeDatabase(conf MysqlConfig) (*UserDataAccessObject, error) {
	dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local", conf.User, conf.Password, conf.Host, conf.Port, conf.DBName)
	db, err := gorm.Open(mysql.Open(dsn), &gorm.Config{})
	if err != nil {
		return nil, err
	}
	return &UserDataAccessObject{
		db,
	}, nil
}

// InsertNewUser returns uid
func (obj *UserDataAccessObject) InsertNewUser(inUser User) int {
	obj.db.Select("Username", "Password", "Email").Create(&inUser)
	var outUser User
	obj.db.Where("username = ?", fmt.Sprintf(inUser.Username)).First(&outUser)
	return outUser.Uid
}

// ValidateExistingUser returns uid
func (obj *UserDataAccessObject) ValidateExistingUser(inUser User) (int, error) {
	var outUser User
	result := obj.db.Where("username = ?", fmt.Sprintf(inUser.Username)).First(&outUser)
	if result.RowsAffected == 0 {
		return -1, errors.New(fmt.Sprintf("username '%s' not found\n", inUser.Username))
	} else if outUser.Password != inUser.Password {
		return -1, errors.New("password hash don't match")
	}
	return outUser.Uid, nil
}
