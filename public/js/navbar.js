const logout = async () => {
    const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });

    if (response.ok) {
        document.location.replace('/');
    } else {
        alert(response.statusText);
    }
};

const search = (e) => {
    e.preventDefault();
    const searchType = document.querySelector('#searchType').value;
    const searchTerm = document.querySelector('#searchTerm').value.trim();
    document.location.replace(`/results/${searchType}/${searchTerm}/1`);
}

document.querySelector('#logout').addEventListener('click', logout);

const searchbtn = document.querySelector("#search").addEventListener('click', search);