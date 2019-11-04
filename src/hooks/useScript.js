import { useState, useEffect } from 'react';

const useScript = src => {
    // Keeping track of script loaded and error state
    const [state, setState] = useState({
        loaded: false,
        error: false,
    });

    const [cachedScript, setCachedScript] = useState(null);

    useEffect(() => {
        console.log("**************** XAX: ", cachedScript)

        // If cachedScripts array already includes src that means another instance ...
        // ... of this hook already loaded this script, so no need to load again.
        if (cachedScript !== null && cachedScript === src) {
            setState({
                loaded: true,
                error: false,
            });
        } else {
            setCachedScript(src);

            // Create script
            let script = document.createElement('script');
            script.src = src;
            script.async = true;

            // Script event listener callbacks for load and error
            const onScriptLoad = () => {
                console.log("#######")
                console.log('SRC: ', src);
                console.log('JOO: ', window);

                /*
                let scriptLoader = document.createElement('script');
                scriptLoader.type = 'text/javascript';
                scriptLoader.text = 'Loader.load(null, {pano: true});';
                script.async = false;

                document.body.appendChild(scriptLoader);
                 */

                setState({
                    loaded: true,
                    error: false,
                    SMap: window.SMap,
                });
            };

            const onScriptError = () => {
                console.log("NOOIJKJKJKKJKJKJ")
                // Remove from cachedScripts we can try loading again
                setCachedScript(null);
                script.remove();

                setState({
                    loaded: true,
                    error: true,
                });
            };

            script.addEventListener('load', onScriptLoad);
            script.addEventListener('error', onScriptError);

            // Add script to document body
            document.body.appendChild(script);

            // Remove event listeners on cleanup
            return () => {
                script.removeEventListener('load', onScriptLoad);
                script.removeEventListener('error', onScriptError);
            };
        }
    }, [src, cachedScript]); // Only re-run effect if script src changes

    console.log("STATE: ", state)

    return [state.loaded, state.error, state.SMap];
};

export default useScript;
