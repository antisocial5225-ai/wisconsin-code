// Wisconsin State Code - Main JavaScript
// Официальный портал законодательства Висконсина

document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initBackToTop();
    initScrollSpy();
    initCollapsibleSections();
    initSearch();
    initThemeToggle();
    initPrintButton();
    initArticleLinks();
    initAnimations();
    updateCodeStats();
});

// --- Mobile Menu ---
function initMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mainNav');

    if (btn && nav) {
        btn.addEventListener('click', function() {
            nav.classList.toggle('active');
            btn.textContent = nav.classList.contains('active') ? '✕' : '☰';
        });
    }
}

// --- Back to Top Button ---
function initBackToTop() {
    const btn = document.getElementById('backToTop');

    if (btn) {
        btn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        window.addEventListener('scroll', function() {
            if (window.scrollY > 400) {
                btn.style.display = 'flex';
                btn.style.opacity = '1';
            } else {
                btn.style.display = 'none';
                btn.style.opacity = '0';
            }
        });
    }
}

// --- Scroll Spy with improved sensitivity ---
function initScrollSpy() {
    const sections = document.querySelectorAll('.code-section');
    const sidebarLinks = document.querySelectorAll('.sidebar-item');

    if (sections.length === 0 || sidebarLinks.length === 0) return;

    // Adjust for sticky header offset
    const headerHeight = 70;
    const sectionOffset = 130;

    const observerOptions = {
        rootMargin: `-${sectionOffset}px 0px -${window.innerHeight - sectionOffset}px 0px`,
        threshold: [0, 0.25, 0.5, 0.75, 1]
    };

    const observer = new IntersectionObserver(function(entries) {
        let currentSection = null;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                currentSection = entry.target.id;
            }
        });

        if (currentSection) {
            sidebarLinks.forEach(link => {
                link.classList.remove('active');
                if (link.dataset.target === currentSection) {
                    link.classList.add('active');
                    // Smoothly scroll sidebar to active item if needed
                    const sidebar = document.querySelector('.sidebar');
                    if (sidebar && link.offsetTop > sidebar.scrollTop + 200) {
                        sidebar.scrollTo({
                            top: link.offsetTop - 100,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        }
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

// --- Collapsible Sections ---
function initCollapsibleSections() {
    const headers = document.querySelectorAll('.article-header');

    headers.forEach(header => {
        header.addEventListener('click', function() {
            const article = this.closest('.article');
            const content = article.querySelector('.article-content');
            const icon = this.querySelector('.article-icon');

            if (content) {
                content.classList.toggle('collapsed');
                this.classList.toggle('expanded');
                if (icon) {
                    icon.textContent = content.classList.contains('collapsed') ? '▼' : '▲';
                }
            }
        });
    });
}

// --- Search Functionality ---
function initSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');

    if (!searchInput) return;

    let searchTimer;

    searchInput.addEventListener('input', function(e) {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function() {
            performSearch(e.target.value);
        }, 300);
    });

    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchInput.value);
        });
    }

    // Handle URL search parameter
    const urlParams = new URLSearchParams(window.location.search);
    const search = urlParams.get('q');
    if (search) {
        searchInput.value = search;
        performSearch(search);
    }
}

function performSearch(query) {
    if (!query || query.trim() === '') {
        resetSearch();
        return;
    }

    const term = query.toLowerCase().trim();
    const articles = document.querySelectorAll('.article');

    let foundCount = 0;

    articles.forEach(article => {
        const text = article.textContent.toLowerCase();
        const title = article.querySelector('h4')?.textContent.toLowerCase() || '';

        const matches = text.includes(term) || title.includes(term);

        if (matches) {
            article.style.display = 'block';
            highlightText(article, term);
            foundCount++;
        } else {
            article.style.display = 'none';
        }
    });

    // Update URL
    const url = new URL(window.location.href);
    url.searchParams.set('q', query);
    window.history.pushState({}, '', url);
}

function highlightText(element, term) {
    const text = element.innerHTML;
    const regex = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    element.innerHTML = text.replace(regex, '<span class="search-highlight">$1</span>');
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function resetSearch() {
    const articles = document.querySelectorAll('.article');
    const highlights = document.querySelectorAll('.search-highlight');

    articles.forEach(article => {
        article.style.display = 'block';
    });

    highlights.forEach(span => {
        span.outerHTML = span.innerText;
    });

    // Clear URL parameter
    const url = new URL(window.location.href);
    url.searchParams.delete('q');
    window.history.pushState({}, '', url);
}

// --- Theme Toggle ---
function initThemeToggle() {
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.documentElement.style.setProperty('--primary-dark', '#0c1a2e');
    } else if (currentTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.documentElement.style.setProperty('--primary-dark', '#0c1a2e');
    }
}

// --- Print Button ---
function initPrintButton() {
    const printBtn = document.querySelector('.print-btn');

    if (printBtn) {
        printBtn.addEventListener('click', function() {
            window.print();
        });
    }
}

// --- Article Links with improved smooth scrolling ---
function initArticleLinks() {
    const sidebarLinks = document.querySelectorAll('.sidebar-item');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.dataset.target;
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                // Update active state
                sidebarLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');

                // Smooth scroll to section
                const yOffset = -130;
                const y = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;

                window.scrollTo({
                    top: y,
                    behavior: 'smooth'
                });

                // Update URL hash
                history.pushState(null, '', '#' + targetId);
            }
        });
    });

    // Handle hash navigation on page load
    if (window.location.hash) {
        const target = document.querySelector(window.location.hash);
        if (target) {
            setTimeout(() => {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }

    // Update sidebar on scroll
    window.addEventListener('scroll', function() {
        const scrollPosition = window.scrollY + 130;

        document.querySelectorAll('.code-section').forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.id;
            const link = document.querySelector(`.sidebar-item[data-target="${id}"]`);

            if (link && scrollPosition >= top && scrollPosition < top + height) {
                document.querySelectorAll('.sidebar-item').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });
}

// --- Animations ---
function initAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px 50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.code-card, .article, .code-section, .sidebar-item').forEach(el => {
        if (!el.classList.contains('visible')) {
            el.classList.add('fade-in');
            observer.observe(el);
        }
    });
}

// --- Update Code Stats ---
function updateCodeStats() {
    const articles = document.querySelectorAll('.article');
    const sections = document.querySelectorAll('.code-section');

    const totalArticles = articles.length;
    const totalSections = sections.length;

    console.log(`Кодекс загружен: ${totalSections} глав, ${totalArticles} статей`);
}
