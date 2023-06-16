const FOOTER_FORM = document.querySelector("#footer-form")

function cleanInput(event) {
    const parent = event.target.parentNode
    if (parent) {
        parent.classList.remove("warning")
    }
}

function toggleWarningClass(isValid, abInputGroup) {
    // classListToggle function can be used
    if (!isValid) {
        abInputGroup.classList.add("warning")
    } else {
        abInputGroup.classList.remove("warning")
    }
}

function isValidName(event) {
    const name = event.target.value
    const isValid = name.trim().length > 0
    const abInputGroup = event.target.parentNode
    if (!isValid && abInputGroup) {
        abInputGroup.classList.add("warning")
    }
}

function isValidEmail(event) {
    event.nam
    const email = event.target.value
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    const abInputGroup = event.target.parentNode
    if (!isValid && abInputGroup) {
        abInputGroup.classList.add("warning")
    }
}

function isValidText(event) {
    const text = event.target.value
    const textLength = text.trim().length
    const isValid = textLength >= 10 && textLength <= 1000
    const abInputGroup = event.target.parentNode
    if (!isValid && abInputGroup) {
        abInputGroup.classList.add("warning")
    }
}

function cleanCheckbox() {
    const spanText = FOOTER_FORM.querySelector("#checkbox-text")
    const abCheckRequred = FOOTER_FORM.querySelector(".ab-check-requred")
    if (spanText && abCheckRequred) {
        abCheckRequred.classList.remove("warning")
        spanText.innerText = "I have read and agree to the Privacy Policy and Terms of Service"
    }
}

function isValidCheckbox(checked) {
    const abCheckRequred = FOOTER_FORM.querySelector(".ab-check-requred")
    if (!checked && abCheckRequred) {
        abCheckRequred.classList.add("warning")
        const spanText = FOOTER_FORM.querySelector("#checkbox-text")

        if (!checked && spanText) {
            spanText.innerText = "In order to submit your message, you need to accept our privacy policy and terms of conditions"
        }
    }
}

