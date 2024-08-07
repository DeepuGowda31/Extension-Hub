document.addEventListener('DOMContentLoaded', () => {
    const extensionsContainer = document.getElementById('extensions');
    const themeToggle = document.getElementById('theme-toggle');
    const searchBar = document.getElementById('search-bar');
    const extensionDetails = document.getElementById('extension-details');
  
    // Check and apply theme on load
    chrome.storage.local.get('darkMode', (result) => {
      if (result.darkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.checked = true;
      }
    });
  
    // Theme toggle event listener
    themeToggle.addEventListener('change', () => {
      if (themeToggle.checked) {
        document.body.classList.add('dark-mode');
        chrome.storage.local.set({ darkMode: true });
      } else {
        document.body.classList.remove('dark-mode');
        chrome.storage.local.set({ darkMode: false });
      }
    });
  
    function loadExtensions() {
      chrome.management.getAll((extensions) => {
        extensionsContainer.innerHTML = '';
        extensions.forEach(extension => {
          if (extension.id !== chrome.runtime.id) { // Exclude the manager extension itself
            const extensionItem = document.createElement('div');
            extensionItem.className = 'extension-item';
            extensionItem.innerHTML = `
              <img src="${extension.icons ? extension.icons[0].url : 'icons/default-icon.png'}" alt="Icon">
              <span>${extension.name}</span>
              <button data-id="${extension.id}" class="toggle-extension">${extension.enabled ? 'Disable' : 'Enable'}</button>
            `;
            extensionsContainer.appendChild(extensionItem);
  
            extensionItem.addEventListener('click', () => {
              showExtensionDetails(extension);
            });
          }
        });
  
        document.querySelectorAll('.toggle-extension').forEach(button => {
          button.addEventListener('click', (e) => {
            const extensionId = e.target.getAttribute('data-id');
            chrome.management.get(extensionId, (ext) => {
              chrome.management.setEnabled(extensionId, !ext.enabled, loadExtensions);
            });
          });
        });
      });
    }
  
    function showExtensionDetails(extension) {
      extensionDetails.innerHTML = `
        <h2>${extension.name}</h2>
        <p>${extension.description || 'No description available.'}</p>
        <p><strong>Version:</strong> ${extension.version || 'N/A'}</p>
        <p><strong>Permissions:</strong> ${extension.permissions ? extension.permissions.join(', ') : 'N/A'}</p>
        <button id="close-details">Close</button>
      `;
      extensionDetails.style.display = 'block';
  
      document.getElementById('close-details').addEventListener('click', () => {
        extensionDetails.style.display = 'none';
      });
    }
  
    searchBar.addEventListener('input', () => {
      const query = searchBar.value.toLowerCase();
      document.querySelectorAll('.extension-item').forEach(item => {
        const name = item.querySelector('span').textContent.toLowerCase();
        item.style.display = name.includes(query) ? '' : 'none';
      });
    });
  
    // Initial load
    loadExtensions();
  });
  