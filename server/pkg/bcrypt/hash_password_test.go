package bcrypt

import "testing"

func TestHashAndCheckPassword(t *testing.T) {
	password := "waysbeans-secret"
	hashed, err := HashingPassword(password)
	if err != nil {
		t.Fatalf("HashingPassword failed: %v", err)
	}

	if !CheckPasswordHash(password, hashed) {
		t.Fatalf("expected password %q to match hash %q", password, hashed)
	}

	if CheckPasswordHash("wrong-password", hashed) {
		t.Fatalf("expected wrong password to fail check")
	}
}
