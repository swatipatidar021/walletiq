import {FormValidate} from "../utils/validate.js";
import Database from "../utils/database.js";
import { API_BASE_URL } from "../utils/config.js";

const nameInput = document.querySelector(".name")
const emailInput = document.querySelector(".email")
const passwordInput = document.querySelector(".password")
const confirmPasswordInput = document.querySelector(".confirm")
const submitButton = document.body.querySelector(".submit_form")
const errorMessage = document.querySelector(".error_message")

// Password show/hide toggle
document.querySelectorAll(".password_toggle").forEach(toggle => {
    toggle.addEventListener("click", () => {
        const input = toggle.previousElementSibling;
        const isHidden = input.type === "password";
        input.type = isHidden ? "text" : "password";
        toggle.innerText = isHidden ? "Hide" : "Show";
    })
})

submitButton.addEventListener("click", async (e) => {
    e.preventDefault();
    const valid = new FormValidate(nameInput.value, emailInput.value, passwordInput.value, confirmPasswordInput.value);

    const userInfo = {
        name: nameInput.value,
        email: emailInput.value,
        password: passwordInput.value
    }

    if (!valid.isValidName(userInfo.name)) {
        valid.presentInvalidError(nameInput, errorMessage, "Please enter your name")
        return
    } else {
        valid.removeErrorPresentation(nameInput, errorMessage);
    }

    if (!valid.isValidEmail(userInfo.email)) {
        valid.presentInvalidError(emailInput, errorMessage, "Please enter your email")
        return
    } else {
        valid.removeErrorPresentation(emailInput, errorMessage);
    }
    
    if (!valid.isAcceptableEmail(userInfo.email)) {
        valid.presentInvalidError(emailInput, errorMessage, "Please enter a valid email")
        return
    } else {
        valid.removeErrorPresentation(emailInput, errorMessage);
    }

    if (!valid.isValidPassword(userInfo.password)) {
        valid.presentInvalidError(passwordInput, errorMessage, "Please enter your password")
        return
    } else {
        valid.removeErrorPresentation(passwordInput, errorMessage);
    }

    if (!valid.isConfirmPassword(userInfo.password, confirmPasswordInput.value)) {
        valid.presentInvalidPasswords(passwordInput, confirmPasswordInput, errorMessage, "Passwords do not match")
        return
    } else {
        valid.removePasswordErrorPresentation(passwordInput, confirmPasswordInput, errorMessage)
    }

    const originalButtonText = submitButton.innerText;
    submitButton.disabled = true;
    submitButton.innerText = "Creating account...";

    const database = new Database(API_BASE_URL)
    database.postData("users/create", userInfo).then((res) => {
        submitButton.disabled = false;
        submitButton.innerText = originalButtonText;

        if (!res?.created) {
            errorMessage.innerText = res?.message || "Could not create account, please try again";
            return;
        }
        errorMessage.innerText = "";
        localStorage.setItem("userID", JSON.stringify(res?.user._id))
        window.location.href = "./home.html"
    }).catch(() => {
        submitButton.disabled = false;
        submitButton.innerText = originalButtonText;
        errorMessage.innerText = "Server error, please try again"
        return
    })
})