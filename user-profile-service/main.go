package main

import (
	"context"
	"fmt"
	"github.com/BurntSushi/toml"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/RyanLiu2015/Cartoonify/user-profile-serivce/data-access"
	"github.com/RyanLiu2015/Cartoonify/user-profile-serivce/handlers"
	"github.com/gorilla/mux"
)

func readConfig() tomlConfig {
	f := "config.toml"
	var conf tomlConfig
	_, err := toml.DecodeFile(f, &conf)
	if err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}

	mysqlConf := conf.MysqlConfig
	serverConf := conf.ServerConfig

	fmt.Println("Server config:")
	fmt.Printf("Host: %s\n", serverConf.Host)
	fmt.Printf("Port: %d\n", serverConf.Port)

	fmt.Println("Mysql config:")
	fmt.Printf("Host: %s\n", mysqlConf.Host)
	fmt.Printf("Port: %d\n", mysqlConf.Port)
	fmt.Printf("User: %s\n", mysqlConf.User)
	fmt.Printf("Password: %s\n", mysqlConf.Password)
	fmt.Printf("DB Name: %s\n", mysqlConf.DBName)
	return conf
}

func main() {

	fmt.Println("Initializing user profile service... ")
	l := log.New(os.Stdout, "[User Profile Service] ", log.LstdFlags)

	conf := readConfig()

	dao, err := data_access.InitializeDatabase(conf.MysqlConfig)
	if err != nil {
		l.Printf("Error Initializing database access: %s\n", err)
		os.Exit(1)
	}
	//dao.InsertNewUser(data_access.User{
	//	Username: "Jimmy",
	//	Password: "Hash",
	//	Email:    "jimmy@123.com",
	//})

	addr := fmt.Sprintf("%s:%d", conf.ServerConfig.Host, conf.ServerConfig.Port)

	// profiles handler
	ph := handlers.NewProfileHandler(l, dao)

	router := mux.NewRouter()
	router.Handle("/user", ph)

	// create a new server
	s := http.Server{
		Addr:         addr,              // configure the bind address
		Handler:      router,            // set the default handler
		ErrorLog:     l,                 // set the logger for the server
		ReadTimeout:  5 * time.Second,   // max time to read request from the client
		WriteTimeout: 10 * time.Second,  // max time to write response to the client
		IdleTimeout:  120 * time.Second, // max time for connections using TCP Keep-Alive

	}

	// start the server
	go func() {
		l.Printf("Starting server %s on Port %d", conf.ServerConfig.Host, conf.ServerConfig.Port)

		err := s.ListenAndServe()
		if err != nil {
			l.Printf("Error starting server: %s\n", err)
			os.Exit(1)
		}
	}()

	// trap sigterm or interrupt and gracefully shutdown the server
	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	signal.Notify(c, os.Kill)

	// Block until a signal is received.
	sig := <-c
	log.Println("Got signal:", sig)

	// gracefully shutdown the server, waiting max 30 seconds for current operations to complete
	ctx, _ := context.WithTimeout(context.Background(), 30*time.Second)
	s.Shutdown(ctx)

}
