// This file is part of the WordPress core.
  /* <![CDATA[ */
  window._wpemojiSettings = {
    baseUrl: "https://s.w.org/images/core/emoji/15.1.0/72x72/",
    ext: ".png",
    svgUrl: "https://s.w.org/images/core/emoji/15.1.0/svg/",
    svgExt: ".svg",
    source: {
      concatemoji: "/wp-includes/js/wp-emoji-release.min.js",
    }
  };

  /*! This file is auto-generated */
  (function (window, settings) {
    var storageKey = "wpEmojiSettingsSupports",
        featuresToTest = ["flag", "emoji"];

    settings.supports = {
      everything: true,
      everythingExceptFlag: true
    };

    // Hàm kiểm tra hỗ trợ emoji
    function testEmoji(ctx, emoji1, emoji2) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillText(emoji1, 0, 0);
      const img1 = new Uint32Array(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data);

      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.fillText(emoji2, 0, 0);
      const img2 = new Uint32Array(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data);

      return img1.every((val, i) => val === img2[i]);
    }

    // Hàm kiểm tra hỗ trợ theo loại emoji
    function supportsFeature(ctx, type, tester) {
      switch (type) {
        case "flag":
          return !tester(ctx, "🏳️‍🌈", "🏳️‍🌈") &&
                 !tester(ctx, "🇺🇸", "🇺🇸") &&
                 !tester(ctx, "🏴‍☠️", "🏴‍☠️");
        case "emoji":
          return !tester(ctx, "🐦‍🔥", "🐦‍🔥");
        default:
          return false;
      }
    }

    // Hàm lưu kết quả test vào sessionStorage
    function storeSupportInfo(data) {
      try {
        sessionStorage.setItem(storageKey, JSON.stringify({
          supportTests: data,
          timestamp: new Date().valueOf()
        }));
      } catch (e) { }
    }

    // Hàm chạy test hỗ trợ
    function runTests(types, testFn, compareFn) {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.textBaseline = "top";
      ctx.font = "600 32px Arial";

      const result = {};
      types.forEach(type => {
        result[type] = testFn(ctx, type, compareFn);
      });
      return result;
    }

    // Hàm tải file JS
    function loadScript(src) {
      const script = document.createElement("script");
      script.src = src;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Kiểm tra sessionStorage có sẵn kết quả chưa
    const savedData = (() => {
      try {
        const data = JSON.parse(sessionStorage.getItem(storageKey));
        if (data && typeof data.timestamp === "number" &&
            new Date().valueOf() < data.timestamp + 604800000 &&
            typeof data.supportTests === "object") {
          return data.supportTests;
        }
      } catch (e) { }
      return null;
    })();

    // Nếu chưa có kết quả lưu thì chạy kiểm tra
    if (!savedData) {
      const supportData = runTests(featuresToTest, supportsFeature, testEmoji);
      storeSupportInfo(supportData);
    }

    // Cập nhật settings.supports từ kết quả kiểm tra
    const supportResults = savedData || runTests(featuresToTest, supportsFeature, testEmoji);
    for (const key in supportResults) {
      settings.supports[key] = supportResults[key];
      settings.supports.everything = settings.supports.everything && supportResults[key];
      if (key !== "flag") {
        settings.supports.everythingExceptFlag = settings.supports.everythingExceptFlag && supportResults[key];
      }
    }

    settings.supports.everythingExceptFlag = settings.supports.everythingExceptFlag && !settings.supports.flag;
    settings.DOMReady = false;
    settings.readyCallback = () => {
      settings.DOMReady = true;
    };

    // Nếu trình duyệt không hỗ trợ, tải thêm JS từ source
    if (!settings.supports.everything) {
      settings.readyCallback();
      const src = settings.source || {};
      if (src.concatemoji) {
        loadScript(src.concatemoji);
      } else if (src.wpemoji && src.twemoji) {
        loadScript(src.twemoji);
        loadScript(src.wpemoji);
      }
    }
  })(window, window._wpemojiSettings);
  /* ]]> */