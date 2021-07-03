
//target all playlists and give them all event listeners.
const playlistEvent = () => {
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
                result.setAttribute('class', 'list-group-item');
                result.setAttribute('id', `${e.id}`);
                result.setAttribute('data-video-id', `${e.video_id}`);
                result.textContent = `${e.name} - ${e.artist}`;
                result.addEventListener('click', (e) => {
                    const vidId = e.target.getAttribute('data-video-id');
                    console.log(vidId);
                    const youtube = document.querySelector('#youtube');
                    youtube.setAttribute('src', `https://www.youtube.com/embed/${vidId}`);
                });
                resultsList.appendChild(result);
            });
        });
    });
}



playlistEvent();