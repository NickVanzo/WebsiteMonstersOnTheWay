import Unity, { UnityContext } from "react-unity-webgl";
import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import { Button } from "@mui/material";

const unityContext = new UnityContext({
    loaderUrl: "test/Build/test.loader.js",
    dataUrl: "test/Build/test.data",
    frameworkUrl: "test/Build/test.framework.js",
    codeUrl: "test/Build/test.wasm",
});

export function Game(props) {
    let [startPressed, setStartPressed] = useState(false);

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
        <Grid container className={"home-page-container"}>
            <Grid item xs={1} />
            <Grid item xs={10}>
                <h1>Play "Monsters on the way" to earn Crypto and NFTs</h1>
                <h2>This is the project for my thesis</h2>
                <p>
                    Slay monsters and loot treasure to gain Crypto, NFTs and in game gold!<br />
                    Use your gold or your tokens to buy NFTs directly from the market<br />
                    That's all you need to understand, HAVE FUN!
                </p>
                <Button variant="contained" onClick={() => setStartPressed(true)}>
                    <a href="https://allennick.itch.io/monsters-on-the-way">Open on itch.io</a>
                </Button>
            </Grid>
            <Grid item xs={1} />
        </Grid>

    )
}