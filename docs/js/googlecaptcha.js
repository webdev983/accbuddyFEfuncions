let isDirty = false;
async function loadRecaptchaScript () {
  if(isDirty){
    return
  }else{
    var script = document.createElement('script');
    script.src = 'https://www.google.com/recaptcha/api.js?render=6LcShYkmAAAAAA_FN5w0Oewh_-7XzIocjZlX6apw';
    script.async = true;
    
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
    isDirty = true;
  }
}


function enableButton() {
  var name_check = document.getElementById("name").value;
  var email_check = document.getElementById("email").value;
  var message_check = document.getElementById("footerMessage").value;
  var checkbox_check = document.getElementById("checkedRequired");
  var sendButton_check = document.getElementById("sendButton");
  var isEmailValid = validateEmail(email_check);

  if (name_check && email_check && isEmailValid && message_check && checkbox_check.checked) {
    sendButton_check.disabled = false;
  } else {
    sendButton_check.disabled = true;
  }
}

function validateEmail(email) {
  // Regular expression to validate email format
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

let token = null;

function callExternalAPI(token) {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("footerMessage");
  var checkbox_check = document.getElementById("checkedRequired");
  const name = nameInput.value;
  const email = emailInput.value;
  const message = messageInput.value;

  const url = 'https://api.accbuddy.com/public';
  const data = {
    data: "submit_message"
    name: name,
    email: email,
    message: message,
    recaptchaToken: token,
  };

  // Send the API request
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json();
      }
      
      return response.json();
    })
    .then(function(data) {
      // Handle the API response
      console.log('Success:', data);
      alert(data.message);
      nameInput.value = '';
      emailInput.value = '';
      messageInput.value = '';
      checkbox_check.checked = false;
    })
    .catch((error) => {
      console.error('Error:', error);
      nameInput.value = '';
      emailInput.value = '';
      messageInput.value = '';
      checkbox_check.checked = false;        
    });
}

function submitForm() {
  grecaptcha.execute('6LcShYkmAAAAAA_FN5w0Oewh_-7XzIocjZlX6apw', { action: 'submit' })
    .then(function(token) {
      callExternalAPI(token);
    });
}
