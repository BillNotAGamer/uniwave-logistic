// Toggle sidebar on mobile
document.addEventListener('DOMContentLoaded', function () {
  const Api = window.UniwaveApi || window.UniwaveAPI;
  const currentPath = (function () {
    const rawPath = window.location.pathname || "";
    const normalized = rawPath.replace(/\\/g, "/");
    const lower = normalized.toLowerCase();
    const adminIndex = lower.lastIndexOf("/admin/");
    if (adminIndex !== -1) {
      return normalized.slice(adminIndex);
    }
    const filename = normalized.split("/").pop();
    return filename ? `/admin/${filename}` : "/admin/dashboard";
  })();

  const redirectToAuth = function () {
    const redirectTarget = `${currentPath}${window.location.search || ""}`;
    const authUrl = `../authentication.html?redirect=${encodeURIComponent(redirectTarget)}`;
    window.location.href = authUrl;
  };

  const hasToken =
    typeof Api?.getAccessToken === "function" && !!Api.getAccessToken();
  const roles = typeof Api?.getRoles === "function" ? Api.getRoles() : [];
  const isAdminUser =
    typeof Api?.isAdmin === "function"
      ? Api.isAdmin()
      : roles.some((role) => String(role).toLowerCase() === "admin");
  const isContentEditorUser =
    typeof Api?.isContentEditor === "function"
      ? Api.isContentEditor()
      : roles.some((role) => String(role).toLowerCase() === "contenteditor");
  const pageName = currentPath.split("/").pop() || "";
  const contentEditorPages = new Set([
    "blogs",
    "blog-create",
    "blog-edit",
    "blog-detail"
  ]);

  if (!hasToken || !roles.length || (!isAdminUser && !isContentEditorUser)) {
    redirectToAuth();
    return;
  }

  if (!isAdminUser && isContentEditorUser && !contentEditorPages.has(pageName)) {
    window.location.href = "/admin/blogs";
    return;
  }

  const logoutTriggers = Array.from(document.querySelectorAll("[data-admin-logout]"));
  const fallbackLogoutTriggers = logoutTriggers.length
    ? logoutTriggers
    : Array.from(document.querySelectorAll("a, button")).filter((element) => {
        const label = (element.textContent || "").trim().toLowerCase();
        return label === "sign out";
      });

  if (fallbackLogoutTriggers.length) {
    fallbackLogoutTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (event) => {
        event.preventDefault();
        if (typeof Api?.clearAuthTokens === "function") {
          Api.clearAuthTokens();
        }
        redirectToAuth();
      });
    });
  }

  const toggleSidebarBtn = document.getElementById('toggleSidebarBtn');
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('sidebarBackdrop');
  const sidebarLinks = document.querySelectorAll('[data-sidebar-link]');
  const mobileBreakpoint = 1024;
  let backdropHideTimeout;

  const setBackdropHidden = function (hidden) {
    if (!backdrop) {
      return;
    }

    if (hidden) {
      backdrop.classList.add('hidden');
    } else {
      backdrop.classList.remove('hidden');
    }
  };

  const openSidebar = function () {
    if (!sidebar) {
      return;
    }

    sidebar.classList.add('show');
    document.body.classList.add('sidebar-open');

    if (toggleSidebarBtn) {
      toggleSidebarBtn.setAttribute('aria-expanded', 'true');
    }

    if (backdrop) {
      clearTimeout(backdropHideTimeout);
      setBackdropHidden(false);
      requestAnimationFrame(function () {
        backdrop.classList.add('show');
      });
    }
  };

  const closeSidebar = function () {
    if (!sidebar) {
      return;
    }

    sidebar.classList.remove('show');
    document.body.classList.remove('sidebar-open');

    if (toggleSidebarBtn) {
      toggleSidebarBtn.setAttribute('aria-expanded', 'false');
    }

    if (backdrop) {
      backdrop.classList.remove('show');
      clearTimeout(backdropHideTimeout);
      backdropHideTimeout = setTimeout(function () {
        setBackdropHidden(true);
      }, 250);
    }
  };

  const isSidebarOpen = function () {
    return sidebar && sidebar.classList.contains('show');
  };

  if (toggleSidebarBtn && sidebar) {
    toggleSidebarBtn.addEventListener('click', function () {
      if (isSidebarOpen()) {
        closeSidebar();
        return;
      }

      openSidebar();
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', function () {
      closeSidebar();
    });
  }

  if (sidebarLinks.length) {
    sidebarLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        if (window.innerWidth < mobileBreakpoint) {
          closeSidebar();
        }
      });
    });
  }

  window.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && isSidebarOpen()) {
      closeSidebar();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth >= mobileBreakpoint) {
      closeSidebar();
      setBackdropHidden(true);
    }
  });
});
