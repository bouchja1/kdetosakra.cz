import { useEffect } from 'react';

export default function useGameMenuResize() {
    useEffect(() => {
        const menuContainerElement = window.document.getElementById('menu-container');
        menuContainerElement.classList.add('game-menu');
        const menuLogoElement = document.querySelector('#menu-container .logo > h2');
        menuLogoElement.classList.add('logo-not-displayed');
        return () => {
            menuContainerElement.classList.remove('game-menu');
            menuLogoElement.classList.remove('logo-not-displayed');
        };
    }, []);
}
