import * as playpass from "playpass";

import "./boilerplate/common.css";
import "./components/autocomplete-element.css";
import "./main.css";

import { Daily } from "./boilerplate/daily";
import { maxGuesses, choices } from "./config";

import { autocomplete } from './components/autocomplete-element';

const daily = new Daily();
const answer = choices[Math.floor(daily.random() * choices.length)];

let guesses = [];

function isGameComplete () {
    return (guesses.length >= maxGuesses) || (guesses[guesses.length-1] == answer);
}

// Shows either the results or gameplay screen
async function showMainScreen () {
    guesses = await daily.loadObject() || [];
    if (isGameComplete()) {
        showResultScreen();
    } else {
        showPlayingScreen();
    }
}

function showResultScreen () {
    // Go to the results screen
    showScreen("#resultScreen");

    document.querySelector("#resultLine1").textContent = answer;
    document.querySelector("#resultLine2").textContent = (guesses[guesses.length-1] == answer)
        ? `Got it in ${guesses.length} guesses!`
        : "Better luck tomorrow!";
}

function showPlayingScreen () {
    showScreen("#playingScreen");
    updatePlayingScreen();
}

function showScreen (name) {
    for (let screen of document.querySelectorAll(".screen")) {
        screen.style.display = "none";
    }
    document.querySelector(name).style.display = "inherit";
}

function updatePlayingScreen () {
    for (let ii = 0; ii < guesses.length; ++ii) {
        document.querySelector(`#guess${ii+1}`).textContent = "❌ "+guesses[ii];
        document.querySelector(`.tab-button${ii+2}`).style.display = "inline-block";
    }

    // Go to the most recent hint image tab
    document.querySelector(`.tab-button${guesses.length+1}`).click();

    const remaining = maxGuesses - guesses.length;
    document.querySelector("#guessesRemaining").textContent = remaining + " guesses remaining";
}

function onShareClick () {
    // Create a link to our game
    const link = playpass.createLink();

    const emojis = guesses.map(guess => (guess == answer) ? "✅" : "❌").join("");

    // Share some text along with our link
    playpass.share({
        text: `🏙️ Daily City #${daily.day} ${emojis} ${link}`,
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

    // Take new users to help screen first
    const sawTutorial = await playpass.storage.get("sawTutorial");
    if (sawTutorial) {
        showMainScreen();
    } else {
        playpass.storage.set("sawTutorial", true);
        showScreen("#helpScreen");
    }

    // Set the login state for our UI
    if (playpass.account.isLoggedIn()) {
        document.body.classList.add("isLoggedIn");
    }

    autocomplete(document.querySelector("#guessInput"), choices)

    // Update hint images
    const answerSlug = answer
        .replace(/[^A-Za-z0-9]/g, "-") // Replace non-alpha with hyphens
        .replace(/-+/g, "-") // Reduce repeat runs of hyphens
        .replace(/(^-|-$)/g, "") // Trim leading and trailing hyphens
        .toLowerCase();
    for (let ii = 0; ii < maxGuesses; ++ii) {
        const image = document.querySelector(`#image-hint${ii+1}`);
        image.src = `/images/${answerSlug}-${ii+1}.jpg`;
    }

    document.querySelector("#choiceForm").onsubmit = event => {
        event.preventDefault();

        const guessInput = document.querySelector("#guessInput");

        let guess = guessInput.value.trim();
        if (guess != answer) {
            const fuzzyMatches = choices.filter(choice => choice.toLowerCase().indexOf(guess.toLowerCase()) >= 0);
            if (fuzzyMatches.length == 1) {
                guess = fuzzyMatches[0];
            }
        }

        guesses.push(guess);
        daily.saveObject(guesses);

        if (isGameComplete()) {
            showResultScreen();

        } else {
            if (guesses.length < maxGuesses) {
                guessInput.value = "";
                updatePlayingScreen();
            } else {
                showResultScreen();
            }
        }
    };

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
