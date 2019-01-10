import Store from "../store/index";
import Router from "../router/index";
import isAfter from "date-fns/is_after";
import subtractMinutes from "date-fns/sub_minutes";

export {initSession};

function initSession() {
    return new Promise((resolve) => {
        let tokenExpiryDate = Store.getters["tokensExpiry"];
        if (!tokenExpiryDate) {
            return Router.push("/login");
        }

        let tenMinutesBeforeExpiry = subtractMinutes(tokenExpiryDate, 10);//If the token has expired or will expire in the next 10 min
        const now = new Date();

        if (isAfter(now, tenMinutesBeforeExpiry)) { //If the token has expired or will expire in the next 10 minutes
            return Router.push("/login");
        }
    });
}