/**
 * AI Agent Operating Hub & Studio - Main Application Logic
 * Integrates with AGENT_STUDIO_DATA from data.js
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderPipelineFlow();
  renderSkillsCatalog();
  renderExerciseGrid();
  initStudioGenerator();
  initSearch();
  initEventListeners();
});

// State
let currentFilter = 'all';
let searchQuery = '';

/**
 * Theme Engine (Dark / Light Mode)
 */
function initTheme() {
  const savedTheme = localStorage.getItem('agent_studio_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const nextTheme = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('agent_studio_theme', nextTheme);
      updateThemeIcon(nextTheme);
      showToast(`Đã chuyển sang giao diện ${nextTheme === 'dark' ? 'Tối' : 'Sáng'}`);
    });
  }
}

function updateThemeIcon(theme) {
  const iconSpan = document.getElementById('theme-icon');
  if (iconSpan) {
    iconSpan.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
}

/**
 * Render Pipeline Stages
 */
function renderPipelineFlow() {
  const container = document.getElementById('pipeline-flow-container');
  if (!container) return;

  const stages = AGENT_STUDIO_DATA.pipelineStages;

  // Track 1: Core Data Pipeline (Step 1 -> Step 2 -> Step 3)
  const track1Stages = stages.filter(s => ['stage-1', 'stage-2', 'stage-3'].includes(s.id));
  // Track 2: Media Generation (Step 4 -> Step 5)
  const track2Stages = stages.filter(s => ['stage-4', 'stage-5'].includes(s.id));
  // Track 3: Exercises & Comprehensive Multi-Agent QA
  const track3Stages = stages.filter(s => ['stage-7', 'stage-qa-1', 'stage-qa-2', 'stage-qa-3', 'stage-delivery'].includes(s.id));

  let html = `
    <div class="pipeline-tracks-container">
      <div class="track-block">
        <div class="track-label">Phase 1: Ingestion & Lexical Structuring (Step 1 - 3)</div>
        <div class="nodes-row">
          ${track1Stages.map(s => createNodeCardHtml(s)).join('')}
        </div>
      </div>

      <div class="track-block">
        <div class="track-label">Phase 2: Visual Assets & Prompt Engineering (Step 4 - 5)</div>
        <div class="nodes-row">
          ${track2Stages.map(s => createNodeCardHtml(s)).join('')}
        </div>
      </div>

      <div class="track-block">
        <div class="track-label">Phase 3: Curriculum Exercise Synthesis & 3-Tier Quality Assurance</div>
        <div class="nodes-row">
          ${track3Stages.map(s => createNodeCardHtml(s)).join('')}
        </div>
      </div>
    </div>
  `;

  container.innerHTML = html;

  // Add click listeners to nodes
  document.querySelectorAll('.node-card').forEach(card => {
    card.addEventListener('click', () => {
      const skillId = card.getAttribute('data-skill-id');
      const skill = AGENT_STUDIO_DATA.skills.find(s => s.id === skillId);
      if (skill) {
        openSkillModal(skill);
      }
    });
  });
}

function createNodeCardHtml(stage) {
  return `
    <div class="node-card" data-stage-id="${stage.id}" data-skill-id="${stage.skillId}">
      <div class="node-header">
        <span class="node-step-tag">${stage.stepNumber}</span>
        <span class="node-badge">${stage.badge}</span>
      </div>
      <div class="node-title">${stage.name}</div>
      <div class="node-desc">${stage.summary}</div>
      <div class="node-footer">
        <span class="node-status-ready">● Sẵn sàng</span>
        <span>Chi tiết →</span>
      </div>
    </div>
  `;
}

/**
 * Render Skills Catalog Directory
 */
function renderSkillsCatalog() {
  const container = document.getElementById('skills-grid-container');
  if (!container) return;

  const skills = AGENT_STUDIO_DATA.skills.filter(s => {
    const matchCategory = currentFilter === 'all' || s.category === currentFilter;
    const matchSearch = searchQuery === '' || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.triggers.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  if (skills.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 48px 20px; color: var(--text-muted);">
        <p style="font-size: 1.1rem; margin-bottom: 8px;">Không tìm thấy AI Skill nào phù hợp với từ khóa "${searchQuery}"</p>
        <button class="btn-secondary" onclick="resetSearch()">Xóa bộ lọc tìm kiếm</button>
      </div>
    `;
    return;
  }

  container.innerHTML = skills.map(skill => `
    <div class="skill-card">
      <div class="skill-card-top">
        <h3 class="skill-title">${skill.name}</h3>
        <span class="node-badge" style="background: var(--primary-light); color: var(--primary);">${skill.badge}</span>
      </div>
      <p class="skill-desc">${skill.shortDesc}</p>
      
      <div class="skill-meta-tags">
        ${skill.triggers.slice(0, 3).map(t => `<span class="skill-tag">🏷️ ${t}</span>`).join('')}
        ${skill.scripts.length > 0 ? `<span class="skill-tag" style="color: var(--secondary);">⚙️ ${skill.scripts.length} script</span>` : ''}
        ${skill.subagents.length > 0 ? `<span class="skill-tag" style="color: var(--accent-purple);">🤖 ${skill.subagents.length} subagents</span>` : ''}
      </div>

      <div class="skill-actions">
        <button class="btn-card-action" onclick="viewSkillDetails('${skill.id}')">
          📖 Tài liệu & Quy tắc
        </button>
        <button class="btn-card-action" style="border-color: var(--primary);" onclick="useSkillInStudio('${skill.id}')">
          ⚡ Dùng trong Studio
        </button>
      </div>
    </div>
  `).join('');
}

/**
 * Render 16 Exercise Matrix
 */
function renderExerciseGrid() {
  const container = document.getElementById('exercise-grid-container');
  if (!container) return;

  container.innerHTML = AGENT_STUDIO_DATA.exerciseTypes.map(ex => `
    <div class="exercise-card" onclick="openExerciseModal('${ex.number}')">
      <div class="exercise-number">TYPE ${ex.number}</div>
      <div class="exercise-title">${ex.title}</div>
      <div class="exercise-desc">${ex.description}</div>
      <div class="exercise-footer">
        <span class="exercise-badge">${ex.category}</span>
        <span>${ex.questionCount}</span>
      </div>
    </div>
  `).join('');
}

/**
 * Search and Filter Handlers
 */
function initSearch() {
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim();
      renderSkillsCatalog();
    });
  }

  // Filter tab buttons
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFilter = btn.getAttribute('data-filter');
      renderSkillsCatalog();
    });
  });
}

function resetSearch() {
  searchQuery = '';
  currentFilter = 'all';
  const searchInput = document.getElementById('global-search-input');
  if (searchInput) searchInput.value = '';
  document.querySelectorAll('.filter-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-filter') === 'all');
  });
  renderSkillsCatalog();
}

/**
 * Studio Assistant: Prompt & CLI Command Generator
 */
function initStudioGenerator() {
  const skillSelect = document.getElementById('studio-skill-select');
  const bookSelect = document.getElementById('studio-book-select');
  const unitInput = document.getElementById('studio-unit-input');
  const pagesInput = document.getElementById('studio-pages-input');

  if (!skillSelect) return;

  // Populate skill select options
  skillSelect.innerHTML = AGENT_STUDIO_DATA.skills.map(s => `
    <option value="${s.id}">${s.name}</option>
  `).join('');

  function updateOutputs() {
    const selectedSkillId = skillSelect.value;
    const skill = AGENT_STUDIO_DATA.skills.find(s => s.id === selectedSkillId);
    if (!skill) return;

    const book = bookSelect.value;
    const unit = unitInput.value.trim() || 'unit-7';
    const pages = pagesInput.value.trim() || '58-69';
    const pdf = `${book}-2.pdf`;

    // Generate prompt text
    let prompt = skill.promptTemplate
      .replace(/{book}/g, book)
      .replace(/{unit}/g, unit)
      .replace(/{pages}/g, pages)
      .replace(/{pdf_file}/g, pdf);

    // Generate CLI command
    let cli = '';
    if (skill.id === 'skills-vocab-preview') {
      cli = `powershell -ExecutionPolicy Bypass -File .agent/skills/skills-vocab-preview/scripts/generate_preview.ps1 -VocabDir "data/${book}/${unit}/vocab"`;
    } else if (skill.id === 'skills-data-vocab-step-7-practice') {
      cli = `poetry run python3 .agent/skills/skills-data-vocab-step-7-practice/scripts/vocab_coverage_checker.py data/${book}/${unit}/vocab/vocab.json data/${book}/${unit}/vocab/exercises/\n\n# Cân bằng đáp án A/B/C/D:\npoetry run python3 .agent/skills/skills-data-vocab-step-7-practice/scripts/balance_mcq_options.py data/${book}/${unit}/vocab/exercises/`;
    } else if (skill.id === 'skills-data-vocab-step-3-vocab-json') {
      cli = `poetry run python3 .agent/skills/skills-data-vocab-step-3-vocab-json/scripts/merge_vocab_parts.py data/${book}/${unit}/vocab/parts data/${book}/${unit}/vocab/vocab.json`;
    } else if (skill.id === 'skills-fix-context-duplications-agent') {
      cli = `poetry run python3 .agent/skills/skills-fix-context-duplications-agent/scripts/prepare_context_audit.py data/${book}/${unit}/vocab/exercises`;
    } else {
      cli = `# Skill này được điều phối tự động bởi Antigravity Agent thông qua Prompt:\n${prompt}`;
    }

    const promptBox = document.getElementById('generated-prompt-output');
    const cliBox = document.getElementById('generated-cli-output');

    if (promptBox) promptBox.textContent = prompt;
    if (cliBox) cliBox.textContent = cli;
  }

  skillSelect.addEventListener('change', updateOutputs);
  bookSelect.addEventListener('change', updateOutputs);
  unitInput.addEventListener('input', updateOutputs);
  pagesInput.addEventListener('input', updateOutputs);

  updateOutputs();
}

function useSkillInStudio(skillId) {
  const skillSelect = document.getElementById('studio-skill-select');
  if (skillSelect) {
    skillSelect.value = skillId;
    skillSelect.dispatchEvent(new Event('change'));
    document.getElementById('studio-section').scrollIntoView({ behavior: 'smooth' });
    showToast(`Đã tải cấu hình cho Skill vào Studio`);
  }
}

/**
 * Modals Management
 */
function openSkillModal(skill) {
  const modal = document.getElementById('common-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.innerHTML = `🤖 ${skill.name}`;

  let contentHtml = `
    <div style="margin-bottom: 20px;">
      <span class="node-badge" style="background: var(--primary-light); color: var(--primary); font-size: 0.85rem; padding: 4px 12px;">${skill.badge}</span>
      <p style="margin-top: 12px; font-size: 1rem; color: var(--text-main); line-height: 1.6;">${skill.shortDesc}</p>
    </div>

    <div style="background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px;">
      <h4 style="font-size: 0.9rem; margin-bottom: 10px; color: var(--secondary);">Từ khóa kích hoạt (Triggers):</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 8px;">
        ${skill.triggers.map(t => `<span class="skill-tag">"${t}"</span>`).join('')}
      </div>
    </div>
  `;

  if (skill.subagents && skill.subagents.length > 0) {
    contentHtml += `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 1rem; margin-bottom: 12px; color: var(--accent-purple);">Ban Subagents Chuyên Biệt (${skill.subagents.length} vai trò):</h4>
        <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
          ${skill.subagents.map(sa => `
            <div style="padding: 12px; background: var(--bg-card); border-left: 3px solid var(--accent-purple); border-radius: 4px;">
              <strong style="color: var(--text-main); font-size: 0.9rem;">${sa.name}:</strong>
              <p style="font-size: 0.85rem; color: var(--text-muted); margin-top: 4px;">${sa.role}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (skill.mandatoryRules && skill.mandatoryRules.length > 0) {
    contentHtml += `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 1rem; margin-bottom: 12px; color: var(--warning);">⚠️ Quy Tắc Bắt Buộc:</h4>
        <ul style="padding-left: 20px; font-size: 0.88rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 8px;">
          ${skill.mandatoryRules.map(r => `<li>${r}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (skill.scripts && skill.scripts.length > 0) {
    contentHtml += `
      <div style="margin-bottom: 20px;">
        <h4 style="font-size: 1rem; margin-bottom: 12px; color: var(--secondary);">Scripts Tự Động Hóa:</h4>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${skill.scripts.map(sc => `
            <div style="padding: 10px 14px; background: var(--bg-base); border: 1px solid var(--border); border-radius: var(--radius-sm); font-size: 0.82rem;">
              <code style="color: var(--secondary); font-weight: 700;">${sc.name}</code>: ${sc.desc}
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  body.innerHTML = contentHtml;
  modal.classList.add('open');
}

function viewSkillDetails(skillId) {
  const skill = AGENT_STUDIO_DATA.skills.find(s => s.id === skillId);
  if (skill) openSkillModal(skill);
}

function openExerciseModal(number) {
  const ex = AGENT_STUDIO_DATA.exerciseTypes.find(e => e.number === number);
  if (!ex) return;

  const modal = document.getElementById('common-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.innerHTML = `📝 Dạng ${ex.number}: ${ex.title}`;

  body.innerHTML = `
    <div style="margin-bottom: 18px;">
      <span class="exercise-badge">${ex.category}</span>
      <span style="margin-left: 10px; font-size: 0.85rem; color: var(--text-muted);">Quy mô: ${ex.questionCount}</span>
      <p style="margin-top: 12px; font-size: 0.95rem; color: var(--text-main);">${ex.description}</p>
    </div>

    <div style="margin-bottom: 20px;">
      <h4 style="font-size: 0.95rem; margin-bottom: 10px; color: var(--primary);">Quy Chuẩn Biên Soạn & Đánh Giá:</h4>
      <ul style="padding-left: 20px; font-size: 0.86rem; color: var(--text-muted); display: flex; flex-direction: column; gap: 6px;">
        ${ex.rules.map(r => `<li>${r}</li>`).join('')}
      </ul>
    </div>

    <div>
      <h4 style="font-size: 0.95rem; margin-bottom: 8px; color: var(--secondary);">Mẫu Cấu Trúc JSON (${ex.filename}):</h4>
      <pre class="code-output" style="max-height: 280px;">${JSON.stringify(ex.schemaSample, null, 2)}</pre>
    </div>
  `;

  modal.classList.add('open');
}

function openDocModal(docKey) {
  const doc = AGENT_STUDIO_DATA.referenceDocs[docKey];
  if (!doc) return;

  const modal = document.getElementById('common-modal');
  const title = document.getElementById('modal-title');
  const body = document.getElementById('modal-body');

  title.innerHTML = `📖 ${doc.title}`;

  // Simple Markdown parser to HTML
  let parsed = doc.content
    .replace(/^# (.*$)/gim, '<h2 style="font-size: 1.4rem; margin: 16px 0 8px; color: var(--text-main);">$1</h2>')
    .replace(/^## (.*$)/gim, '<h3 style="font-size: 1.15rem; margin: 14px 0 6px; color: var(--primary);">$1</h3>')
    .replace(/^### (.*$)/gim, '<h4 style="font-size: 1rem; margin: 12px 0 4px; color: var(--secondary);">$1</h4>')
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    .replace(/`([^`]+)`/gim, '<code style="background: var(--bg-subtle); padding: 2px 6px; border-radius: 4px; color: var(--secondary); font-size: 0.85rem;">$1</code>')
    .replace(/\n\n/gim, '<p style="margin-bottom: 12px; font-size: 0.9rem; line-height: 1.6;"></p>');

  body.innerHTML = `
    <div style="font-size: 0.8rem; color: var(--text-faint); margin-bottom: 16px;">Tệp nguồn: <code>${doc.source}</code></div>
    <div style="color: var(--text-main);">${parsed}</div>
  `;

  modal.classList.add('open');
}

function openLivePreview() {
  const modal = document.getElementById('preview-modal');
  const iframe = document.getElementById('preview-iframe');
  if (modal && iframe) {
    iframe.src = AGENT_STUDIO_DATA.projectInfo.activeDemoUnit.previewUrl;
    modal.classList.add('open');
  }
}

function closeModals() {
  document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('open'));
  const iframe = document.getElementById('preview-iframe');
  if (iframe) iframe.src = '';
}

/**
 * Event Listeners & Shortcuts
 */
function initEventListeners() {
  // Modal Close buttons
  document.querySelectorAll('.modal-close-btn, .modal-close-action').forEach(btn => {
    btn.addEventListener('click', closeModals);
  });

  // Click outside modal dialog to close
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModals();
    });
  });

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModals();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('global-search-input');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }
  });

  // Quick Copy Buttons
  document.getElementById('btn-copy-prompt')?.addEventListener('click', () => {
    const text = document.getElementById('generated-prompt-output')?.textContent || '';
    copyToClipboard(text, 'Đã sao chép câu lệnh Prompt vào bộ nhớ đệm!');
  });

  document.getElementById('btn-copy-cli')?.addEventListener('click', () => {
    const text = document.getElementById('generated-cli-output')?.textContent || '';
    copyToClipboard(text, 'Đã sao chép lệnh Terminal/PowerShell!');
  });
}

function copyToClipboard(text, message) {
  navigator.clipboard.writeText(text).then(() => {
    showToast(message);
  }).catch(() => {
    showToast('Không thể sao chép tự động, vui lòng chọn và copy thủ công.');
  });
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>✨</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(-10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}
