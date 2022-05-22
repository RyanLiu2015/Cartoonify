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

func (obj *UserDataAccessObject) InsertNewUser(user User) {
	obj.db.Select("Username", "Password", "Email").Create(&user)
}

func (obj *UserDataAccessObject) ValidateExistingUser(inUser User) (bool, error) {
	var outUser User
	result := obj.db.Where("username = ?", fmt.Sprintf(inUser.Username)).First(&outUser)
	if result.RowsAffected == 0 {
		return false, errors.New(fmt.Sprintf("username '%s' not found\n", inUser.Username))
	} else if outUser.Password != inUser.Password {
		return false, errors.New("password hash don't match")
	}
	return true, nil
}
