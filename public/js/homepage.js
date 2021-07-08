//target all playlists and give them all event listeners.
const playlistArray = document.querySelectorAll('.playlist');
playlistArray.forEach((pl) => {
    //The function in this event listener.
    const plDelete = pl.childNodes[2];
    plDelete.addEventListener('click', async (e) => {
        const plId = e.target.parentNode.getAttribute('id');
        const response = await fetch(`api/playlists/${plId}`, {
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

    pl.addEventListener('click', async (e) => {
        console.log(e.target.tagName);
        const unhighlight = document.querySelector('.selectedpl');
        if (unhighlight) {
            unhighlight.setAttribute('class', 'list-group-item playlist d-flex justify-content-between');
        }
        if (e.target.tagName == 'SPAN') {
            const list = e.target.parentNode;
            console.log(list);
            list.setAttribute('class', 'selectedpl list-group-item playlist d-flex justify-content-between')
        } else {
            console.log(e.target);
            e.target.setAttribute('class', 'selectedpl list-group-item playlist d-flex justify-content-between')
        }
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
                    const unhighlight = document.querySelector('.selectedSong');
                    if (unhighlight) {
                        unhighlight.setAttribute('class', 'list-group-item d-flex justify-content-between');
                    }
                    if (e.target.tagName == 'SPAN') {
                        const list = e.target.parentNode;
                        list.setAttribute('class', 'selectedSong list-group-item d-flex justify-content-between')
                    } else {
                        console.log(e.target);
                        e.target.setAttribute('class', 'selectedSong list-group-item d-flex justify-content-between')
                    }
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

document.querySelector('.addPL').addEventListener('click', (e) => {
    const newPL = document.createElement('li');
    newPL.setAttribute('class', 'list-group-item d-flex justify-content-between');
    newPL.innerHTML = '<input type="text" id="playlistName"><span class="createPL">&#10133;</span>';
    const plList = document.querySelector('.plList');
    plList.append(newPL);

    document.querySelector('.createPL').addEventListener('click', async (e) => {
        const name = e.target.previousElementSibling.value;
        const response = await fetch('/api/playlists/', {
            method: 'POST',
            body: JSON.stringify({ name }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (response.ok) {
            location.reload();
        } else {
            alert('Server error, playlist could not be created');
        }
    });
});
