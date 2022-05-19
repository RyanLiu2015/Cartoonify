package main

import (
	"github.com/RyanLiu2015/Cartoonify/user-profile-serivce/data-access"
)

type tomlConfig struct {
	ServiceName  string                  `toml:"service-name"`
	ServerConfig serverConfig            `toml:"server"`
	MysqlConfig  data_access.MysqlConfig `toml:"mysql"`
}

type serverConfig struct {
	Host string `toml:"host"`
	Port int    `toml:"port"`
}
