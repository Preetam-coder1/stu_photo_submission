const input = document.getElementById('photoInput');
    const dropArea = document.getElementById('dropArea');
    const previewGrid = document.getElementById('previewGrid');
    const countText = document.getElementById('countText');
    const submitBtn = document.getElementById('submitBtn');
    const clearBtn = document.getElementById('clearBtn');
    const statusBox = document.getElementById('status');
    const messageIcon = document.getElementById('messageIcon');
    const messageTitle = document.getElementById('messageTitle');
    const messageText = document.getElementById('messageText');
    const messageClose = document.getElementById('messageClose');
    let selectedFiles = [];

    function showStatus(message, type) {
      statusBox.className = `show ${type}`;
      messageIcon.textContent = type === 'success' ? '✓' : '!';
      messageTitle.textContent = type === 'success' ? 'Submission Successful!' : 'Error Occurred!';
      messageText.textContent = message;
    }
    function closeStatus() { statusBox.className = ''; }
    messageClose.addEventListener('click', closeStatus);
    statusBox.addEventListener('click', event => { if (event.target === statusBox) closeStatus(); });
    document.addEventListener('keydown', event => { if (event.key === 'Escape') closeStatus(); });

    function renderFiles(files) {
      selectedFiles = Array.from(files);
      previewGrid.innerHTML = '';
      closeStatus();

      if (selectedFiles.length > 5) {
        selectedFiles = selectedFiles.slice(0, 5);
        showStatus('You can select a maximum of 5 photos. Only the first 5 have been kept.', 'error');
      }

      countText.textContent = `${selectedFiles.length} photo${selectedFiles.length === 1 ? '' : 's'} selected`;

      selectedFiles.forEach((file, index) => {
        if (!file.type.startsWith('image/')) return;
        const url = URL.createObjectURL(file);
        const item = document.createElement('div');
        item.className = 'preview';
        const img = document.createElement('img');
        img.src = url;
        img.alt = `Selected photo ${index + 1}`;
        const label = document.createElement('span');
        label.textContent = `PHOTO ${index + 1}`;
        item.append(img, label);
        previewGrid.appendChild(item);
      });

      const transfer = new DataTransfer();
      selectedFiles.forEach(file => transfer.items.add(file));
      input.files = transfer.files;
    }

    input.addEventListener('change', () => renderFiles(input.files));

    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, event => {
        event.preventDefault();
        dropArea.classList.add('dragover');
      });
    });
    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, event => {
        event.preventDefault();
        dropArea.classList.remove('dragover');
      });
    });
    dropArea.addEventListener('drop', event => renderFiles(event.dataTransfer.files));

    clearBtn.addEventListener('click', () => {
      selectedFiles = [];
      input.value = '';
      previewGrid.innerHTML = '';
      countText.textContent = 'No photos selected';
      closeStatus();
    });

    submitBtn.addEventListener('click', () => {
      if (selectedFiles.length < 2 || selectedFiles.length > 5) {
        showStatus('Please select at least 2 and no more than 5 photos before submitting.', 'error');
        return;
      }
      if (selectedFiles.some(file => !file.type.startsWith('image/'))) {
        showStatus('Please select valid image files only.', 'error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'SUBMITTING...';

      // Demo behaviour: randomly show success or error.
      // Connect this section to your backend/API for real photo uploads.
      setTimeout(() => {
        const hasError = Math.random() < 0.20; // 20% demo error chance
        if (hasError) {
          showStatus('Error occurred! Please try again later.', 'error');
        } else {
          showStatus('Your photos have been submitted successfully!', 'success');
          selectedFiles = [];
          input.value = '';
          previewGrid.innerHTML = '';
          countText.textContent = 'No photos selected';
        }
        submitBtn.disabled = false;
        submitBtn.textContent = 'SUBMIT PHOTOS';
      }, 1100);
    });
