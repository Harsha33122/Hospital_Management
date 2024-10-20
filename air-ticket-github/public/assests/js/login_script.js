async function login(event) {
    event.preventDefault();

    const emailIdInput = document.getElementById('emailId').value;
    const passwordInput = document.getElementById('password').value;
    const userType = document.getElementById('userType').value;
    const errorMessageElement = document.getElementById('errorMessage');

    // Clear previous error message
    errorMessageElement.style.display = 'none';
    errorMessageElement.textContent = '';

    if (!userType) {
        errorMessageElement.textContent = 'Please select a user type.';
        errorMessageElement.style.display = 'block';
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userType,
                emailId: emailIdInput,
                password: passwordInput
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log(data);
            if (userType === 'admin') {
                window.location.href = 'dashboard';
            } 
            else if( userType === 'patient') {
                window.location.href = 'appointment';
            }
            else {
                window.location.href = 'mypatients';
            }
            console.log(data);
        } else {
            errorMessageElement.textContent = data.message || 'Invalid login credentials. Please try again.';
            errorMessageElement.style.display = 'block';
        }
    } catch (error) {
        errorMessageElement.textContent = 'An error occurred while processing your request. Please try again later.';
        errorMessageElement.style.display = 'block';
    }
}

document.getElementById('loginForm').addEventListener('submit', login);
