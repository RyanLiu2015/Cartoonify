package handlers

import (
	"bytes"
	"encoding/json"
	data_access "github.com/RyanLiu2015/Cartoonify/user-profile-serivce/data-access"
	"io"
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

//type FeedProfileParams struct {
//	Method          string          `json:"method"`
//	FeedCredentials FeedCredentials `json:"feed-credentials"`
//}
//
//
//type UserProfileParams struct {
//	Method          string          `json:"method"`
//	UserCredentials UserCredentials `json:"user-credentials"`
//}
//
//type UserProfileRet struct {
//	Errcode int
//	Errmsg  string
//}
//

type UserCredentials struct {
	Method   string `json:"method"`
	Username string `json:"username"`
	Password string `json:"password"`
	Email    string `json:"email"`
}

type FeedCredentials struct {
	Method             string `json:"method"`
	AuthorId           int    `json:"author_id"`
	ResourceIdentifier string `json:"resource_identifier"`
	UpvoteCount        int    `json:"upvote_count"`
	ShareCount         int    `json:"share_count"`
}

type Params struct {
	//SomeData     string      `json:"some-data"`
	DynamicField DynamicType `json:"dynamic-field"`
	//OtherData    string      `json:"other-data"`
}

type DynamicType struct {
	Value interface{}
}

// UnmarshalJSON will be called by json.Unmarshal
// https://stackoverflow.com/questions/53453782/unmarshal-dynamic-json-based-on-a-type-key
func (d *DynamicType) UnmarshalJSON(data []byte) error {
	var method struct {
		Method string `json:"method"`
	}
	if err := json.Unmarshal(data, &method); err != nil {
		return err
	}
	switch method.Method {
	case "signup":
		d.Value = new(UserCredentials)
	case "signin":
		d.Value = new(UserCredentials)
	case "postnew":
		d.Value = new(FeedCredentials)
	}
	return json.Unmarshal(data, d.Value)
}

// ServeHTTP is the main entry point for the handler and satisfies the http.Handler
// interface
func (p *ProfileHandler) ServeHTTP(rw http.ResponseWriter, req *http.Request) {

	p.l.Println("ServerHTTP function")

	rw.Header().Set("Access-Control-Allow-Origin", "*")
	rw.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
	rw.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	rw.WriteHeader(http.StatusOK)

	if req.Method == http.MethodPost {
		p.l.Println("post received")
		b, err := io.ReadAll(req.Body)
		if err != nil {
			p.l.Fatalln(err)
		}
		p.l.Println(string(b))

		params := new(Params)
		if err := json.Unmarshal(b, params); err != nil {
			panic(err)
		}
		p.l.Printf("%+v - %#v\n", params, params.DynamicField.Value)

		// type switch
		switch params.DynamicField.Value.(type) {
		case *UserCredentials:
			p.l.Println("switch user credentials")
			userCredentials := *params.DynamicField.Value.(*UserCredentials)
			if userCredentials.Method == "signup" {
				p.SignUp(rw, req, userCredentials)
			} else if userCredentials.Method == "signin" {
				p.SignIn(rw, req, userCredentials)
			}
		case *FeedCredentials:
			feedCredentials := *params.DynamicField.Value.(*FeedCredentials)
			if feedCredentials.Method == "postnew" {
				p.PostNewFeed(rw, req, feedCredentials)
			}
			p.l.Println("switch feed credentials")
		default:
			p.l.Fatalln("unknown type")
		}
		return
	}
	// catch all
	// if no method is satisfied return an error
	rw.WriteHeader(http.StatusMethodNotAllowed)
}

// SignUp returns the products from the data store
func (p *ProfileHandler) SignUp(rw http.ResponseWriter, req *http.Request, credentials UserCredentials) {
	p.dao.InsertNewUser(data_access.User{
		Username: credentials.Username,
		Password: credentials.Password,
		Email:    credentials.Email,
	})

	// write response body
	ret := map[string]string{
		"errcode": "0",
		"errmsg":  "ok",
	}
	retJson, _ := json.Marshal(ret)
	rw.Write(retJson)
}

func (p *ProfileHandler) SignIn(rw http.ResponseWriter, req *http.Request, credentials UserCredentials) {
	_, err := p.dao.ValidateExistingUser(data_access.User{
		Username: credentials.Username,
		Password: credentials.Password,
	})
	// write response body
	ret := map[string]string{
		"errcode": "0",
		"errmsg":  "ok",
	}
	if err != nil {
		ret["errcode"] = "1"
		ret["errmsg"] = err.Error()
	}
	retJson, _ := json.Marshal(ret)
	rw.Write(retJson)
}

func (p *ProfileHandler) PostNewFeed(rw http.ResponseWriter, req *http.Request, credentials FeedCredentials) {
	p.dao.InsertNewFeed(data_access.Feed{
		AuthorId:           credentials.AuthorId,
		ResourceIdentifier: credentials.ResourceIdentifier,
	})
	// write response body
	ret := map[string]string{
		"errcode": "0",
		"errmsg":  "ok",
	}
	b := new(bytes.Buffer)
	json.NewEncoder(b).Encode(ret)
	rw.Write(b.Bytes())
}

func (p *ProfileHandler) RetrieveFeedsByPage(rw http.ResponseWriter, req *http.Request, credentials FeedCredentials) {

}
