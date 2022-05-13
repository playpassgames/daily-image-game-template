import * as playpass from "playpass";
import { State } from "./boilerplate/state";
import UserModel from "./models/userModel";
import DailyModel from "./models/dailyModel";

import { choices } from "../content/autocomplete.json";

const MAX_ATTEMPTS = 6;

const state = new State(
    "daily",
    new UserModel(MAX_ATTEMPTS),
    new DailyModel(Date.parse("2022-04-21T12:00:00")),
); 

export default {
    store: null,
    currentGuess: "",
    correctAnswer: null,
    
    async init() {
        this.store = await state.loadObject();
        this.correctAnswer = choices[this.store.day % choices.length];
    },
    get attempts() {
        return MAX_ATTEMPTS;
    },
    isSolved() {
        return this.store.guesses[this.store.guesses.length - 1]?.toUpperCase() === this.getCurrentAnswer().toUpperCase();
    },
    isDone() {
        return this.store.guesses.length >= this.attempts || this.isSolved();
    },
    getCurrentAnswer() {
        const word = this.correctAnswer;
        if (!word) {
            choices[0];
        }
        return word;
    },
    submit(currentGuess) {
        this.store.guesses.push(currentGuess);

        if (this.isSolved()) {
            this.store.wins[this.store.guesses.length - 1] += 1;
        }

        this.save();
    },
    async login() {
        if (await playpass.account.login()) {
            document.body.classList.add("isLoggedIn");
        }
    },
    async logout() {
        playpass.account.logout();
        document.body.classList.remove("isLoggedIn");
    },
    save() {
        state.saveObject(this.store);
    }
}
