let contacts = JSON.parse(localStorage.getItem('contacts')) || [];
let autoDialIndex = 0;

function loadContacts() {
  const table = document.getElementById('contactsTable');
  table.innerHTML = '';
  contacts.forEach((contact, index) => {
    const statusClass = contact.called ? 'red-light' : index === autoDialIndex ? 'orange-light' : 'green-light';
    table.innerHTML += `
      <tr>
        <td>${contact.number}</td>
        <td>${contact.name || 'N/A'}</td>
        <td><span class="status-light ${statusClass}"></span></td>
        <td><button onclick="makeCall(${index})">Dial</button></td>
      </tr>
    `;
  });
}

function processContacts() {
  const numbers = document.getElementById('inputText').value.trim().split('\n');
  const names = document.getElementById('inputNames').value.trim().split(',');
  numbers.forEach((number, index) => {
    number = number.trim();
    if (!number.startsWith('0') && !number.startsWith('+20')) {
      number = '0' + number;
    }
    contacts.push({ number, name: names[index]?.trim() || '', called: false });
  });
  localStorage.setItem('contacts', JSON.stringify(contacts));
  loadContacts();
}

function makeCall(index) {
  contacts[index].called = true;
  autoDialIndex = index + 1 < contacts.length ? index + 1 : 0;
  localStorage.setItem('contacts', JSON.stringify(contacts));
  loadContacts();
  window.location.href = `tel:${contacts[index].number}`;
}

function clearAllContacts() {
  contacts = [];
  autoDialIndex = 0;
  localStorage.removeItem('contacts');
  loadContacts();
}

function autoDialAll() {
  autoDialIndex = contacts.findIndex(contact => !contact.called);
  if (autoDialIndex === -1) {
    alert('No uncalled numbers left.');
    return;
  }

  const interval = setInterval(() => {
    if (autoDialIndex < contacts.length && !contacts[autoDialIndex].called) {
      makeCall(autoDialIndex);
      autoDialIndex = contacts.findIndex(contact => !contact.called);
    } else {
      clearInterval(interval);
    }
  }, 5000); // Calls every 5 seconds
}

window.onload = loadContacts;