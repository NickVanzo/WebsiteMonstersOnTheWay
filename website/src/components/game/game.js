import Unity, { UnityContext } from "react-unity-webgl";
import React, { useEffect } from "react";
import { Container } from "@mui/material";

const unityContext = new UnityContext({
    loaderUrl: "build0.1/Build/build0.1.loader.js",
    dataUrl: "build0.1/Build/build0.1.data",
    frameworkUrl: "build0.1/Build/build0.1.framework.js",
    codeUrl: "build0.1/Build/build0.1.wasm",
});

export function Game(props) {
    useEffect(function () {
        unityContext.on("canvas", function (canvas) {
            canvas.width = 100;
            canvas.height = 50;
        });
    }, []);

    function handleOnClickFullscreen() {
        unityContext.setFullscreen(true);
    }


    return (
            <Container>
                <button onClick={() => handleOnClickFullscreen()}>Fullscreen</button>
                <Unity unityContext={unityContext}
                    style={{ width: "800px", height: "500px" }}
                />;
            </Container>
    )
}