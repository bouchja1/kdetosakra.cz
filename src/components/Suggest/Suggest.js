import React, {useContext, useEffect, useState} from 'react';
import {Redirect} from 'react-router-dom';
import MapyContext from "../../context/MapyContext";

const Suggest = () => {
    const [suggestInput] = useState(React.createRef());
    const mapyContext = useContext(MapyContext);
    const [submittedSuggestedData, setSubmittedSuggestedData] = useState(null);
    const [playSuggested, setPlaySuggested] = useState(false);

    const initSuggest = () => {
        const suggest = new mapyContext.SMap.Suggest(suggestInput.current);
        suggest.urlParams({
            // omezeni pro celou CR
            bounds: "48.5370786,12.0921668|51.0746358,18.8927040"
        });
        suggest
            .addListener("suggest", function (suggestedData) {
                console.log("SUGGESTED DATA: ", suggestedData)
                setSubmittedSuggestedData(suggestedData);
            })
            .addListener("close", function() {
        });
    }

    const playSuggestedPlace = () => {
        setPlaySuggested(true);
    }

    useEffect(() => {
        if (mapyContext.loadedMapApi) {
            initSuggest();
        }
    }, [mapyContext.loadedMapApi]);

    if (playSuggested) {
        return (
            <Redirect
                to={{
                    pathname: '/suggested',
                    state: {
                        radius: 1,
                        city: {
                            coordinates: {
                                latitude: submittedSuggestedData.data.latitude,
                                longitude: submittedSuggestedData.data.longitude,
                            },
                            place: submittedSuggestedData.data.title,
                            info: submittedSuggestedData.data.secondRow,
                        },
                    },
                }}
            />
        );
    } else {
        return (
            <>
                <input type="text" placeholder="hledaná fráze" ref={suggestInput}/>
                <button disabled={!submittedSuggestedData} type="submit" onClick={() => {
                    playSuggestedPlace()
                }}>
                    Hrát
                </button>
            </>
        )
    }
}

export default Suggest;
