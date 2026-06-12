document.addEventListener('DOMContentLoaded', () => {
  const tabs = document.querySelectorAll('.tab-btn');
  const panes = document.querySelectorAll('.tab-pane');
  const searchInput = document.getElementById('search-bar');
  
  // Store original HTML of text containers to cleanly restore state when clearing search
  const originalData = [];
  
  // Initialize original data for restoring HTML structures
  document.querySelectorAll('.agenda-card, .poster-card').forEach((card, idx) => {
    // Assign a unique data attribute for retrieval
    card.setAttribute('data-search-id', idx);
    
    // We store the text elements and their original HTML
    const elementsToStore = [];
    
    // Find all titles recursively (for plenary titles or parallel track titles)
    const titleElements = card.querySelectorAll('.agenda-title, .poster-title, .track-title');
    titleElements.forEach((titleEl, tIdx) => {
      elementsToStore.push({
        element: titleEl,
        html: titleEl.innerHTML,
        text: titleEl.textContent
      });
    });
    
    // Find all descriptions recursively
    const descElements = card.querySelectorAll('.agenda-description, .track-desc');
    descElements.forEach((descEl, dIdx) => {
      elementsToStore.push({
        element: descEl,
        html: descEl.innerHTML,
        text: descEl.textContent
      });
    });
    
    // Store paper items recursively
    const paperItems = card.querySelectorAll('.paper-item');
    paperItems.forEach((paper, pIdx) => {
      const pTitle = paper.querySelector('.paper-title');
      const pAuthor = paper.querySelector('.paper-author');
      
      if (pTitle) {
        elementsToStore.push({
          element: pTitle,
          html: pTitle.innerHTML,
          text: pTitle.textContent
        });
      }
      if (pAuthor) {
        elementsToStore.push({
          element: pAuthor,
          html: pAuthor.innerHTML,
          text: pAuthor.textContent
        });
      }
    });
    
    originalData[idx] = {
      card: card,
      elements: elementsToStore,
      fullTextContent: card.textContent.toLowerCase()
    };
  });
  
  // Store original tab button labels
  const originalTabLabels = {};
  tabs.forEach(tab => {
    originalTabLabels[tab.id] = tab.innerHTML;
  });

  // Tab switching logic
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetId = tab.getAttribute('aria-controls');
      
      // Update active tab buttons
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      
      // Update active panes
      panes.forEach(pane => {
        if (pane.id === targetId) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });
    });
  });

  // Helper to escape regex special characters
  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  // Search logic
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    
    // Clear active states of metric cards if they don't match the search text
    const activeMetric = document.querySelector('.clickable-metric.active-filter');
    if (activeMetric) {
      const filterTerm = activeMetric.getAttribute('data-filter').toLowerCase();
      if (query !== filterTerm) {
        activeMetric.classList.remove('active-filter');
      }
    }
    
    // Clean up any existing empty states
    document.querySelectorAll('.no-results-card').forEach(el => el.remove());
    
    if (!query) {
      // Restore original state
      originalData.forEach(item => {
        item.card.style.display = '';
        item.elements.forEach(elData => {
          if (elData.element) {
            elData.element.innerHTML = elData.html;
          }
        });
      });
      
      // Restore original tab labels
      tabs.forEach(tab => {
        tab.innerHTML = originalTabLabels[tab.id];
      });
      return;
    }
    
    const escapedQuery = escapeRegExp(query);
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    
    // Count matches per pane
    const matchCounts = {
      'pane-day1': 0,
      'pane-day2': 0,
      'pane-day3': 0,
      'pane-day4': 0,
      'pane-posters': 0
    };
    
    // Perform search and highlighting
    originalData.forEach(item => {
      const paneId = item.card.closest('.tab-pane').id;
      const matches = item.fullTextContent.includes(query);
      
      if (matches) {
        item.card.style.display = '';
        matchCounts[paneId]++;
        
        // Apply highlighting to stored text fields
        item.elements.forEach(elData => {
          if (elData.element) {
            if (elData.text.toLowerCase().includes(query)) {
              // Replace matched query with marked text, preserving structural casing
              elData.element.innerHTML = elData.text.replace(regex, '<mark>$1</mark>');
            } else {
              elData.element.innerHTML = elData.html; // Reset if this specific sub-element doesn't contain the match
            }
          }
        });
      } else {
        item.card.style.display = 'none';
      }
    });
    
    // Update tab labels with match counts
    tabs.forEach(tab => {
      const paneId = tab.getAttribute('aria-controls');
      const count = matchCounts[paneId];
      const baseLabel = originalTabLabels[tab.id];
      
      if (count > 0) {
        tab.innerHTML = `${baseLabel} <span style="background: var(--accent); color: #fff; font-size: 0.75rem; padding: 2px 6px; border-radius: 9999px; margin-left: 5px; box-shadow: 0 2px 5px rgba(244,63,94,0.4);">${count}</span>`;
      } else {
        tab.innerHTML = `${baseLabel} <span style="background: rgba(255,255,255,0.1); color: var(--text-muted); font-size: 0.75rem; padding: 2px 6px; border-radius: 9999px; margin-left: 5px;">0</span>`;
      }
    });
    
    // Add "No results" visual aid for empty panes
    panes.forEach(pane => {
      const visibleCards = pane.querySelectorAll('.agenda-card:not([style*="display: none"]), .poster-card:not([style*="display: none"])');
      if (visibleCards.length === 0) {
        const noResults = document.createElement('div');
        noResults.className = 'no-results-card';
        noResults.style.cssText = `
          background: var(--bg-card);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-md);
          padding: 3rem;
          text-align: center;
          color: var(--text-muted);
          font-family: var(--font-heading);
          font-size: 1.1rem;
        `;
        noResults.innerHTML = `
          <svg style="width: 48px; height: 48px; fill: currentColor; margin-bottom: 1rem; opacity: 0.4;" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <div>No items found matching "${query}" on this day.</div>
        `;
        
        const container = pane.querySelector('.timeline, .posters-grid');
        container.appendChild(noResults);
      }
    });
  });

  // Handle dashboard metric clicks
  const metrics = document.querySelectorAll('.clickable-metric');
  metrics.forEach(metric => {
    metric.addEventListener('click', () => {
      const term = metric.getAttribute('data-filter');
      const isAlreadyActive = metric.classList.contains('active-filter');
      
      // Clear all active filters
      metrics.forEach(m => m.classList.remove('active-filter'));
      
      if (isAlreadyActive) {
        // Clear filter
        searchInput.value = '';
      } else {
        // Apply filter
        metric.classList.add('active-filter');
        searchInput.value = term;
      }
      
      // Trigger search input handler
      searchInput.dispatchEvent(new Event('input'));
      
      // If a term was applied, auto-switch to a matching tab if the current tab has no matches
      if (searchInput.value) {
        // Special case: if filter is Poster, switch to Posters List tab
        if (term === 'Poster') {
          const postersTab = document.getElementById('tab-posters');
          if (postersTab) postersTab.click();
          return;
        }
        
        const activeTab = document.querySelector('.tab-btn.active');
        const activePaneId = activeTab.getAttribute('aria-controls');
        
        // Find if current tab has visible items
        const currentPane = document.getElementById(activePaneId);
        const visibleCards = currentPane.querySelectorAll('.agenda-card:not([style*="display: none"]), .poster-card:not([style*="display: none"])');
        
        if (visibleCards.length === 0) {
          // Find first pane that has visible items
          const panesArray = Array.from(document.querySelectorAll('.tab-pane'));
          const matchingPane = panesArray.find(pane => {
            return pane.querySelectorAll('.agenda-card:not([style*="display: none"]), .poster-card:not([style*="display: none"])').length > 0;
          });
          
          if (matchingPane) {
            const tabBtn = document.querySelector(`.tab-btn[aria-controls="${matchingPane.id}"]`);
            if (tabBtn) tabBtn.click();
          }
        }
      }
    });
    
    // Add keydown accessibility for focusable metrics
    metric.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        metric.click();
      }
    });
  });

  // Handle cell clicks in Overview Table
  const clickableCells = document.querySelectorAll('.clickable-cell');
  clickableCells.forEach(cell => {
    cell.addEventListener('click', () => {
      const dayPaneId = cell.getAttribute('data-target-day');
      const targetCardId = cell.getAttribute('data-target-id');
      
      if (!dayPaneId || !targetCardId) return;
      
      // 1. Clear any search query to make sure the card is visible
      if (searchInput.value) {
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input'));
      }
      
      // 2. Switch to the target tab
      const tabBtn = document.querySelector(`.tab-btn[aria-controls="${dayPaneId}"]`);
      if (tabBtn) {
        // Trigger tab switch
        tabBtn.click();
      }
      
      // 3. Find the target card and scroll it into view
      const targetCard = document.getElementById(targetCardId);
      if (targetCard) {
        // Allow a tiny delay for the tab transition/display to settle
        setTimeout(() => {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          
          // 4. Trigger flash highlight animation
          targetCard.classList.remove('highlight-flash');
          // Trigger reflow to restart animation
          void targetCard.offsetWidth;
          targetCard.classList.add('highlight-flash');
          
          // Remove highlight class after animation finishes (1.4s)
          setTimeout(() => {
            targetCard.classList.remove('highlight-flash');
          }, 1400);
        }, 150);
      }
    });
  });
});
