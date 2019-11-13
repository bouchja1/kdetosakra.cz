import { useState, useEffect } from 'react';

export default function useWindowHeight() {
    useEffect(() => {
        window.scroll(0, 0);
        const menuContainerElement = window.document.getElementById('menu-container');
        menuContainerElement.classList.add('game-menu');
        const menuLogoElement = document.querySelector('#menu-container > div > div:nth-child(2) > img');
        menuLogoElement.classList.add('logo-not-displayed');
        return () => {
            menuContainerElement.classList.remove('game-menu');
            menuLogoElement.classList.remove('logo-not-displayed');
        };
    }, []);
}
