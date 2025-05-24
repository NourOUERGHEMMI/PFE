  // Fonction pour filtrer les événements
  document.getElementById('eventFilter').addEventListener('change', function(e) {
      const selectedSector = e.target.value;
      const eventCards = document.querySelectorAll('.event-card');

      eventCards.forEach(card => {
          if (selectedSector === 'all' || card.dataset.sector === selectedSector) {
              card.style.display = 'flex';
          } else {
              card.style.display = 'none';
          }
      });
  });

  // Fonction pour filtrer les idées
  document.getElementById('ideaFilter').addEventListener('change', function(e) {
      const selectedSector = e.target.value;
      const ideaCards = document.querySelectorAll('.idea-card');

      ideaCards.forEach(card => {
          if (selectedSector === 'all' || card.dataset.sector === selectedSector) {
              card.style.display = 'block';
          } else {
              card.style.display = 'none';
          }
      });
  });

  // Fonction pour supprimer une idée
  document.querySelectorAll('.delete-idea-btn').forEach(button => {
      button.addEventListener('click', async function() {
          const ideaId = this.dataset.ideaId;
          if (confirm('Are you sure you want to delete this idea?')) {
              try {
                  const response = await fetch(`/api/ideas/${ideaId}`, {
                      method: 'DELETE',
                      headers: {
                          'Content-Type': 'application/json'
                      }
                  });

                  if (response.ok) {
                      this.closest('.idea-card').remove();
                  } else {
                      alert('Failed to delete idea');
                  }
              } catch (error) {
                  console.error('Error:', error);
                  alert('An error occurred while deleting the idea');
              }
          }
      });
  });

  // Fonction pour charger les événements depuis la base de données
  async function loadEvents() {
      try {
          const response = await fetch('/api/events');
          const events = await response.json();

          const eventsList = document.querySelector('.events-list');
          eventsList.innerHTML = ''; // Clear existing events

          events.forEach(event => {
              const eventCard = `
                    <div class="event-card" data-sector="${event.sector}">
                        <img src="${event.image}" alt="${event.title}" />
                        <div class="event-info">
                            <span class="event-type">${event.title}</span>
                            <p>${event.description}</p>
                            <div class="event-meta">
                                <span>${event.date}</span>
                                <span>${event.time}</span>
                            </div>
                        </div>
                    </div>
                `;
              eventsList.innerHTML += eventCard;
          });
      } catch (error) {
          console.error('Error loading events:', error);
      }
  }

  // Fonction pour charger les idées depuis la base de données
  async function loadIdeas() {
      try {
          const response = await fetch('/api/ideas');
          const ideas = await response.json();

          const ideasList = document.querySelector('.ideas-list');
          ideasList.innerHTML = ''; // Clear existing ideas

          ideas.forEach(idea => {
              const ideaCard = `
                    <div class="idea-card" data-sector="${idea.sector}">
                        <h4>${idea.title}</h4>
                        <p>${idea.description}</p>
                        <button class="delete-idea-btn" data-idea-id="${idea.id}">
                            <img src="after_co/poub.png" alt="Delete">
                        </button>
                    </div>
                `;
              ideasList.innerHTML += ideaCard;
          });
      } catch (error) {
          console.error('Error loading ideas:', error);
      }
  }


  function showEditProfile() {
      document.querySelector('.profile-info').style.display = 'none';
      document.querySelector('.profile-edit').style.display = 'flex';
  }

  function submitEditProfile() {
      document.querySelector('.profile-edit').style.display = 'none';
      document.querySelector('.profile-info').style.display = 'flex';
  }

function openModal(btn) {
    document.getElementById('modalCategory').innerText = btn.dataset.category;
    document.getElementById('modalType').innerText = btn.dataset.type;
    document.getElementById('modalBtnType').innerText = btn.dataset.type;
    document.getElementById('modalDescription').innerText = btn.dataset.description;
    document.getElementById('documentModal').style.display = 'flex';
}

        