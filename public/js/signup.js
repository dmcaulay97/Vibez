const signupFormHandler = async (event) => {
    event.preventDefault();

    const firstname = document.querySelector('#firstname-signup').value.trim();
    const email = document.querySelector('#email-signup').value.trim();
    const password = document.querySelector('#password-signup').value.trim();

    if (firstname && email && password) {
        const response = await fetch('/api/users', {
            method: 'POST',
            body: JSON.stringify({ firstname, email, password }),
            headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
            document.location.replace('/profile');
        } else {
            alert(response.statusText);
        }
    }
};


document
    .querySelector('.signup-form')
    .addEventListener('submit', signupFormHandler);