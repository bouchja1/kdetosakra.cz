import firebase from 'firebase/app';
import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

import { firebaseConfig } from '../constants/firebase';
import { generateRandomRadius, getRandomNickname } from '../util';

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

const COLLECTION_BATTLE = 'battle';
const COLLECTION_BATTLE_PLAYERS = 'players';
const COLLECTION_BATTLE_ROUNDS = 'battleRounds';
const COLLECTION_PLAYER_ROUNDS = 'playerRounds';

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
        radius: radius ?? generateRandomRadius(), // maybe not necessary here
        selectedCity: selectedCity ?? null,
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
        .collection(COLLECTION_BATTLE_PLAYERS)
        .onSnapshot(observer);
};

export const streamBattleRoundsDetail = (battleId, observer) => {
    return db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .collection(COLLECTION_BATTLE_ROUNDS)
        .onSnapshot(observer);
};

export const streamBattleDetail = (battleId, observer) => {
    return db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .onSnapshot(observer);
};

export const getBattleDetail = battleId => {
    return db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .get();
};

export const getBattlePlayers = battleId => {
    return db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .collection(COLLECTION_BATTLE_PLAYERS)
        .get();
};

export const getBattleRounds = battleId => {
    return db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .collection(COLLECTION_BATTLE_ROUNDS)
        .get();
};

export const getSingleBattlePlayer = (battleId, playerId) => {
    return db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .collection(COLLECTION_BATTLE_PLAYERS)
        .doc(playerId)
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
                    .collection(COLLECTION_BATTLE_PLAYERS)
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
                    .collection(COLLECTION_BATTLE_PLAYERS)
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

export const addRoundToBattleRounds = (battleId, newRound) => {
    return db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .collection(COLLECTION_BATTLE_ROUNDS)
        .add(newRound);
};

export const addRoundBatchToBattleRounds = async (battleId, roundsArray) => {
    const batch = db.batch();
    roundsArray.forEach(doc => {
        const docRef = db
            .collection(COLLECTION_BATTLE)
            .doc(battleId)
            .collection(COLLECTION_BATTLE_ROUNDS)
            .doc(); // automatically generate unique id
        batch.set(docRef, doc);
    });
    // Commit the batch
    return batch
        .commit()
        .then(res => {
            console.log('JOOOO BATCH COMMITNUTA: ', res);
        })
        .catch(err => console.log('EEER BATCH: ', err));
};

export const addGuessedRoundToPlayer = (battleId, playerId, newRound) => {
    return db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .collection(COLLECTION_BATTLE_PLAYERS)
        .doc(playerId)
        .collection(COLLECTION_PLAYER_ROUNDS)
        .add(newRound);
};

export const updateBattleRound = (battleId, roundId, itemsToUpdate) => {
    const battleRoundToUpdate = db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .collection(COLLECTION_BATTLE_ROUNDS)
        .where('roundId', '==', roundId);
    // .update(itemsToUpdate);

    return battleRoundToUpdate.get().then(querySnapshot => {
        console.log('querySnapshot doc: ', querySnapshot);
        console.log('querySnapshot size: ', querySnapshot.size);
        console.log('querySnapshot empty: ', querySnapshot.empty);
        return querySnapshot.update(itemsToUpdate);
    });
};

export const deleteNotPreparedBattlePlayers = battleId => {
    const notReadyPlayers = db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .collection(COLLECTION_BATTLE_PLAYERS)
        .where('isReady', '==', false);

    return notReadyPlayers.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            doc.ref.delete();
        });
    });
};
