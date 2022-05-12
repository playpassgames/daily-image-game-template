import * as playpass from "playpass";

import "./boilerplate/common.css";
import "./components/autocomplete-element.css";
import "./main.css";

import "./screens/gameScreen/game-screen";
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
    // Go to the results screen
    showScreen("#resultScreen");

    document.querySelector("#resultLine1").textContent = state.getCurrentAnswer();
    document.querySelector("#resultLine2").textContent = state.isSolved()
        ? `Got it in ${state.store.guesses.length} guesses!`
        : "Better luck tomorrow!";
}

function showPlayingScreen () {
    showScreen("#game-screen");
}

function onShareClick () {
    // Create a link to our game
    const link = playpass.createLink();

    const emojis = state.isSolved() ? "✅" : "❌".join("");

    // Share some text along with our link
    playpass.share({
        text: `🏙️ Daily City #${state.store.day.toString()} ${emojis} ${link}`,
    });
}

function onHelpClick () {
    showScreen("#helpScreen");
}

function onStatsClick () {
    showScreen("#statsScreen");
}

function onSettingsClick () {
    showScreen("#settingsScreen");
}

function onBackClick () {
    showMainScreen();
}

async function onLoginClick () {
    if (await playpass.account.login()) {
        document.body.classList.add("isLoggedIn");
    }
}

function onLogoutClick () {
    playpass.account.logout();
    document.body.classList.remove("isLoggedIn");
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
    document.querySelector("#shareBtn").onclick = onShareClick;
    document.querySelector("#helpBtn").onclick = onHelpClick;
    document.querySelector("#helpBackBtn").onclick = onBackClick;
    document.querySelector("#statsBtn").onclick = onStatsClick;
    document.querySelector("#statsBackBtn").onclick = onBackClick;
    document.querySelector("#settingsBtn").onclick = onSettingsClick;
    document.querySelector("#loginBtn").onclick = onLoginClick;
    document.querySelector("#logoutBtn").onclick = onLogoutClick;
    document.querySelector("#settingsBackBtn").onclick = onBackClick;
})();
