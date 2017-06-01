(function() {
  var monacaApi = Object.create(null);
  monacaApi.executedLoginCheck = false;

  var loginData = {
    preReady:     false,
    ready:        false,
    profile:      null,
    status :      null,
    preListeners: [],
    listeners:    [],
    autoDisplay:  true,

    setReady: function() {
      this.ready = true; 
      this.listeners.forEach(function(f) {
        f(this);
      });
      this.listeners = [];
      if (this.autoDisplay) {
        displayBody();
      }
    },

    onReady: function(f) {
      if (this.ready == true) {
        f(this);
      } else {
        this.listeners.push(f);
      }
    },

    setPreReady: function() {
      this.preReady = true;
      this.preListeners.forEach(function(f) {
        f(this);
      });
      this.preListeners = [];
    },

    onPreReady: function(f) {
      if (this.preReady == true) {
        f(this);
      } else {
        this.preListeners.push(f);
      }
    },

    getProfileColumn: function(col) {
      if (this.profile && this.profile[col]) {
        return this.profile[col];
      }
      return '';
    }
  };

  monacaApi.loginCheck = function(status) {
    this.executedLoginCheck = true;
    loginData.status = status;
    loginData.setPreReady();

    if (!status.isLogin) {
      loginData.setReady();
    }

    if (status.isLogin) {
      $(".navbar-nav .before-login").remove();
      this.loadLoginData();
    } else {
      $(".navbar-nav .after-login").remove();
    }
  };
  
  monacaApi.getBaseUrl = function() {
    return window.MONACA_API_URL;
  };

  monacaApi.loadLoginData = function() {
    if (!loginData.status.isLogin) {
      loginData.setReady();
      return;
    }

    $.ajax({
      type: "GET",
      url: monacaApi.getBaseUrl() + "/" + window.LANG + "/login_io_check",
      xhrFields: {
        withCredentials: true
      },
      dataType: "json",
      success: function(msg) {
        loginData.profile = msg.result;
        monacaApi.showGravator();
        loginData.setReady();
      },
      error: function(msg) {
        loginData.setReady();
      }
    });
 
  };

  monacaApi.showGravator = function ( ) {
    if (loginData.profile != null) {
      $(".user-icon").attr("src",loginData.profile.gravatar);
    }
  };

  // Page Initialization;
  window.addEventListener('DOMContentLoaded', function() {
    var path = location.pathname;
    var popup_csrf_token = '';
    var msec = 400;

    if (path.slice(-1) == '/') {
      path += "index.html";
    }
    if (isIdeAvailable()) {
      $('#signup-ng').remove();
    } else {
      $('#signup-ok').remove();
    }

    $('.exec-logout').click(function() {
      $.ajax({
        type: "POST",
        url: monacaApi.getBaseUrl() + "/" + window.LANG + "/api/account/logout",
        xhrFields: {
          withCredentials: true
        },
        dataType: "json",
        success: function (msg) {
          location.reload();
        },
        error: function (msg) {
          location.reload();
        }
      });
    });

    $('.go-to-dashboard').click(function() {
      location.href = MONACA_API_URL + '/' + LANG + '/dashboard';
    });

    $('.btn-github').click(function() {
      location.href = MONACA_GITHUB_OAUTH_URL;
    });

    $('#show_signuppopup').click(function() {
      if (isSafari()) {
        location.href=window.MONACA_API_URL + "/" + window.LANG + "/register/start";
        return;
      }

      formUtil.resetError();
      setCsrfToken("signuppopup-csrf-token", monacaApi.getBaseUrl() + "/" + window.LANG + "/api/register");

      $('#signuppopup').fadeIn(msec)
        .find('input#signup_popup_email')
        .focus();
      $("#modal-overlay").fadeIn(msec).one('click', function() {
        closePopup(msec, 'signuppopup');
      });
    });

    $('#show_loginpopup').click(function() {
      if (isSafari()) {
        location.href=window.MONACA_API_URL + "/" + window.LANG + "/login";
        return;
      }

      formUtil.resetError();
      setCsrfToken("loginpopup-csrf-token", monacaApi.getBaseUrl() + "/" + window.LANG + "/api/account/login");
      $('#loginpopup').fadeIn(msec)
        .find('input#login_popup_email')
        .focus();
      $("#modal-overlay").fadeIn(msec).one('click', function() {
        closePopup(msec, 'loginpopup');
      });
    });

    $('#close_signupbackpopup').click(function() {
      closePopup(msec, 'signuppopup');
    });

    $('#close_loginpopup').click(function() {
      closePopup(msec, 'loginpopup');
    });

    $('#popup_signup_btn').click(function() {
      $('#popup_signup_btn').addClass('loading');
      $("#signup-popup-form").attr('action', window.MONACA_API_URL + "/" + window.LANG + "/register/start");
      $("#signup-popup-form").submit();
    });

    $('#popup_login_btn').click(function() {
      $('#popup_login_btn').addClass('loading');
      $("#login-popup-form").attr('action', window.MONACA_API_URL + "/" + window.LANG + "/login");
      $("#login-popup-form").submit();
    });

    var f = monacaPages[path];
    if (f) {
      f(loginData);
    }

    function setCsrfToken(elementId, url) {
      getCsrfToken(url, function(token) {
        $("#"+elementId).val(token);
      });
    }

    function getCsrfToken(url, callback) {
      $.ajax({
        type: "GET",
        url: url,
        xhrFields: {
          withCredentials: true
        },
        dataType: "json",
        success: function (msg) {
          if (msg.result && msg.result.initOK) {
            popup_csrf_token = msg.result.initOK._csrf_token;
          } else if (msg.result && msg.result._csrf_token) {
            popup_csrf_token = msg.result._csrf_token;
          }
          if (popup_csrf_token && callback) {
            callback(popup_csrf_token);
          }
        },
        error: function (msg) {}
      });
    }
  } , false);

  monacaApi.getUrlVars = function() {
    var vars = [], hash;

    if (window.location.href.indexOf('?') == -1) {
      return vars;
    }

    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');

    for(var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars[hash[0]] = hash[1];
    }
    return vars;
  };

  window.monacaApi = monacaApi;
})();
