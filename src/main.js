import * as playpass from "playpass";

import "./boilerplate/common.css";
import "./boilerplate/header.js";
import "./boilerplate/screens";

import "./components/autocomplete-element";

import "./screens/gameScreen/game-screen";
import "./screens/resultsScreen/results-screen";
import "./screens/helpScreen/help-screen";
import "./screens/statsScreen/stats-screen";
import "./screens/settingsScreen/settings-screen";

import { showScreen } from "./boilerplate/screens";
import state from "./state";

import "./main.css";

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
    document.querySelector("game-header .button[name=help]").onclick = onHelpClick;
    document.querySelector("game-header .button[name=stats]").onclick = onStatsClick;
    document.querySelector("game-header .button[name=settings]").onclick = onSettingsClick;
})();
