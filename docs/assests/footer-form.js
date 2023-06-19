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
    if (value === true && IS_SUBMIT) {
        SUBMIT_BUTTON.disabled = false
    }
}

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

function isValidName() {
    const nameElem = FOOTER_FORM.querySelector("#name")
    const name = nameElem.value
    const isValid = name.trim().length > 0
    const abInputGroup = nameElem.parentNode
    if (!isValid && abInputGroup) {
        abInputGroup.classList.add("warning")
        setPropertyValid("name", false)
    } else {
        setPropertyValid("name", true)
    }
}

function isValidEmail() {
    const emailElem = FOOTER_FORM.querySelector("#email")
    const email = emailElem.value
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    const abInputGroup = emailElem.parentNode
    if (!isValid && abInputGroup) {
        abInputGroup.classList.add("warning")
        setPropertyValid("email", false)
    } else {
        setPropertyValid("email", true)
    }
}

function isValidText() {
    const textElem = FOOTER_FORM.querySelector("#text")
    const text = textElem.value
    const textLength = text.trim().length
    const isValid = textLength >= 10 && textLength <= 1000
    const abInputGroup = textElem.parentNode
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
    if (abCheckRequred) {
        abCheckRequred.classList.remove("warning")
        spanText.innerText = "I have read and agree to the Privacy Policy and Terms of Service"
    }
}

function isValidCheckbox() {
    const abCheckRequred = FOOTER_FORM.querySelector(".ab-check-requred")
    const checkedRequered = FOOTER_FORM.querySelector("#checkedRequered")

    setPropertyValid("checkbox", checkedRequered.checked)

    if (!checkedRequered.checked && abCheckRequred) {
        abCheckRequred.classList.add("warning")
        const spanText = FOOTER_FORM.querySelector("#checkbox-text")

        spanText.innerText = "In order to submit your message, you need to accept our privacy policy and terms of conditions"
    } else {
        cleanCheckbox()
        isSubmit()
    }
}


async function onSubmit(token) {
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
        SUBMIT_BUTTON.disabled = false
    } else {
        handleFormFooterResponse()
    }

}

function handleFormFooterResponse() {
    // flow: add UI response -> insert as first element of ab-form-inbox -> change grid-template-areas into ab-form-input-box-success
    const abFormInbox = FOOTER_FORM.querySelector(".ab-form-input-box")
    const div = document.createElement("div")

    div.className = "ui-response"
    div.style = "min-width: 100% !important; padding: 35px 44.91px; border: 1px solid var(--ab_violet)"
    div.innerHTML = "<span style='font-family: var(--ab_primary-font);font-style:normal;font-weight: 800;font-size: 16px;line-height:20px;letter-spacing:-0.5px;color: var(--ab_violet);'><object data='./assests/image/checkmark.svg'></object> Thank you</span ><p class='p' style='margin-top: 18.58px; color: var(--ab_violet)'>Your message has been sent.</p>"

    abFormInbox.insertBefore(div, abFormInbox.firstChild)
    abFormInbox.classList.add("ab-form-input-box-success")

    FOOTER_FORM.querySelector("#name").parentNode.style.display = "none"
    FOOTER_FORM.querySelector("#email").parentNode.style.display = "none"
    FOOTER_FORM.querySelector("#text").parentNode.style.display = "none"
    FOOTER_FORM.querySelector("#text").parentNode.style.display = "none"
    FOOTER_FORM.querySelector("#checkedRequered").checked = false
}

function handleErrorForm() {
    isValidName()
    isValidEmail()
    isValidText()
    isValidCheckbox()
}

function validate(e) {
    e.preventDefault()
    isSubmit()
    if (!IS_SUBMIT) {
        handleErrorForm()
        SUBMIT_BUTTON.disabled = true
    } else {
        grecaptcha.execute()
    }
}

function onload() {
    var element = document.getElementById('submit');
    element.onclick = validate;
}