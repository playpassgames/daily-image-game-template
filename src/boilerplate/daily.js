import * as playpass from "playpass";
import { getCurrentDay, getDay } from "./timer";

export class Daily {
    constructor (firstDate) {
        if (!firstDate) {
            firstDate = new Date("2022-01-01");
        }
        this.day = getCurrentDay() - getDay(firstDate);
    }

    /** Loads an object from storage, returning null if there was no object previously saved today. */
    async loadObject () {
        const daily = await playpass.storage.get("daily");
        return (daily && daily.day == this.day) ? daily.state : null;
    }

    /** Saves an object to storage, which will expire the next day. */
    async saveObject (state) {
        await playpass.storage.set("daily", { day: this.day, state: state });
    }

    /** Gets a random number between 0 and 1 unique to this day. */
    random () {
        return ((1103515245*this.day + 12345) >>> 0) / 0xffffffff;
    }
}
