(() => {
  const BLOG_TEXT = {
    en: {
      readMore: "Read more",
      loading: "Loading articles...",
      empty: "No articles are available right now.",
      error: "Unable to load articles right now.",
      byLabel: "By",
      authorFallback: "Editorial team",
      unpublished: "Unpublished",
      untitled: "Untitled post",
      missingSlug: "We could not find this article.",
      pageLabel: (page, total) => `Page ${page} of ${total}`
    },
    vi: {
      readMore: "Đọc thêm",
      loading: "Đang tải bài viết...",
      empty: "Chưa có bài viết nào.",
      error: "Không thể tải bài viết lúc này.",
      byLabel: "Bởi",
      authorFallback: "Ban biên tập",
      unpublished: "Chưa xuất bản",
      untitled: "Bài viết chưa đặt tên",
      missingSlug: "Không tìm thấy bài viết này.",
      pageLabel: (page, total) => `Trang ${page} / ${total}`
    }
  };

  const FALLBACK_IMAGE = "./image/general/img/social-block-img.jpg";

  function getLanguageCode() {
    const path = window.location.pathname || "";
    if (path.startsWith("/vi")) return "vi";
    return "en";
  }

  function getLanguagePrefix() {
    const path = window.location.pathname || "";
    if (path.startsWith("/vi")) return "/vi";
    if (path.startsWith("/en")) return "/en";
    return "/en";
  }

  function getText(key) {
    const lang = getLanguageCode();
    return (BLOG_TEXT[lang] && BLOG_TEXT[lang][key]) || BLOG_TEXT.en[key] || "";
  }

  function formatDate(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    const locale = getLanguageCode() === "vi" ? "vi-VN" : "en-US";
    return date.toLocaleDateString(locale, {
      year: "numeric",
      month: "short",
      day: "2-digit"
    });
  }

  function buildMetaText(blog) {
    const author = blog.authorName || getText("authorFallback");
    const dateText = formatDate(blog.publishedAt) || getText("unpublished");
    return `${getText("byLabel")} ${author} • ${dateText}`;
  }

  function setMessage(container, message) {
    if (!container) return;
    container.innerHTML = "";
    const text = document.createElement("p");
    text.className = "blog-placeholder";
    text.textContent = message;
    container.appendChild(text);
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function normalizeContentHtml(content) {
    if (!content) return "";
    if (/<[^>]+>/.test(content)) return content;

    const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
    return normalized
      .split(/\n{2,}/)
      .map((paragraph) => {
        const safe = escapeHtml(paragraph).replace(/\n/g, "<br />");
        return `<p>${safe}</p>`;
      })
      .join("");
  }

  function buildBlogCard(blog, options) {
    const detailUrl = `${options.detailBasePath}/${encodeURIComponent(blog.slug || "")}`;
    const card = document.createElement("article");
    card.className = "blog-card";

    const imageLink = document.createElement("a");
    imageLink.href = detailUrl;
    imageLink.className = "blog-card-link";

    const image = document.createElement("img");
    image.src = blog.thumbnailUrl || options.fallbackImage;
    image.alt = blog.title || getText("untitled");
    image.loading = "lazy";
    image.decoding = "async";
    imageLink.appendChild(image);

    const content = document.createElement("div");
    content.className = "blog-card-content";

    const titleLink = document.createElement("a");
    titleLink.href = detailUrl;

    const title = document.createElement("h3");
    title.className = "blog-card-title";
    title.textContent = blog.title || getText("untitled");
    titleLink.appendChild(title);

    content.appendChild(titleLink);

    if (blog.summary) {
      const summary = document.createElement("p");
      summary.className = "blog-card-summary";
      summary.textContent = blog.summary;
      content.appendChild(summary);
    }

    const meta = document.createElement("div");
    meta.className = "blog-meta";
    meta.textContent = buildMetaText(blog);
    content.appendChild(meta);

    const readMore = document.createElement("a");
    readMore.className = "blog-readmore";
    readMore.href = detailUrl;
    readMore.textContent = getText("readMore");
    content.appendChild(readMore);

    card.appendChild(imageLink);
    card.appendChild(content);

    return card;
  }

  async function loadHomeBlogs(apiClient) {
    const container = document.getElementById("homeBlogList");
    if (!container) return;
    setMessage(container, getText("loading"));

    try {
      const response = await apiClient.apiFetch("/api/blogs/public?page=1&pageSize=3");
      const blogs = await response.json();
      if (!Array.isArray(blogs) || blogs.length === 0) {
        setMessage(container, getText("empty"));
        return;
      }

      container.innerHTML = "";
      const detailBasePath = `${getLanguagePrefix()}/blog`;
      blogs.forEach((blog) => {
        container.appendChild(
          buildBlogCard(blog, { detailBasePath, fallbackImage: FALLBACK_IMAGE })
        );
      });
    } catch (error) {
      setMessage(container, getText("error"));
    }
  }

  function setupBlogList(apiClient) {
    const container = document.getElementById("blogList");
    const pagination = document.getElementById("blogPagination");
    const pageInfo = document.getElementById("blogPageInfo");
    const prevBtn = document.getElementById("blogPrevPage");
    const nextBtn = document.getElementById("blogNextPage");
    const PAGE_SIZE = 9;
    const lang = getLanguageCode();
    const pageLabel = (BLOG_TEXT[lang] && BLOG_TEXT[lang].pageLabel) || BLOG_TEXT.en.pageLabel;

    if (!container) return;

    const url = new URL(window.location.href);
    const pageParam = Number(url.searchParams.get("page"));
    let currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    let totalPages = 1;
    let hasTotalHeader = false;
    const detailBasePath = `${getLanguagePrefix()}/blog`;

    const updatePagination = () => {
      if (!pagination || !hasTotalHeader || totalPages <= 1) {
        if (pagination) pagination.style.display = "none";
        return;
      }

      pagination.style.display = "flex";
      if (pageInfo && typeof pageLabel === "function") {
        pageInfo.textContent = pageLabel(currentPage, totalPages);
      }
      if (prevBtn) prevBtn.disabled = currentPage <= 1;
      if (nextBtn) nextBtn.disabled = currentPage >= totalPages;
    };

    const updatePageQuery = (page) => {
      const nextUrl = new URL(window.location.href);
      nextUrl.searchParams.set("page", page.toString());
      window.history.replaceState({}, "", nextUrl.toString());
    };

    const loadPage = async (page) => {
      setMessage(container, getText("loading"));
      try {
        const response = await apiClient.apiFetch(
          `/api/blogs/public?page=${page}&pageSize=${PAGE_SIZE}`
        );
        const blogs = await response.json();
        const totalHeader = response.headers.get("X-Total-Count");

        hasTotalHeader = totalHeader !== null;
        const totalCount = hasTotalHeader ? Number(totalHeader) || 0 : blogs.length;
        totalPages = hasTotalHeader ? Math.max(1, Math.ceil(totalCount / PAGE_SIZE)) : 1;

        if (!Array.isArray(blogs) || blogs.length === 0) {
          setMessage(container, getText("empty"));
          updatePagination();
          return;
        }

        container.innerHTML = "";
        blogs.forEach((blog) => {
          container.appendChild(
            buildBlogCard(blog, { detailBasePath, fallbackImage: FALLBACK_IMAGE })
          );
        });

        currentPage = page;
        updatePagination();
        updatePageQuery(currentPage);
      } catch (error) {
        setMessage(container, getText("error"));
        if (pagination) pagination.style.display = "none";
      }
    };

    if (prevBtn) {
      prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
          loadPage(currentPage - 1);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
          loadPage(currentPage + 1);
        }
      });
    }

    loadPage(currentPage);
  }

  function getSlugFromPath() {
    const path = window.location.pathname || "";
    const match = path.match(/\/blog\/([^/?#]+)/);
    if (match && match[1]) {
      return decodeURIComponent(match[1]);
    }

    const url = new URL(window.location.href);
    const slug = url.searchParams.get("slug");
    return slug ? slug.trim() : null;
  }

  async function loadBlogDetail(apiClient) {
    const titleEl = document.getElementById("blogDetailTitle");
    const summaryEl = document.getElementById("blogDetailSummary");
    const metaEl = document.getElementById("blogDetailMeta");
    const imageEl = document.getElementById("blogDetailImage");
    const contentEl = document.getElementById("blogDetailContent");
    const statusEl = document.getElementById("blogDetailStatus");
    const breadcrumbTitle = document.getElementById("blogBreadcrumbTitle");

    const setStatus = (message) => {
      if (!statusEl) return;
      statusEl.textContent = message;
      statusEl.style.display = "block";
    };

    const slug = getSlugFromPath();
    if (!slug) {
      setStatus(getText("missingSlug"));
      return;
    }

    setStatus(getText("loading"));

    try {
      const response = await apiClient.apiFetch(`/api/blogs/public/${encodeURIComponent(slug)}`);
      const blog = await response.json();

      const titleText = blog.title || getText("untitled");
      if (titleEl) titleEl.textContent = titleText;
      if (breadcrumbTitle) breadcrumbTitle.textContent = titleText;
      document.title = `${titleText} | Uniwave Logistics`;

      if (summaryEl) {
        if (blog.summary) {
          summaryEl.textContent = blog.summary;
          summaryEl.style.display = "block";
        } else {
          summaryEl.style.display = "none";
        }
      }

      if (metaEl) {
        metaEl.textContent = buildMetaText(blog);
      }

      if (imageEl) {
        imageEl.src = blog.thumbnailUrl || FALLBACK_IMAGE;
        imageEl.alt = titleText;
      }

      if (contentEl) {
        contentEl.innerHTML = normalizeContentHtml(blog.contentHtml || "");
      }

      if (statusEl) statusEl.style.display = "none";
    } catch (error) {
      setStatus(getText("error"));
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const apiClient = window.UniwaveApi || window.UniwaveAPI;
    const hasApi = apiClient && typeof apiClient.apiFetch === "function";

    const homeList = document.getElementById("homeBlogList");
    if (homeList) {
      if (hasApi) {
        loadHomeBlogs(apiClient);
      } else {
        setMessage(homeList, getText("error"));
      }
    }

    const listContainer = document.getElementById("blogList");
    if (listContainer) {
      if (hasApi) {
        setupBlogList(apiClient);
      } else {
        setMessage(listContainer, getText("error"));
      }
    }

    const detailTitle = document.getElementById("blogDetailTitle");
    if (detailTitle) {
      if (hasApi) {
        loadBlogDetail(apiClient);
      } else {
        const statusEl = document.getElementById("blogDetailStatus");
        if (statusEl) {
          statusEl.textContent = getText("error");
        }
      }
    }
  });
})();
