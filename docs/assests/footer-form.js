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

function ch(event) {
    console.log('e', event.target.value)
}

function listenForChanges() {  // listens for onchange event of all inputs
    const [name, email, text] = [FOOTER_FORM.querySelector('#name'), FOOTER_FORM.querySelector('#email'), FOOTER_FORM.querySelector('#text'),]
    name.addEventListener('input', (e) => {
        isValidName()
        if (validInputs['name']) {
            cleanInput(e)
        }
    });
    email.addEventListener('input', (e) => {
        isValidEmail()
        if (validInputs['email']) {
            cleanInput(e)
        }
    });
    text.addEventListener('input', (e) => {
        isValidText()
        if (validInputs['text']) {
            cleanInput(e)
        }
    });
}

async function onSubmit(token) {
    const [name, email, text] = getElemValuesByIds(['name', 'email', 'text'])
    const submitBtn = FOOTER_FORM.querySelector('#submit')

    submitBtn.innerHTML = "sending"
    
    const asyncSubmit = async () => {
        const result = { message: "", errorMessage: null, status: null }

        const res = await fetch("https://api.accbuddy.com/public", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "sendMessage": {
                    "token": token,
                    "name": name,
                    "email": email,
                    "message": text
                }
            })
        })
        const json = await res.json()
        if (!res.ok && res.status == 400) {
            const ERROR = json.error
            result.status = res.status
            result.errorMessage = ERROR
        } else if (res.ok) {
            const MESSAGE = json.result
            result.message = MESSAGE
        }
        return result
    }

    SUBMIT_BUTTON.disabled = true
    const result = await asyncSubmit()
    submitBtn.innerHTML = "send"

    if (result.errorMessage !== null) {
        handleFormFooterError(result.errorMessage)
    } else {
        handleFormFooterResponse(result.message)
    }
    SUBMIT_BUTTON.disabled = false
}

function closeErrorPlank() {
    const plank = document.querySelector("#footer-error-plank")
    plank.classList.add("hidden")
    grecaptcha.reset()
}

function handleFormFooterError(errorMessage) {
    const plank = document.querySelector("#footer-error-plank")
    const plankMessageElem = plank.querySelector(".plank")

    plank.classList.remove("hidden")
    plankMessageElem.innerHTML = errorMessage

}

function handleFormFooterResponse(message) {
    const plank = document.querySelector("#footer-error-plank")
    plank.classList.add("hidden")
    // flow: add UI response -> insert as first element of ab-form-inbox -> change grid-template-areas into ab-form-input-box-success
    const abFormInbox = FOOTER_FORM.querySelector(".ab-form-input-box")
    const closeSvgElement = "<img onclick='handleCloseFormFooter()' style='display: block;margin-left: auto;' class='' src='./assests/image/footer-close.svg' alt='close_icon'>"

    const div = document.createElement("div")

    div.className = "ui-response"
    div.style = "height: 141px; min-width: 100% !important; padding: 35px 44.91px;padding-top: 10.15px;padding-right: 10.1px; border: 1px solid var(--ab_violet)"
    div.innerHTML = closeSvgElement + "<span style='font-family: var(--ab_primary-font);font-style:normal;font-weight: 800;font-size: 16px;line-height:20px;letter-spacing:-0.5px;color: var(--ab_violet);'><object data='./assests/image/checkmark.svg'></object> Thank you</span ><p class='p' style='margin-top: 18.58px; color: var(--ab_violet)'>" + message + "</p>"

    abFormInbox.insertBefore(div, abFormInbox.firstChild)
    abFormInbox.classList.add("ab-form-input-box-success")

    FOOTER_FORM.querySelector("#name").parentNode.style.display = "none"
    FOOTER_FORM.querySelector("#email").parentNode.style.display = "none"
    FOOTER_FORM.querySelector("#text").parentNode.style.display = "none"
    FOOTER_FORM.querySelector("#label-checkbox").parentNode.style.visibility = "hidden"
    FOOTER_FORM.querySelector("#submit").parentNode.style.visibility = "hidden"
    FOOTER_FORM.querySelector("#checkedRequered").checked = false
}

function handleCloseFormFooter() {
    const abFormInbox = FOOTER_FORM.querySelector(".ab-form-input-box")
    const uiResponse = FOOTER_FORM.querySelector(".ui-response")

    abFormInbox.classList.remove("ab-form-input-box-success")
    abFormInbox.removeChild(uiResponse);
    FOOTER_FORM.querySelector("#name").parentNode.style.display = "block"
    FOOTER_FORM.querySelector("#name").value = ""
    FOOTER_FORM.querySelector("#email").parentNode.style.display = "block"
    FOOTER_FORM.querySelector("#email").value = ""
    FOOTER_FORM.querySelector("#text").parentNode.style.display = "block"
    FOOTER_FORM.querySelector("#text").value = ""
    FOOTER_FORM.querySelector("#label-checkbox").parentNode.style.visibility = "visible"
    FOOTER_FORM.querySelector("#submit").parentNode.style.visibility = "visible"
    FOOTER_FORM.querySelector("#checkedRequered").checked = false
    grecaptcha.reset()
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
        listenForChanges()
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