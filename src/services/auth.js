import firebase from 'firebase/app';
import 'firebase/auth';

const firebaseConfig = {
  // Your Firebase configuration here
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();

export const signIn = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password);
};

export const signUp = (email, password) => {
  return auth.createUserWithEmailAndPassword(email, password);
};

export const signOut = () => {
  return auth.signOut();
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};
