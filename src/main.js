import * as playpass from "playpass";

import "./boilerplate/common.css";
import "./components/autocomplete-element.css";
import "./main.css";

import "./screens/gameScreen/game-screen";
import "./screens/helpScreen/help-screen";
import "./screens/resultsScreen/results-screen";
import "./screens/settingsScreen/settings-screen";
import "./screens/statsScreen/stats-screen";

import { showScreen } from "./boilerplate/screens";
import state from "./state";

// Shows either the results or gameplay screen
async function showMainScreen () {
    if (state.isDone()) {
        showResultScreen();
    } else {
        showPlayingScreen();
    }
}

function showResultScreen () {
    showScreen("#results-screen");
}

function showPlayingScreen () {
    showScreen("#game-screen");
}

function onHelpClick () {
    showScreen("#help-screen");
}

function onStatsClick () {
    showScreen("#stats-screen");
}

function onSettingsClick () {
    showScreen("#settings-screen");
}

(async function () {
    // Initialize the Playpass SDK
    await playpass.init({
        gameId: "fd6f1146-0536-43d6-a8ae-242541b3d388", // Do not edit!
    });

    await state.init();

    // Set the login state for our UI
    if (playpass.account.isLoggedIn()) {
        document.body.classList.add("isLoggedIn");
    }

    showMainScreen();

    // Add UI event listeners
    document.querySelector("#helpBtn").onclick = onHelpClick;
    document.querySelector("#statsBtn").onclick = onStatsClick;
    document.querySelector("#settingsBtn").onclick = onSettingsClick;
})();
