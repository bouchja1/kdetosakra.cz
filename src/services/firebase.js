import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

import { firebaseConfig } from '../constants/firebase';

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

// TODo auth, gets, posts...
