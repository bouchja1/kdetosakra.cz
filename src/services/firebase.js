import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

import { firebaseConfig } from '../constants/firebase';
import { generateRandomRadius, getRandomNickname } from '../util';

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

// TODo auth, gets, posts...

const COLLECTION_BATTLE = 'battle';

export const getBattleDetail = battleId => {
    return db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .get();
};

/**
 * Create a new battle with default setup. Returns documentId of created battle.
 * @param authorId
 * @param mode
 * @returns {Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>>}
 */
export const createBattle = (authorId, mode, radius, selectedCity) => {
    return db.collection(COLLECTION_BATTLE).add({
        created: firebase.firestore.FieldValue.serverTimestamp(),
        createdBy: authorId,
        mode,
        rounds: [],
        radius: radius ?? generateRandomRadius(), // maybe not necessary here
        selectedCity: selectedCity ?? null,
        isGameActive: true,
        isGameStarted: false,
        isGameFinishedSuccessfully: false,
        countdown: 60,
        withCountdown: true,
    });
};

export const updateBattle = (battleId, itemsToUpdate) => {
    return db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .update(itemsToUpdate);
};

export const streamBattlePlayersDetail = (battleId, observer) => {
    return db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .collection('players')
        .onSnapshot(observer);
};

export const streamBattleDetail = (battleId, observer) => {
    return db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .onSnapshot(observer);
};

export const getBattlePlayers = battleId => {
    return db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .collection('players')
        .get();
};

export const updateBattlePlayer = (battleId, userId, itemsToUpdate) => {
    return getBattlePlayers(battleId)
        .then(querySnapshot => querySnapshot.docs)
        .then(battlePlayers => battlePlayers.find(player => player.data().userId === userId))
        .then(matchingPlayer => {
            if (matchingPlayer) {
                return db
                    .collection(COLLECTION_BATTLE)
                    .doc(battleId)
                    .collection('players')
                    .doc(matchingPlayer.id)
                    .update(itemsToUpdate);
            }
            throw new Error('user-not-found-error');
        });
};

export const addPlayerToBattle = (newPlayer, battleId) => {
    const { name, userId } = newPlayer;
    return getBattlePlayers(battleId)
        .then(querySnapshot => querySnapshot.docs)
        .then(querySnapshotDocs => querySnapshotDocs.map(x => x.data()))
        .then(mappedBattlePlayers => {
            const matchingPlayer = mappedBattlePlayers.filter(player => player.userId === userId);
            const existingNickname = mappedBattlePlayers.filter(player => player.name === name);
            if (matchingPlayer.length === 0) {
                return db
                    .collection(COLLECTION_BATTLE)
                    .doc(battleId)
                    .collection('players')
                    .add({
                        name: existingNickname.length ? getRandomNickname() : name,
                        joined: firebase.firestore.FieldValue.serverTimestamp(),
                        userId,
                        isReady: false,
                        totalScore: 0,
                    });
            }
            throw new Error('duplicate-item-error');
        });
};
