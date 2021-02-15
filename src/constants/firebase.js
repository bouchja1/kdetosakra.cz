import firebase from 'firebase/app';

export const firebaseUiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/signedIn',
    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID, firebase.auth.FacebookAuthProvider.PROVIDER_ID],
};

export const firebaseConfig = {
    apiKey: window._env_.REACT_APP_FIREBASE_API_KEY,
    authDomain: window._env_.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: window._env_.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: window._env_.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: window._env_.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
    appId: window._env_.REACT_APP_FIREBASE_APP_ID,
    measurementId: window._env_.REACT_APP_FIREBASE_MEASUREMENT_ID,
};
