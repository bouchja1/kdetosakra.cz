import { Card, Col, Layout, Row } from 'antd';
import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components';

import { HeraldryRoundResultModal } from '../../components/HeraldryRoundResultModal';
import gameModes from '../../enums/modes';
import useGameMenuResize from '../../hooks/useGameMenuResize';
import { setCurrentGame, setTotalRoundCounter, setTotalRoundScore } from '../../redux/actions/game';
import { setLastResult } from '../../redux/actions/result';
import { HeraldryResultT } from '../../types/heraldry';
import { CzechCity } from '../../types/places';
import { getRandomCzechPlaceWithCoatOfArms } from '../../util';
import { shuffleArray } from '../../util/array';

const { Content } = Layout;
const { Meta } = Card;

const CoaContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 20px;
    gap: 30px;
`;

export const HeraldryGame = () => {
    const dispatch = useDispatch();
    // @ts-ignore
    const currentGame = useSelector(state => state.game.currentGame);
    const [resultModalVisible, setResultModalVisible] = useState(false);
    const [guessedCity, setGuessedCity] = useState<CzechCity | null>(null);
    const [allGuessedCities, setAllGuessedCities] = useState<HeraldryResultT[]>([]);
    useGameMenuResize();

    const { mode, round, city, totalScore } = currentGame;

    const shuffledCitiesToGuessArray = useMemo(() => {
        if (city) {
            const randomFakeCity1 = getRandomCzechPlaceWithCoatOfArms([city]);
            const randomFakeCity2 = getRandomCzechPlaceWithCoatOfArms([city, randomFakeCity1]);
            const cardCities = [city, randomFakeCity1, randomFakeCity2];
            return shuffleArray(cardCities);
        }
        return null;
    }, [city]);

    const handleGuessHeraldry = (cityWhichWasGuessed: CzechCity) => {
        const roundResultScore = cityWhichWasGuessed.kod === city.kod ? 1 : 0;
        setGuessedCity(cityWhichWasGuessed);
        // @ts-ignore
        dispatch(setTotalRoundScore(totalScore + roundResultScore));
        setAllGuessedCities([
            ...allGuessedCities,
            {
                guessed: !!roundResultScore,
                city,
                cityWhichWasGuessed,
            },
        ]);
        setResultModalVisible(true);
    };

    const handleGuessNextRound = () => {
        const randomCity = getRandomCzechPlaceWithCoatOfArms();

        setResultModalVisible(false);
        dispatch(
            // @ts-ignore
            setCurrentGame({
                city: randomCity,
            }),
        );
        // @ts-ignore
        dispatch(setTotalRoundCounter(round + 1));
    };

    const handleShowResult = () => {
        setResultModalVisible(false);
        dispatch(
            // @ts-ignore
            setLastResult({
                totalScore,
                mode: gameModes.heraldry,
                guessedCoatOfArms: allGuessedCities,
            }),
        );
    };

    if (mode === gameModes.heraldry && city && shuffledCitiesToGuessArray) {
        return (
            <Content>
                <div>
                    {/* -40 padding of layout */}
                    <div>
                        <CoaContainer>
                            <img
                                className="heraldry-city-emblem"
                                src={city.coatOfArms}
                                alt={`Znak obce ${city.obec}`}
                            />
                            <Row gutter={16} wrap align="middle" justify="center">
                                {shuffledCitiesToGuessArray.map((city: CzechCity) => {
                                    const { obec, okres, kraj } = city;
                                    return (
                                        <Col>
                                            <Card
                                                key={obec}
                                                hoverable
                                                headStyle={{
                                                    textAlign: 'center',
                                                }}
                                                bodyStyle={{
                                                    textAlign: 'center',
                                                }}
                                                style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: '#c80707',
                                                    minHeight: '150px',
                                                }}
                                                onClick={() => handleGuessHeraldry(city)}
                                            >
                                                <Meta
                                                    title={obec}
                                                    description={`${okres} (${kraj})`}
                                                    className="heraldry-meta-card"
                                                />
                                            </Card>
                                        </Col>
                                    );
                                })}
                            </Row>
                        </CoaContainer>
                    </div>
                </div>
                {guessedCity && (
                    <HeraldryRoundResultModal
                        visible={resultModalVisible}
                        onGuessNextRound={handleGuessNextRound}
                        onShowResult={handleShowResult}
                        city={city}
                        guessedCity={guessedCity}
                    />
                )}
            </Content>
        );
    }

    return (
        <Redirect
            to={{
                pathname: '/',
            }}
        />
    );
};
