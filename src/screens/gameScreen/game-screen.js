import * as playpass from "playpass";
import { asyncHandler, showScreen } from "../../boilerplate/screens";
import state from "../../state";

import { choices } from "../../../content/configuration/config";

const template = document.querySelector("#game-screen");
template.addEventListener(
    "active",
    asyncHandler(async () => {
        // Take new users to help screen first
        const sawTutorial = await playpass.storage.get("sawTutorial");
        if (!sawTutorial) {
            playpass.storage.set("sawTutorial", true);
            showScreen("#help-screen");
        }

        // Update hint images
        const answerSlug = state.getCurrentAnswer()
            .replace(/[^A-Za-z0-9]/g, "-") // Replace non-alpha with hyphens
            .replace(/-+/g, "-") // Reduce repeat runs of hyphens
            .replace(/(^-|-$)/g, "") // Trim leading and trailing hyphens
            .toLowerCase();
        for (let ii = 0; ii < state.attempts; ++ii) {
            const image = template.querySelector(`#image-hint${ii+1}`);
            image.src = `../../../content/images/${answerSlug}-${ii+1}.jpg`;
        }

        template.querySelector("#choiceForm").onsubmit = event => {
            event.preventDefault();

            const guessInput = template.querySelector("#guessInput");

            let guess = guessInput.value.trim();
            if (guess != state.getCurrentAnswer()) {
                const fuzzyMatches = choices.filter(choice => choice.toLowerCase().indexOf(guess.toLowerCase()) >= 0);
                if (fuzzyMatches.length == 1) {
                    guess = fuzzyMatches[0];
                }
            }

            state.submit(guess);

            if (state.isDone()) {
                showScreen("#results-screen");
            } else {
                guessInput.value = "";
                updatePlayingScreen();
            }
        };

        if (state.isDone()) {
            // The player has already played today, show results
            showScreen("#results-screen");
            return;
        }

    }),
);

function updatePlayingScreen () {
    template.querySelector(`#guesses`).innerHTML = "";

    const remaining = state.attempts - state.store.guesses.length;
    template.querySelector("#guessesRemaining").textContent = remaining + " guesses remaining";

    for (let ii = 0; ii < state.store.guesses.length; ++ii) {
        const guess = document.createElement("p");
        guess.id = `#guess${ii+1}`; 
        guess.textContent = "❌ "+ state.store.guesses[ii];    
        template.querySelector(`#guesses`).appendChild(guess)        
        template.querySelector(`.tab-button${ii+2}`).style.display = "inline-block";
    }

    // Go to the most recent hint image tab
    template.querySelector(`.tab-button${state.store.guesses.length+1}`).click();
}