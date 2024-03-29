import {displayLoginForm, setupLoginForm} from "./login";
import {displaySignupForm, setupSignupForm} from "./signup";
import {displayUpdateForm, setupUpdateForm} from "./update";
import * as API from "../utilities/api-actions";
import {getCookie, setCookie, deleteCookie} from "../utilities/cookie";
import {IsNotEmpty} from "../utilities/conditional";

let accountId;

export function createAccountDiv() {
    let accountDiv = document.createElement("div");
    accountDiv.id = "account";
    accountDiv.innerText = " ";
    return accountDiv;
}

export function populateAccountDiv() {
    accountId = getCookie("UserId");
    const accountDiv = document.getElementById("account");

    if(IsNotEmpty(accountId))
    {
        API.getAccount(accountId, data => {
            if(data.chipCount <= 0) {
                accountDiv.innerHTML =`
                    <span id="account-username">${data.userName}</span>
                    <span id="account-no-chips"> You are out of Chips!</span>
                    <button id="add-chips">Add More Chips</button>
                    <button id="account-logout" class="account-button">Logout</button>
                    <button id="account-update" class="account-button">Update</button>
                `;

                const addChipsButton = document.getElementById("add-chips");

                addChipsButton.addEventListener("click", () => {
                    API.setChipCount(100);
                    accountDiv.innerHTML =`
                    <span id="account-username">${data.userName}</span>
                    <span id="account-chips">100</span>
                    <button id="account-logout" class="account-button">Logout</button>
                    <button id="account-update" class="account-button">Update</button>
                `;
                });
            } else {
                accountDiv.innerHTML =`
                    <span id="account-username">${data.userName}</span>
                    <span id="account-chips">${data.chipCount}</span>
                    <button id="account-logout" class="account-button">Logout</button>
                    <button id="account-update" class="account-button">Update</button>
                `;

                const logoutButton = document.getElementById("account-logout");
                const updateButton = document.getElementById("account-update");

                logoutButton.addEventListener("click", () => {
                    deleteCookie("UserId");
                    location.reload();
                });
                updateButton.addEventListener("click", () => {
                    accountDiv.innerHTML = displayUpdateForm();
                    setupUpdateForm();
                });
            }

            accountDiv.className = "logged-in";

            setCookie("UserEmail", data.email, .1);
            setCookie("ChipCount", data.chipCount, .1);
        });
    }
    else {
        
        accountDiv.innerHTML = `
        <div class="login-signup">    
        <h1> YOU MUST BE 21 OR OLDER TO PLAY!</h1>
            <p>Please sign up or log in to enter the casino.</p>
            <button id="account-signup">Sign Up</button>
            <button id="account-login">Log In</button>
            </div>
        `;
        accountDiv.className = "logged-out";

        const signupButton = document.getElementById("account-signup");
        const loginButton = document.getElementById("account-login");

        signupButton.addEventListener('click', () => {
            accountDiv.innerHTML = displaySignupForm();
            setupSignupForm();
        });

        loginButton.addEventListener('click', () => {
            accountDiv.innerHTML = displayLoginForm();
            setupLoginForm();
        });
    }
}
