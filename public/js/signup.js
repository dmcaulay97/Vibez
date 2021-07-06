const signUp = async () => {
    const username = document.querySelector('#username').value.trim();
    const password = document.querySelector('#password').value.trim();
    const email = document.querySelector('#email').value.trim();


    if (username && password) {
        const response = await fetch('/api/users/', {
            method: 'POST',
            body: JSON.stringify({ username, password, email }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            document.location.replace('/');
        } else {
            alert(response.statusText);
        }
    }
}

const signUpBtn = document.querySelector('#signup');

signUpBtn.addEventListener('click', (e) => {
    e.preventDefault();
    signUp();
});
