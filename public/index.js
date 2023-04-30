
    function addEventListeners() {

        const closeUpdateModalBtn = document.getElementById('close-update-modal');
    closeUpdateModalBtn.addEventListener('click', () => {
      const updateModal = document.getElementById('update-modal');
      updateModal.classList.add('hidden');
    });
  
    const updateAlbumForm = document.getElementById('update-album-form');
    updateAlbumForm.addEventListener('submit', async (event) => {
      event.preventDefault();
  
      const formData = new FormData(updateAlbumForm);
      const id = updateAlbumForm.elements['update-album-id'].value;
      const updatedAlbum = {
        title: formData.get('title'),
        artist: formData.get('artist'),
        year: parseInt(formData.get('year'))
      };
  
      const response = await fetch(`/api/albums/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAlbum)
      });
  
      if (response.ok) {
        fetchAlbums();
        const updateModal = document.getElementById('update-modal');
        updateModal.classList.add('hidden');
      } else {
        alert('Error: Album could not be updated.');
      }
    });
  
        
        // Event listeners for delete buttons
        const deleteButtons = document.querySelectorAll('.delete-album');
        deleteButtons.forEach((btn) => {
          btn.addEventListener('click', async (event) => {
            const id = event.target.getAttribute('data-id');
            const response = await fetch(`/api/albums/${id}`, { method: 'DELETE' });
  
            if (response.ok) {
              fetchAlbums();
            } else {
              alert('Error: Album could not be deleted.');
            }
          });
        });
  
  
        const updateButtons = document.querySelectorAll('.update-album');
        updateButtons.forEach((btn) => {
          btn.addEventListener('click', async (event) => {
            const id = event.target.getAttribute('data-id');
            const response = await fetch(`/api/albums/${id}`);
            const album = await response.json();
  
            const updateModal = document.getElementById('update-modal');
            updateModal.classList.remove('hidden');
  
            const updateForm = document.getElementById('update-album-form');
            updateForm.elements['update-album-id'].value = album._id;
            updateForm.elements['title'].value = album.title;
            updateForm.elements['artist'].value = album.artist;
            updateForm.elements['year'].value = album.year;
          });
        });
  
  
        // Event listeners for details buttons
        const showDetailsButtons = document.querySelectorAll('.show-details');
        showDetailsButtons.forEach((btn) => {
          btn.addEventListener('click', (event) => {
            const id = event.target.getAttribute('data-id');
            const details = document.getElementById(`details-${id}`);
            details.classList.toggle('hidden');
          });
        });
      }
      // Fetch and display albums
      async function fetchAlbums() {
        const response = await fetch('/api/albums');
        const albums = await response.json();
        const albumsTbody = document.getElementById('albums-tbody');
        albumsTbody.innerHTML = '';
  
        for (const album of albums) {
          const tr = document.createElement('tr');
  
          const titleTd = document.createElement('td');
          titleTd.textContent = album.title;
          tr.appendChild(titleTd);
  
          const actionsTd = document.createElement('td');
          tr.appendChild(actionsTd);
  
          const detailsDiv = document.createElement('div');
          detailsDiv.id = `details-${album._id}`;
          detailsDiv.classList.add('hidden');
          detailsDiv.innerHTML = `
                <p>Artist: ${album.artist}</p>
                <p>Year: ${album.year}</p>
              `;
          titleTd.appendChild(detailsDiv);
  
          const updateBtn = document.createElement('button');
          updateBtn.textContent = 'Update';
          updateBtn.classList.add('update-album');
          updateBtn.setAttribute('data-id', album._id);
          actionsTd.appendChild(updateBtn);
  
          const deleteBtn = document.createElement('button');
          deleteBtn.textContent = 'Delete';
          deleteBtn.classList.add('delete-album');
          deleteBtn.setAttribute('data-id', album._id);
          actionsTd.appendChild(deleteBtn);
  
          const showDetailsBtn = document.createElement('button');
          showDetailsBtn.textContent = 'Details';
          showDetailsBtn.classList.add('show-details');
          showDetailsBtn.setAttribute('data-id', album._id);
          actionsTd.appendChild(showDetailsBtn);
  
          albumsTbody.appendChild(tr);
        }
        addEventListeners();
      }
  
      fetchAlbums();
  
      // Handle form submission for creating a new album
      const newAlbumForm = document.getElementById('new-album-form');
      newAlbumForm.addEventListener('submit', async (event) => {
        event.preventDefault();
  
        const formData = new FormData(newAlbumForm);
        const newAlbum = {
          title: formData.get('title'),
          artist: formData.get('artist'),
          year: parseInt(formData.get('year'))
        };
  
        const response = await fetch('/api/albums', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newAlbum)
        });
  
        if (response.ok) {
          fetchAlbums(); // Ensure this line is present
          newAlbumForm.reset();
        } else {
          alert('Error: Album could not be added.');
        }
      });
  