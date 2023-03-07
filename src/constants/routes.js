export const routeNames = {
    battle: 'battle',
    info: 'info',
    vlastni: 'vlastni',
    napoveda: 'napoveda',
    podpora: 'podpora',
    nahratMisto: 'nahrat-misto',
    vysledek: 'vysledek',
    nahodne: 'nahodne',
    nahodneKraj: 'nahodne-kraj',
    mesto: 'mesto',
    heraldika: 'heraldika',
    geolokace: 'geolokace',
    podminky: 'podminky',
};

export const isInGameRoute = pathname => {
    return (
        pathname !== '/' &&
        pathname !== `/${routeNames.info}` &&
        pathname !== `/${routeNames.napoveda}` &&
        pathname !== `/${routeNames.podpora}` &&
        pathname !== `/${routeNames.nahratMisto}` &&
        pathname !== `/${routeNames.podminky}`
    );
};
