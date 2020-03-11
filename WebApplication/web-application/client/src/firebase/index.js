import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/storage';
import 'firebase/firestore';
import config from './config';

if (!firebase.apps.length){
    firebase.initializeApp(config);
}

export default firebase;