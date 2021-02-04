import React, { useEffect, useRef } from 'react';
import firebase from 'firebase';
import * as firebaseui from 'firebaseui';
import 'firebaseui/dist/firebaseui.css';

const ELEMENT_ID = 'firebaseui-auth-container';

const FirebaseAuth = ({ uiConfig, firebaseAuth }) => {
    const refFirebaseUiWidget = useRef();

    useEffect(() => {
        const uiWidget = new firebaseui.auth.AuthUI(firebase.auth());

        uiWidget.start(refFirebaseUiWidget.current, {
            signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
            // Other config options...
        });
    }, []);

    return <div className="firebase-auth" ref={refFirebaseUiWidget} />;
};

export default FirebaseAuth;
