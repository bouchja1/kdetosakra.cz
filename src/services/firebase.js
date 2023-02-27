import 'firebase/analytics';
import 'firebase/auth';
import 'firebase/firestore';

import firebase from 'firebase/app';

import { firebaseConfig } from '../constants/firebase';
import { MAX_ALLOWED_BATTLE_PLAYERS } from '../constants/game';
import { DuplicatedBattlePlayerError, MaxBattleCapacityExhaustedError, NotFoundBattlePlayerError } from '../errors';
import { generateRandomRadius, getRandomNickname } from '../util';

firebase.initializeApp(firebaseConfig);
firebase.analytics();
const db = firebase.firestore();

const COLLECTION_BATTLE = 'battle';
const COLLECTION_BATTLE_PLAYERS = 'players';
const COLLECTION_BATTLE_ROUNDS = 'battleRounds';

/**
 * Create a new battle with default setup. Returns documentId of created battle.
 * @param authorId
 * @param mode
 * @returns {Promise<firebase.firestore.DocumentReference<firebase.firestore.DocumentData>>}
 */
export const createBattle = (authorId, mode, radius, selectedCity, guessResultMode, regionNutCode = null) => {
    return db.collection(COLLECTION_BATTLE).add({
        created: firebase.firestore.FieldValue.serverTimestamp(),
        createdById: authorId,
        mode,
        radius: radius ?? generateRandomRadius(), // maybe not necessary here
        selectedCity: selectedCity ?? null,
        isGameStarted: false,
        countdown: 60,
        withCountdown: true,
        round: 0, // current round
        currentRoundStart: 0,
        regionNutCode,
        guessResultMode,
    });
};

export const updateBattle = async (battleId, itemsToUpdate) => {
    return db.collection(COLLECTION_BATTLE).doc(battleId).update(itemsToUpdate);
};

export const streamBattlePlayersDetail = (battleId, observer) => {
    return db.collection(COLLECTION_BATTLE).doc(battleId).collection(COLLECTION_BATTLE_PLAYERS).onSnapshot(observer);
};

export const streamBattleRoundsDetail = (battleId, observer) => {
    return db.collection(COLLECTION_BATTLE).doc(battleId).collection(COLLECTION_BATTLE_ROUNDS).onSnapshot(observer);
};

export const streamBattleDetail = (battleId, observer) => {
    return db.collection(COLLECTION_BATTLE).doc(battleId).onSnapshot(observer);
};

export const getBattleDetail = battleId => {
    return db.collection(COLLECTION_BATTLE).doc(battleId).get();
};

export const getBattlePlayers = battleId => {
    return db.collection(COLLECTION_BATTLE).doc(battleId).collection(COLLECTION_BATTLE_PLAYERS).get();
};

/**
 * Update that a player is ready to start a battle round
 * @param battleId
 * @param userId
 * @param itemsToUpdate
 * @returns {Promise<firebase.firestore.QueryDocumentSnapshot<firebase.firestore.DocumentData>>}
 */
export const updateBattlePlayer = async (battleId, userId, itemsToUpdate) => {
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
            throw new NotFoundBattlePlayerError(`User with id ${userId} was not found in the battle ${battleId}.`);
        });
};

/**
 * When a player opens the link with invitation.
 * @param newPlayer
 * @param battleId
 * @returns {Promise<firebase.firestore.DocumentData[]>}
 */
export const addPlayerToBattle = (newPlayer, battleId) => {
    const { name, userId, isReady } = newPlayer;
    return getBattlePlayers(battleId)
        .then(querySnapshot => querySnapshot.docs)
        .then(querySnapshotDocs => querySnapshotDocs.map(x => x.data()))
        .then(mappedBattlePlayers => {
            const matchingPlayer = mappedBattlePlayers.filter(player => player.userId === userId);
            const existingNickname = mappedBattlePlayers.filter(player => player.name === name);
            if (matchingPlayer.length) {
                throw new DuplicatedBattlePlayerError(`Duplicated player with ID ${userId}`);
            } else if (mappedBattlePlayers.length >= MAX_ALLOWED_BATTLE_PLAYERS) {
                throw new MaxBattleCapacityExhaustedError('Battle capacity was exhausted.');
            } else {
                return db
                    .collection(COLLECTION_BATTLE)
                    .doc(battleId)
                    .collection(COLLECTION_BATTLE_PLAYERS)
                    .add({
                        name: existingNickname.length ? getRandomNickname() : name,
                        joined: firebase.firestore.FieldValue.serverTimestamp(),
                        userId,
                        isReady,
                    });
            }
        });
};

/**
 * Called by the creator when is clicks the 'I am ready button' before a battle is started
 * @param battleId
 * @param roundsArray
 * @returns {Promise<void>}
 */
export const addRoundBatchToBattleRounds = async (battleId, roundsArray) => {
    const batch = db.batch();
    roundsArray.forEach(doc => {
        const docRef = db.collection(COLLECTION_BATTLE).doc(battleId).collection(COLLECTION_BATTLE_ROUNDS).doc(); // automatically generate unique id
        batch.set(docRef, doc);
    });
    // Commit the batch
    return batch
        .commit()
        .then(res => {
            console.info('Rounds batch commited successfully.');
        })
        .catch(err => {
            console.error('addRoundBatchToBattleRounds: ', err);
        });
};

/**
 * Called by the player after his guess
 * @param battleId
 * @param playerDocumentId
 * @param newRound
 * @returns {Promise<void>}
 */
export const addGuessedRoundToPlayer = (battleId, playerDocumentId, newRound) => {
    return db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .collection(COLLECTION_BATTLE_PLAYERS)
        .doc(playerDocumentId)
        .update(newRound);
};

/**
 * updated by the first player who guess a round
 * @param battleId
 * @param roundId
 * @param itemsToUpdate
 * @returns {*}
 */
export const updateBattleRound = (battleId, roundId, itemsToUpdate) => {
    const battleRoundToUpdate = db
        .collection(COLLECTION_BATTLE)
        .doc(battleId)
        .collection(COLLECTION_BATTLE_ROUNDS)
        .where('roundId', '==', roundId);
    // .update(itemsToUpdate);

    return battleRoundToUpdate.get().then(querySnapshot => {
        // should iterate always once because roundId should be uniq
        querySnapshot.forEach(doc => {
            doc.ref.update(itemsToUpdate);
        });
    });
};

/**
 * called by the battle creator
 * @param battleId
 * @returns {*}
 */
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
