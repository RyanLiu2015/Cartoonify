package handlers

import (
	"log"
)

// Profiles is a http.Handler
type Profiles struct {
	l *log.Logger
}

// NewProducts creates a products handler with the given logger
func NewProfiles(l *log.Logger) *Profiles {
	return &Profiles{
		l,
	}
}
