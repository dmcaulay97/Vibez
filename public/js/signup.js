const signUp = async () => {
    const name = document.querySelector('#name').value.trim();
    const password = document.querySelector('#password').value.trim();
    const email = document.querySelector('#email').value.trim();


    if (name && password) {
        const response = await fetch('/api/users/', {
            method: 'POST',
            body: JSON.stringify({ name, password, email }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            document.location.replace('/homepage');
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
