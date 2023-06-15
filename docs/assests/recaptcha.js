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
    const inputs = [form.querySelector('#name'),form.querySelector('#email'), form.querySelector('#text')]

    inputs.forEach(function (input) {
        input.addEventListener('focus', loadScript);
    });
}

function onSubmit(token) {
    const [name, email, text] = getElemValuesByIds(['name', 'email', 'text'])
    const asyncSubmit = async () => {
        const res = await fetch("https://api.accbuddy.com/public", {
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
        })

        const response = await res.json()
        console.log('response', response)
    }

    asyncSubmit()
}