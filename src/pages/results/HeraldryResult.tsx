import { Button, Card, Col, Progress, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';

import { TOTAL_ROUNDS_MAX } from '../../constants/game';
import { HeraldryResultT } from '../../types/heraldry';
import { getHeraldryDescriptionForCity } from '../../util/heraldry';

const { Meta } = Card;

export const HeraldryResult = () => {
    // @ts-ignore
    const lastResult = useSelector(state => state.result);

    const { totalScore, guessedCoatOfArms } = lastResult;

    if (guessedCoatOfArms && guessedCoatOfArms.length) {
        return (
            <>
                <div className="result-container">
                    <div className="result-modal-container">
                        <div className="result-container-item">
                            <h3>Celkové skóre</h3>
                            {totalScore} bodů
                        </div>
                        <div className="result-container-item">
                            <h3>Procentuální úspěšnost</h3>
                            <Progress type="circle" percent={Math.round((totalScore / TOTAL_ROUNDS_MAX) * 100)} />
                        </div>
                    </div>
                    <div className="result-modal-container">
                        <div className="result-container-item">
                            <h2>Tvé tipy v jednotlivých kolech:</h2>
                            <div className="result-rounds-container">
                                {guessedCoatOfArms.map((guessInRound: HeraldryResultT, i: number) => {
                                    const { city, cityWhichWasGuessed, guessed } = guessInRound;
                                    const { obec, okres, kraj, coatOfArms } = city;
                                    const {
                                        obec: obecGuess,
                                        okres: okresGuess,
                                        kraj: krajGuess,
                                        coatOfArms: coatOfArmsGuess,
                                    } = cityWhichWasGuessed;

                                    const cityHeraldryDescription = getHeraldryDescriptionForCity(city);
                                    const guessedCityHeraldryDescription =
                                        getHeraldryDescriptionForCity(cityWhichWasGuessed);

                                    return (
                                        <>
                                            <h3>{i + 1}. kolo</h3>
                                            <Row gutter={16} wrap align="middle" justify="center">
                                                <Col>
                                                    <Card
                                                        title="Hádaný erb"
                                                        headStyle={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                        }}
                                                        bodyStyle={{
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        <Meta title={obec} description={`${okres} (${kraj})`} />
                                                        <div
                                                            style={{
                                                                marginTop: '20px',
                                                            }}
                                                        >
                                                            <img
                                                                src={coatOfArms}
                                                                alt={`Znak obce ${obec}`}
                                                                width={100}
                                                            />
                                                            {cityHeraldryDescription && (
                                                                <p
                                                                    style={{
                                                                        marginTop: '20px',
                                                                    }}
                                                                >
                                                                    {cityHeraldryDescription}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Card>
                                                </Col>
                                                <Col>
                                                    <Card
                                                        title="Tvůj tip"
                                                        headStyle={{
                                                            textAlign: 'center',
                                                            fontWeight: 'bold',
                                                        }}
                                                        bodyStyle={{
                                                            textAlign: 'center',
                                                        }}
                                                        style={{
                                                            backgroundColor: guessed ? '#f6ffed' : '#fff2f0',
                                                        }}
                                                    >
                                                        <Meta
                                                            title={obecGuess}
                                                            description={`${okresGuess} (${krajGuess})`}
                                                        />
                                                        <div
                                                            style={{
                                                                marginTop: '20px',
                                                            }}
                                                        >
                                                            <img
                                                                src={coatOfArmsGuess}
                                                                alt={`Znak obce ${obecGuess}`}
                                                                width={100}
                                                            />
                                                            {guessedCityHeraldryDescription && (
                                                                <p
                                                                    style={{
                                                                        marginTop: '20px',
                                                                    }}
                                                                >
                                                                    {guessedCityHeraldryDescription}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="result-container-item" />
                    </div>
                </div>
                <div className="result-container-item" style={{ marginBottom: '25px' }}>
                    <Button type="primary">
                        <Link
                            to={{
                                pathname: '/',
                            }}
                        >
                            Zpět na výběr herního módu
                        </Link>
                    </Button>
                </div>
            </>
        );
    }

    return <Redirect to={{ pathname: '/' }} />;
};
