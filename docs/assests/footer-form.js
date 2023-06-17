const FOOTER_FORM = document.querySelector("#footer-form")
const validInputs = {
    name: false,
    email: false,
    text: false,
    checkbox: false,
}

var IS_SUBMIT = false
const SUBMIT_BUTTON = FOOTER_FORM.querySelector("#submit")

function isSubmit() { // checks if there are invalid inputs via false value
    let retVal = true
    for (let prop in validInputs) {
        if (validInputs[prop] === false) {
            retVal = false
            break
        }
    }
    IS_SUBMIT = retVal
}

function setPropertyValid(propName, value) { // a setter that updates IS_SUBMIT
    validInputs[propName] = value
    isSubmit()

    if (IS_SUBMIT) {
        SUBMIT_BUTTON.disabled = false
    } else {
        SUBMIT_BUTTON.disabled = true
    }
}

function cleanInput(event) {
    const parent = event.target.parentNode
    isSubmit()

    if (IS_SUBMIT) {
        SUBMIT_BUTTON.disabled = false
    } else {
        SUBMIT_BUTTON.disabled = true
    }

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
        setPropertyValid("name", false)
    } else {
        setPropertyValid("name", true)
    }
}

function isValidEmail(event) {
    const email = event.target.value
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    const abInputGroup = event.target.parentNode
    if (!isValid && abInputGroup) {
        abInputGroup.classList.add("warning")
        setPropertyValid("email", false)
    } else {
        setPropertyValid("email", true)
    }
}

function isValidText(event) {
    const text = event.target.value
    const textLength = text.trim().length
    const isValid = textLength >= 10 && textLength <= 1000
    const abInputGroup = event.target.parentNode
    if (!isValid && abInputGroup) {
        abInputGroup.classList.add("warning")
        setPropertyValid("text", false)
    } else {
        setPropertyValid("text", true)
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

function isValidCheckbox() {
    const abCheckRequred = FOOTER_FORM.querySelector(".ab-check-requred")
    const checkedRequered = FOOTER_FORM.querySelector("#checkedRequered")
    if (!checkedRequered.checked && abCheckRequred) {
        abCheckRequred.classList.add("warning")
        const spanText = FOOTER_FORM.querySelector("#checkbox-text")

        spanText.innerText = "In order to submit your message, you need to accept our privacy policy and terms of conditions"
        setPropertyValid("checkbox", false)

    } else {
        setPropertyValid("checkbox", true)
        checkedRequered.checked = true
    }
}

function handleCheckbox() {
    const checkedRequered = FOOTER_FORM.querySelector("#checkedRequered")
    const val = checkedRequered.checked
    checkedRequered.checked = val
    setPropertyValid("checkbox", val)
    isSubmit()
}


async function onSubmit(token) {
    if (SUBMIT_BUTTON.disabled) {
        return
    }
    const [name, email, text] = getElemValuesByIds(['name', 'email', 'text'])

    const asyncSubmit = async () => {
        fetch("https://api.accbuddy.com/public", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                test_recaptcha: {
                    token,
                },
                sendMessageDataset: {
                    sender: name,
                    email: email,
                    text: text,
                }
            })
        }).then(res => true).catch(err => false)
    }

    const isSuccess = await asyncSubmit()
    if (isSuccess) {
        SUBMIT_BUTTON.innerText = "Sending..."
        handleFormFooterResponse()
        SUBMIT_BUTTON.innerText = "Send"
    } else {
        alert("Sending failed.")
    }
}

function handleFormFooterResponse() {
    // flow: add UI response -> insert as first element of ab-form-inbox -> change grid-template-areas into ab-form-input-box-success
    const abFormInbox = FOOTER_FORM.querySelector(".ab-form-input-box")
    const div = document.createElement("div")

    div.className = "ui-response"
    div.style = "min-width: 100% !important; padding: 35px 44.91px; border: 1px solid var(--ab_violet)"
    div.innerHTML = "<span style='font-family: var(--ab_primary-font);font-style:normal;font-weight: 800;font-size: 16px;line-height:20px;letter-spacing:-0.5px;color: var(--ab_violet);'><object data='./assests/image/checkmark.svg'></object> Thank you</span ><p class='p' style='margin-top: 18.58px; color: var(--ab_violet)'>Your message has been sent.</p>"

    console.log('abFormInbox', div)
    abFormInbox.insertBefore(div, abFormInbox.firstChild)
    abFormInbox.classList.add("ab-form-input-box-success")

    FOOTER_FORM.querySelector("#name").parentNode.style.display = "none"
    FOOTER_FORM.querySelector("#email").parentNode.style.display = "none"
    FOOTER_FORM.querySelector("#text").parentNode.style.display = "none"
    FOOTER_FORM.querySelector("#text").parentNode.style.display = "none"
    FOOTER_FORM.querySelector("#checkedRequered").checked = false

}