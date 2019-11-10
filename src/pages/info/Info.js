import React from 'react';
import HeaderContainer from '../../components/pageStructure/HeaderContainer';

const Info = () => {
    return (
        <>
            <HeaderContainer />
            <div className="about-container">
                <div className="about">
                    <h1>O hře</h1>
                    <p>Popisek</p>
                    <p>https://www.hry.cz/hra/geoguessr</p>
                    <p>Dat sem muj mail pro pripadny kontakt</p>
                </div>
            </div>
        </>
    );
};

export default Info;
