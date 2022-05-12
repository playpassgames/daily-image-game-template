import * as playpass from "playpass";
import { showScreen } from "../../boilerplate/screens";
import * as timer from "../../boilerplate/timer";
import state from "../../state";

function share() {
    // Create a link to our game
    const link = playpass.createLink();

    const emojis = state.isSolved() ? "✅" : "❌".join("");

    // Share some text along with our link
    playpass.share({
        text: `🏙️ Daily City #${state.store.day.toString()} ${emojis} ${link}`,
    });
}

let timerUpdate;

const template = document.querySelector("#results-screen");

template.querySelector("button[name=share]").onclick = share;
template.addEventListener("active", () => {
    if (!state.isDone()) {
        showScreen("#game-screen");
        return;
    }

    // Set the results lines
    template.querySelector("#resultLine1").textContent = state.getCurrentAnswer();
    template.querySelector("#resultLine2").textContent = state.isSolved()
        ? `Got it in ${state.store.guesses.length} guesses!`
        : "Better luck tomorrow!";

    const nextGameAt = timer.getNextGameTime();
    timerUpdate = setInterval(() => {
        const until = timer.getUntil(nextGameAt);
        template.querySelector("#timeLeft").textContent = `${until.hours}h ${until.minutes}m ${until.seconds}s`;
    }, 1000);
});

template.addEventListener("inactive", () => {
    if (timerUpdate) {
        clearInterval(timerUpdate);
    }
});
