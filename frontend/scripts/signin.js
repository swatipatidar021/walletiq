import {FormValidate} from "../utils/validate.js";
import Database from "../utils/database.js";

const emailInput = document.querySelector(".email")
const passwordInput = document.querySelector(".password")
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
    const valid = new FormValidate("", emailInput.value, passwordInput.value, "");

    const userInfo = {
        email: emailInput.value,
        password: passwordInput.value
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

    const originalButtonText = submitButton.innerText;
    submitButton.disabled = true;
    submitButton.innerText = "Logging in...";

    const database = new Database("http://localhost:5000")
    database.postData("users/login", userInfo).then(res => {
        submitButton.disabled = false;
        submitButton.innerText = originalButtonText;

        if (!res?.success) {
            errorMessage.innerText = res?.message || "User not found, try creating an account";
            return;
        }
        errorMessage.innerText = "";
        localStorage.setItem("userID", JSON.stringify(res?.data?._id))
        window.location.href = "./home.html"
    }).catch(() => {
        submitButton.disabled = false;
        submitButton.innerText = originalButtonText;
        errorMessage.innerText = "Server error, please try again"
        return
    })
})