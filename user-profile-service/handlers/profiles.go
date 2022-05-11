package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/RyanLiu2015/Cartoonify/user-profile-serivce/data-access"
	"log"
	"net/http"
)

// ProfileHandler is a http.Handler
type ProfileHandler struct {
	l   *log.Logger
	dao *data_access.UserDataAccessObject
}

// NewProfileHandler creates a product handler with the given logger
func NewProfileHandler(l *log.Logger, dao *data_access.UserDataAccessObject) *ProfileHandler {
	return &ProfileHandler{
		l,
		dao,
	}
}

type UserCredentials struct {
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type UserProfileParams struct {
	Method          string          `json:"method"`
	UserCredentials UserCredentials `json:"user-credentials"`
}

type UserProfileRet struct {
	Errcode int
	Errmsg  string
}

// ServeHTTP is the main entry point for the handler and satisfies the http.Handler
// interface
func (p *ProfileHandler) ServeHTTP(rw http.ResponseWriter, req *http.Request) {

	//fmt.Println("ServerHTTP function")
	//b, err := io.ReadAll(req.Body)
	//if err != nil {
	//	p.l.Fatalln(err)
	//}
	//fmt.Println(string(b))

	rw.Header().Set("Access-Control-Allow-Origin", req.Header.Get("Origin"))
	rw.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	if req.Method == http.MethodPost {
		fmt.Println("post received lmao")
		decoder := json.NewDecoder(req.Body)
		var userProfileParams UserProfileParams
		err := decoder.Decode(&userProfileParams)
		if err != nil {
			p.l.Printf("error decoding body json: %s", err)
		}
		//fmt.Printf("method=%s\n", userProfileParams.Method)
		//fmt.Printf("username=%s\n", userProfileParams.UserCredentials.Username)
		//fmt.Printf("password=%s\n", userProfileParams.UserCredentials.Password)
		//fmt.Printf("email=%s\n", userProfileParams.UserCredentials.Email)

		if userProfileParams.Method == "signup" {
			fmt.Println("calling signup function")
			p.Signup(rw, req, userProfileParams.UserCredentials)
		} else if userProfileParams.Method == "signin" {
			fmt.Println("calling signin function")
			p.SignIn(rw, req, userProfileParams.UserCredentials)
		}
		return
	}

	// catch all
	// if no method is satisfied return an error
	rw.WriteHeader(http.StatusMethodNotAllowed)
}

// Signup returns the products from the data store
func (p *ProfileHandler) Signup(rw http.ResponseWriter, req *http.Request, cred UserCredentials) {
	p.dao.InsertNewUser(data_access.User{
		Username: cred.Username,
		Password: cred.Password,
		Email:    cred.Email,
	})

	// write response body
	ret := UserProfileRet{
		0, "ok",
	}
	b := new(bytes.Buffer)
	json.NewEncoder(b).Encode(ret)
	rw.Write(b.Bytes())
}

func (p *ProfileHandler) SignIn(rw http.ResponseWriter, req *http.Request, cred UserCredentials) {
	_, err := p.dao.ValidateExistingUser(data_access.User{
		Username: cred.Username,
		Password: cred.Password,
	})
	// write response body
	ret := UserProfileRet{
		0, "ok",
	}
	if err != nil {
		ret.Errcode = 1
		ret.Errmsg = err.Error()
	}
	b := new(bytes.Buffer)
	json.NewEncoder(b).Encode(ret)
	rw.Write(b.Bytes())
}

func (p *ProfileHandler) PostNewFeed(rw http.ResponseWriter, req *http.Request) {

}
