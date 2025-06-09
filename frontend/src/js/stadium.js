import { showErrorMessage } from './utils.js'

const apiBase = '/api/stadiums'

// Bieżąca lista stadionów (wskaźnik aktualnego stanu, żeby przy edycji uniknąć ponownego fetcha całej listy)
let stadiums = []

// Elementy DOM
const appEl = document.getElementById('app')
const formContainer = document.getElementById('form-container')
const showAddFormBtn = document.getElementById('show-add-form')


// -------------- FUNKCJE AJAX --------------

export async function fetchStadiums() {
  try {
    const res = await fetch(apiBase)
    stadiums = await res.json()
    renderList()
  } catch (err) {
    showErrorMessage('Błąd podczas pobierania stadionów', err)
    // errorMessageDiv.textContent = 'Błąd podczas pobierania stadionów'
    // console.error('Błąd podczas pobierania stadionów:', err)
  }
}

async function createStadium(data) {
  try {
    const res = await fetch(apiBase, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error(`Błąd tworzenia: ${res.status}`)
    await fetchStadiums()
  } catch (err) {
    showErrorMessage('Błąd podczas dodawania stadionu', err)
    // errorMessageDiv.textContent = 'Błąd podczas dodawania stadionu'
    // console.error('Błąd podczas dodawania stadionu:', err)
  }
}

async function updateStadium(id, data) {
  try {
    const res = await fetch(`${apiBase}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!res.ok) throw new Error(`Błąd edycji: ${res.status}`)
    await fetchStadiums()
  } catch (err){
    showErrorMessage('Błąd podczas aktualizacji stadionu', err)
    // errorMessageDiv.textContent = 'Błąd podczas aktualizacji stadionu'
    // console.error('Błąd podczas aktualizacji stadionu:', err)
  }
}

async function deleteStadium(id) {
  if (!confirm('Na pewno usunąć ten stadion?')) return
  try {
    const res = await fetch(`${apiBase}/${id}`, {
      method: 'DELETE'
    })
    if (res.status !== 204) throw new Error(`Błąd usuwania: ${res.status}`)
    await fetchStadiums()
  } catch (err){
    showErrorMessage('Błąd podczas usuwania stadionu', err)
    // errorMessageDiv.textContent = 'Błąd podczas usuwania stadionu'
    // console.error('Błąd podczas usuwania stadionu:', err)
  }
}

// -------------- RENDEROWANIE LISTY --------------

function renderList() {
  if (!stadiums.length) {
    appEl.innerHTML = `<p class="text-gray-600">Brak stadionów w bazie.</p>`
    return
  }

  appEl.innerHTML = `
    <ul class="space-y-2">
      ${stadiums.map(s => `
        <li class="flex items-center justify-between p-2 bg-white rounded shadow">
          <div>
            <strong>${s.name}</strong><br>
            <span class="text-gray-600 text-sm">${s.city}, ${s.street} ${s.numberBuilding} (poj. ${s.capacity})</span>
          </div>
          <div class="space-x-2">
            <button class="edit-btn text-yellow-600 hover:text-yellow-800" data-id="${s.id}">
              Edytuj
            </button>
            <button class="delete-btn text-red-600 hover:text-red-800" data-id="${s.id}">
              Usuń
            </button>
          </div>
        </li>
      `).join('')}
    </ul>
  `

  // Podczepiamy obsługę kliknięcia „Edytuj” i „Usuń”
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      deleteStadium(id)
    })
  })
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id
      const stadium = stadiums.find(x => x.id == id)
      if (stadium) showEditForm(stadium)
    })
  })
}

// -------------- FORMULARZE --------------

function clearFormContainer() {
  formContainer.innerHTML = ''
  formContainer.classList.add('hidden')
}

// 1) Formularz dodawania nowego stadionu
function showAddForm() {
  formContainer.innerHTML = `
    <div class="bg-white p-4 rounded shadow mb-4">
      <h2 class="text-xl font-semibold mb-2">Nowy stadion</h2>
      <form id="add-form" class="space-y-4">
        <div>
          <label class="block text-sm font-medium">Nazwa</label>
          <input type="text" name="name" required class="mt-1 w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium">Miasto</label>
          <input type="text" name="city" required class="mt-1 w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium">Ulica</label>
          <input type="text" name="street" required class="mt-1 w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium">Numer budynku</label>
          <input type="text" name="numberBuilding" required class="mt-1 w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium">Pojemność</label>
          <input type="number" name="capacity" required min="0" class="mt-1 w-full border rounded px-2 py-1" />
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" id="cancel-add" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Anuluj</button>
          <button type="submit" class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">Zapisz</button>
        </div>
      </form>
    </div>
  `
  formContainer.classList.remove('hidden')

  // Obsługa anulowania
  document.getElementById('cancel-add').addEventListener('click', () => {
    clearFormContainer()
  })

  // Obsługa wysłania formularza
  document.getElementById('add-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get('name'),
      city: formData.get('city'),
      street: formData.get('street'),
      numberBuilding: formData.get('numberBuilding'),
      capacity: parseInt(formData.get('capacity'), 10),
    }
    await createStadium(payload)
    clearFormContainer()
  })
}

// 2) Formularz edycji istniejącego stadionu
function showEditForm(stadium) {
  formContainer.innerHTML = `
    <div class="bg-white p-4 rounded shadow mb-4">
      <h2 class="text-xl font-semibold mb-2">Edytuj stadion</h2>
      <form id="edit-form" class="space-y-4">
        <input type="hidden" name="id" value="${stadium.id}" />
        <div>
          <label class="block text-sm font-medium">Nazwa</label>
          <input type="text" name="name" required value="${stadium.name}" class="mt-1 w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium">Miasto</label>
          <input type="text" name="city" required value="${stadium.city}" class="mt-1 w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium">Ulica</label>
          <input type="text" name="street" required value="${stadium.street}" class="mt-1 w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium">Numer budynku</label>
          <input type="text" name="numberBuilding" required value="${stadium.numberBuilding}" class="mt-1 w-full border rounded px-2 py-1" />
        </div>
        <div>
          <label class="block text-sm font-medium">Pojemność</label>
          <input type="number" name="capacity" required min="0" value="${stadium.capacity}" class="mt-1 w-full border rounded px-2 py-1" />
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" id="cancel-edit" class="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Anuluj</button>
          <button type="submit" class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600">Zapisz zmiany</button>
        </div>
      </form>
    </div>
  `
  formContainer.classList.remove('hidden')

  // Anulowanie edycji → chowanie formularza
  document.getElementById('cancel-edit').addEventListener('click', () => {
    clearFormContainer()
  })

  // Obsługa wysłania formularza edycji
  document.getElementById('edit-form').addEventListener('submit', async (e) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const id = formData.get('id')
    const payload = {
      name: formData.get('name'),
      city: formData.get('city'),
      street: formData.get('street'),
      numberBuilding: formData.get('numberBuilding'),
      capacity: parseInt(formData.get('capacity'), 10),
    }
    await updateStadium(id, payload)
    clearFormContainer()
  })
}

// -------------- OBSŁUGA PRZYCISKÓW --------------

showAddFormBtn.addEventListener('click', () => {
  // Jeśli formularz był widoczny, schowaj go w przeciwnym razie pokaż
  if (formContainer.classList.contains('hidden')) {
    showAddForm()
  } else {
    clearFormContainer()
  }
})

fetchStadiums()