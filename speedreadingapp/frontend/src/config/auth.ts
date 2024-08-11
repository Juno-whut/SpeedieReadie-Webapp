import { getAuth, onAuthStateChanged, User } from "firebase/auth";

const auth = getAuth();

onAuthStateChanged(auth, (user: User | null) => {
  if (user) {
    // User is signed in
    console.log("User is authenticated", user);
  } else {
    // User is not signed in
    console.log("User is not authenticated");
  }
});