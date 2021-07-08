//target all playlists and give them all event listeners.
const playlistArray = document.querySelectorAll('.playlist');
playlistArray.forEach((pl) => {
    //The function in this event listener.
    pl.addEventListener('click', async (e) => {
        const id = e.target.getAttribute("id");
        const songData = await fetch(`/api/songs/${id}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
        const songs = await songData.json();
        const resultsList = document.querySelector('#resultsList');
        const oldResults = resultsList.children;
        while (oldResults.length > 1) {
            resultsList.removeChild(resultsList.lastChild);
        }
        songs.forEach((e) => {
            const result = document.createElement("li");
            result.setAttribute('class', 'list-group-item d-flex justify-content-between');
            result.setAttribute('id', `${e.id}`);
            result.setAttribute('data-video-id', `${e.video_id}`);
            result.innerHTML = `<span data-video-id='${e.video_id}'>${e.name} - ${e.artist}</span><span class='deleteSong'>✖️</span>`;
            result.addEventListener('click', (e) => {
                if (e.target.getAttribute('class') != 'deleteSong') {
                    const vidId = e.target.getAttribute('data-video-id');
                    const youtube = document.querySelector('#youtube');
                    youtube.setAttribute('src', `https://www.youtube.com/embed/${vidId}`);
                }
            });
            const deleteSong = result.lastChild;
            deleteSong.addEventListener('click', async (e) => {
                const songId = e.target.parentNode.getAttribute('id');
                const response = await fetch(`api/songs/${songId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
                console.log(response)
                if (response.ok) {
                    e.target.parentNode.remove();
                } else {
                    alert('Server error, song could not be deleted');
                }
            });
            resultsList.appendChild(result);
        });
    });
});
