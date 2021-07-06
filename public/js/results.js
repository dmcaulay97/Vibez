//Give all songs an eventlistener that brings up video when clicked
const songEvent = () => {
    const songArray = document.querySelectorAll('.song');
    songArray.forEach((song) => {
        song.addEventListener('click', async (e) => {
            const info = e.target;
            const name = info.getAttribute('data-name');
            const artist = info.getAttribute('data-artist');
            const videoSearch = await fetch(`/api/search/video/${name} ${artist}`);
            const videoResults = await videoSearch.json();
            const vidId = videoResults.response[0].id;
            const youtube = document.querySelector('#youtube');
            youtube.setAttribute('src', `https://www.youtube.com/embed/${vidId}`)
        });
    });
}

const addEvent = () => {
    const addArray = document.querySelectorAll('.add');
    addArray.forEach((addBtn) => {
        addBtn.addEventListener('click', (e) => {
            const hide = document.querySelector('.addSelectVisable');
            if (hide) {
                hide.setAttribute('class', 'addSelect');
            }
            e.target.previousElementSibling.setAttribute('class', 'addSelectVisable');
        });
    });
}

const addPlaylistEvent = () => {
    const btnArray = document.querySelectorAll('.addToPlaylist');
    btnArray.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const playlist_id = e.target.previousElementSibling.value;
            const name = e.target.parentNode.previousElementSibling.getAttribute('data-name');
            const artist = e.target.parentNode.previousElementSibling.getAttribute('data-artist');
            const videoSearch = await fetch(`/api/search/video/${name} ${artist}`);
            const videoResults = await videoSearch.json();
            const video_id = videoResults.response[0].id;
            console.log(name, artist, video_id, playlist_id);
            const response = await fetch('/api/songs/', {
                method: 'POST',
                body: JSON.stringify({ name, artist, video_id, playlist_id }),
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log(response);
            if (response.ok) {
                alert('Song Added');
            } else {
                alert('Failed to add song to Playlist');
            }
        });
    })
}


songEvent();
addEvent();
addPlaylistEvent();