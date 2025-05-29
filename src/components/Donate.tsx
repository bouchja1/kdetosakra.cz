import React from 'react';

import { DonateContent } from './DonateContent';

interface DonateProps {
    marginBottom?: number;
}

export const Donate = ({ marginBottom = 0 }: DonateProps) => {
    return (
        <>
            <p>
                Hru jsem naprogramoval koncem roku 2019, když jsem se chtěl blíž seznámit s JavaScript knihovnou React.
                Jedná se o hobby projekt a dělá mi radost, když někoho baví a přináší mu radost.
            </p>
            <p>
                Pokud ti hra dělá radost, potěší mě jakýkoliv příspěvek na pokrytí nákladů provozu (platby za server,
                kde hra běží) nebo další rozvoj (na to moje další kafe).
            </p>
            <DonateContent marginBottom={marginBottom} />
        </>
    );
};
