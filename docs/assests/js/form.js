const SIGNUP_FORM = document.querySelector("#signup-form")

class Input {
    // onblur will validate
    // onfocus will clean
    // submit button remains active until invalid submit
    // submit button becomes active when all inputs are valid
    // show all errors on invalid submit

    constructor({ id = "", doc = document, name = undefined, validation = "" }) {
        this.element = doc.querySelector(`#${id}`)
        this.parent = this.element.parentElement
        this.error = this.parent.querySelector('.alart-text')
        this.validation = validation
        this.name = name

        this.element.addEventListener('focus', () => this.cleanError())
        this.element.addEventListener('blur', () => this.handleInput())
    }

    get isValid() {
        return this.validation.test(this.element.value)
    }

    handleInput() {
        if (false === this.isValid) {
            this.parent.classList.add('warning')
            this.error.style.display = 'flex'
        } else {
            if (Input.HAS_SUBMITTED && Input.ALL_VALID) {
                SUBMIT_BUTTON.disabled = false
            }
            this.cleanError()
        }
    }

    cleanError() {
        this.parent.classList.remove('warning')
        this.error.style.display = 'none'
    }
}

class ConfirmInput extends Input {
    constructor({ id = "", doc = document, name = undefined, elemId = "signup-password" }) {
        super({ id, name })
        this.elem2 = doc.querySelector(`#${elemId}`)
        this.element.addEventListener('focus', () => this.cleanError())
    }

    get isValid() {
        return this.element.value === this.elem2.value
    }

    handleInput() {
        const isElem2Valid = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[a-zA-Z\d@$!%*#?&]{8,}$/.test(this.elem2.value)
        if (this.element.value.length && isElem2Valid) {
            super.handleInput()
        }
    }
}

class CheckboxInput extends Input {
    constructor({ id = "", name = undefined, }) {
        super({ id, name })
        this.parent = this.parent.parentElement
        this.error = this.parent.querySelector('.alart-text')
        this.element.addEventListener('input', () => {
            this.handleInput()
        })
    }

    get isValid() {
        return this.element.checked
    }
}

const signupForm = {
    email: new Input({ id: 'signup-email', name: 'email', validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }),
    password: new Input({ id: 'signup-password', name: 'password', validation: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[a-zA-Z\d@$!%*#?&]{8,}$/ }),
    checkbox: new CheckboxInput({ id: 'checkedRequered4', name: 'checkbox', }),

}
signupForm.confirmPassword = new ConfirmInput({ id: 'signup-confirm-password', name: 'confirmPassword', elemId: 'signup-password' })
const SIGN_UP_KEYS = Object.keys(signupForm)

const SUBMIT_BUTTON = SIGNUP_FORM.querySelector('#signup-submit')
SUBMIT_BUTTON.onclick = validate

var SUBMITTED_ONCE = false

function postSubmitInputsHandler() {
    var isAllValid = true
    for (let prop of SIGN_UP_KEYS) {
        const input = signupForm[prop]
        if (input.isValid === false) {
            isAllValid = false
            break
        }
    }

    return isAllValid
}

function loadPostSubmitHandlers() {
    for (let key of SIGN_UP_KEYS) {
        const input = signupForm[key]
        input.element.addEventListener('input', () => {
            if (SUBMIT_BUTTON.disabled === true) {
                SUBMIT_BUTTON.disabled = !postSubmitInputsHandler()
            }
        })
    }
}

function validate(e) {
    e.preventDefault()
    SUBMIT_BUTTON.disabled = true
    let isFormValid = true

    if (SUBMITTED_ONCE === false) {
        SUBMITTED_ONCE = true
        loadPostSubmitHandlers()
    }

    const keys = Object.keys(signupForm)
    for (let prop of keys) {
        const input = signupForm[prop]
        input.handleInput()
        if (isFormValid == true && input.isValid === false) {
            isFormValid = false
        }
    }

    if (isFormValid === false) {
        return
    }
    grecaptcha.execute()
}

async function handleSubmit(token) {
    SUBMIT_BUTTON.disabled = true
    SUBMIT_BUTTON.innerHTML = "Signing up"

    const result = await asyncSubmit(token)
    SUBMIT_BUTTON.innerHTML = "Sign up"

    let plankSuccess = document.querySelector('#plank-success-id')
    let plankError = document.querySelector('#plank-error-id')

    if (result.errorMessage !== null) {
        plankError.classList.remove("hidden")
        plankSuccess.classList.add("hidden")

        const plankClose = plankError.querySelector("#plank-close")
        plankClose.addEventListener('click', () => {
            plankError.classList.add("hidden")
        })

        SUBMIT_BUTTON.disabled = true
    } else {
        plankSuccess.classList.remove("hidden")
        plankError.classList.add("hidden")

        const plankClose = plankSuccess.querySelector("#plank-close")
        plankClose.addEventListener('click', () => {
            plankSuccess.classList.add("hidden")
        })

        SUBMIT_BUTTON.disabled = false
    }
    grecaptcha.reset()
}

async function asyncSubmit(token) {
    const result = { message: "", errorMessage: null, status: null }

    const res = await fetch("https://api.accbuddy.com/public", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "signup": {
                "token": token,
                "user": {
                    "username": signupForm.email.element.value,
                    "password": signupForm.password.element.value
                }
            }
        })
    })
    const json = await res.json()
    if (!res.ok && res.status == 400) {
        console.log('json response', json)
        const ERROR = json.error
        result.status = res.status
        result.errorMessage = ERROR
    } else if (res.ok) {
        const MESSAGE = json.result
        result.message = MESSAGE
        SIGNUP_FORM.reset()
    }
    console.log('normalized result', result)
    return result
}

function loadScriptOnce() {
    let isGrecaptachaLoaded = false

    // closure is utilized to implement boolean variable for loading once condition
    function loadScript() {
        // every focus of inputs will go check if it is loaded
        // because of closure, isGrecaptachaLoaded will be always tracked by loadscript function
        if (!isGrecaptachaLoaded) {
            const script = document.createElement('script');
            script.src = "https://www.google.com/recaptcha/api.js";
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
            isGrecaptachaLoaded = true;
        }
    }

    const div = document.createElement('div')
    div.innerHTML = "<div class='g-recaptcha' data-sitekey='6LcShYkmAAAAAA_FN5w0Oewh_-7XzIocjZlX6apw'data-callback='handleSubmit' data-size='invisible'></div>"
    const divRecaptcha = div.firstElementChild
    SIGNUP_FORM.appendChild(divRecaptcha)

    loadScript()
}

loadScriptOnce()


function loadTogglePassword() {
    const imgEyes = document.querySelectorAll('.toggle-eye')
    let toggle = false

    function togglePassword() {
        toggle = !toggle
    }

    imgEyes.forEach(img => {
        const abInputGroup = img.parentElement.parentElement
        const passwordInput = abInputGroup.querySelector('input[type="password"]')

        img.addEventListener('click', () => {
            togglePassword()
            passwordInput.type = toggle ? "text" : "password"
        })
    })
}

loadTogglePassword()