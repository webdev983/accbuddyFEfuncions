const getElemValuesByIds = (ids) => {
    return Array.from(ids).map(id => {
        const elem = document.getElementById(id)
        return elem.value
    })
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

    const form = document.querySelector('#footer-form');
    const inputs = [form.querySelector('#name'), form.querySelector('#email'), form.querySelector('#text')]

    inputs.forEach(function (input) {
        input.addEventListener('focus', loadScript);
    });
}

async function onSubmit(token) {
    const [name, email, text] = getElemValuesByIds(['name', 'email', 'text'])
    FOOTER_FORM.querySelector("#submit").innerText = "Sending..."


    const asyncSubmit = async () => {
        return true
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
        const submitBtn = FOOTER_FORM.querySelector("#submit")
        submitBtn.innerText = "Sending..."
        handleFormFooterResponse()
        submitBtn.innerText = "Send"
    } else {
        alert("Sending failed.")
    }
}

function handleFormFooterResponse() {
    // flow: add UI response -> insert as first element of ab-form-inbox -> change grid-template-areas into ab-form-input-box-success
    const abFormInbox = FOOTER_FORM.querySelector(".ab-form-input-box")
    const div = document.createElement("div")

    div.className = "ui-response"
    div.style = "padding: 35px 44.91px; border: 1px solid var(--ab_violet)"
    div.innerHTML = "<span style='font-family: var(--ab_primary-font);font-style:normal;font-weight: 800;font-size: 16px;line-height:20px;letter-spacing:-0.5px;color: var(--ab_violet);'><object data='./assests/image/checkmark.svg'></object> Thank you</span ><p class='p' style='margin-top: 18.58px; color: var(--ab_violet)'>Your message has been sent.</p>"

    console.log('abFormInbox', div)
    abFormInbox.insertBefore(div, abFormInbox.firstChild)
    // abFormInbox.classList.remove("ab-form-input-box")
    abFormInbox.classList.add("ab-form-input-box-success")

    FOOTER_FORM.querySelector("#name").parentNode.style.display = "none"
    FOOTER_FORM.querySelector("#email").parentNode.style.display = "none"
    FOOTER_FORM.querySelector("#text").parentNode.style.display = "none"
    FOOTER_FORM.querySelector("#text").parentNode.style.display = "none"
    FOOTER_FORM.querySelector("#checkedRequered").checked = false

}