jQuery(document).ready(function ($) {
  $(this).find(':submit').removeAttr('disabled');
  WDK = {
    ajaxurl: WDK_WP.ajaxurl,
    nonce: WDK_WP.lfNonce,
    textCounter: WDK_WP.textCounter,
    textCounterNum: WDK_WP.textCounterNum !== '' ? WDK_WP.textCounterNum : 300,
    jpages: WDK_WP.jpages,
    numPerPage: WDK_WP.jPagesNum !== '' ? WDK_WP.jPagesNum : 10,
    widthWrap: WDK_WP.widthWrap !== '' ? WDK_WP.widthWrap : '',
    autoLoad: WDK_WP.autoLoad,
    thanksComment: WDK_WP.thanksComment,
    thanksReplyComment: WDK_WP.thanksReplyComment,
    duplicateComment: WDK_WP.duplicateComment,
    insertImage: WDK_WP.insertImage,
    insertVideo: WDK_WP.insertVideo,
    insertLink: WDK_WP.insertLink,
    accept: WDK_WP.accept,
    cancel: WDK_WP.cancel,
    reply: WDK_WP.reply,
    checkVideo: WDK_WP.checkVideo,
    textWriteComment: WDK_WP.textWriteComment,
    classPopularComment: WDK_WP.classPopularComment,
  };

  //Remove duplicate comment box
  jQuery('.wdk-wrap-comments').each(function (index, element) {
    var ids = jQuery("[id='" + this.id + "']");
    if (ids.length > 1) {
      ids.slice(1).closest('.wdk-wrapper').remove();
    }
  });

  //Remove id from input hidden comment_parent and comment_post_ID. Para prevenir duplicados
  jQuery(
    '.wdk-container-form [name="comment_parent"], .wdk-container-form [name="comment_post_ID"]'
  ).each(function (index, input) {
    $(input).removeAttr('id');
  });

  // PlaceHolder Plugin
  if (typeof jQuery.fn.placeholder == 'function') {
    $(
      '.wdk-wrap-form input, .wdk-wrap-form textarea, #wdk-modal input, #wdk-modal textarea'
    ).placeholder();
  }
  // Autosize Plugin
  if (typeof autosize == 'function') {
    autosize($('textarea.wdk-textarea'));
  }

  //Actualizamos alturas de los videos
  $('.wdk-wrapper').each(function () {
    rezizeBoxComments_WDK($(this));
    restoreIframeHeight($(this));
  });
  $(window).resize(function () {
    $('.wdk-wrapper').each(function () {
      rezizeBoxComments_WDK($(this));
      restoreIframeHeight($(this));
    });
  });

  // CAPTCHA
  if ($('.wdk-captcha').length) {
    captchaValues = captcha_WDK(9);
    $('.wdk-captcha-text').html(
      captchaValues.n1 + ' &#43; ' + captchaValues.n2 + ' = '
    );
  }

  // OBTENER COMENTARIOS

  $(document).delegate('a.wdk-link', 'click', function (e) {
    e.preventDefault();
    var linkVars = getUrlVars_WDK($(this).attr('href'));
    var post_id = linkVars.post_id;
    var num_comments = linkVars.comments;
    var num_get_comments = linkVars.get;
    var order_comments = linkVars.order;
    $('#wdk-wrap-commnent-' + post_id).slideToggle(200);
    var $container_comment = $('#wdk-container-comment-' + post_id);
    if ($container_comment.length && $container_comment.html().length === 0) {
      getComments_WDK(post_id, num_comments, num_get_comments, order_comments);
    }
    return false;
  });
  // CARGAR COMENTARIOS AUTOMÁTICAMENTE

  if ($('a.wdk-link').length) {
    $('a.wdk-link.auto-load-true').each(function () {
      $(this).click();
    });
  }

  //Cancelar acciones
  $(document)
    .find('.wdk-container-form')
    .keyup(function (tecla) {
      post_id = $(this).find('form').attr('id').replace('commentform-', '');
      if (tecla.which == 27) {
        cancelCommentAction_WDK(post_id);
      }
    });

  //Mostrar - Ocultar Enlaces de Responder, Editar
  $(document).delegate('input.wdk-cancel-btn', 'click', function (event) {
    event.stopPropagation();
    post_id = $(this).closest('form').attr('id').replace('commentform-', '');
    cancelCommentAction_WDK(post_id);
  });

  // RESPONDER COMENTARIOS
  $(document).delegate('.wdk-reply-link', 'click', function (e) {
    e.preventDefault();
    var linkVars = getUrlVars_WDK($(this).attr('href'));
    var comment_id = linkVars.comment_id;
    var post_id = linkVars.post_id;
    //Restauramos cualquier acción
    cancelCommentAction_WDK(post_id);
    var form = $('#commentform-' + post_id);
    form.find('[name="comment_parent"]').val(comment_id); //input oculto con referencia al padre
    form
      .find('.wdk-textarea')
      .val('')
      .attr('placeholder', WDK_WP.reply + '. ESC (' + WDK_WP.cancel + ')')
      .focus();
    form.find('input[name="submit"]').addClass('wdk-reply-action');
    $('#commentform-' + post_id)
      .find('input.wdk-cancel-btn')
      .show();
    //scroll
    scrollThis_WDK(form);

    return false;
  });

  //EDITAR COMENTARIOS
  $(document).delegate('.wdk-edit-link', 'click', function (e) {
    e.preventDefault();
    var linkVars = getUrlVars_WDK($(this).attr('href'));
    var comment_id = linkVars.comment_id;
    var post_id = linkVars.post_id;
    //Restauramos cualquier acción
    cancelCommentAction_WDK(post_id);
    var form = $('#commentform-' + post_id);
    form.find('[name="comment_parent"]').val(comment_id); //input oculto con referencia al padre
    form.find('.wdk-textarea').val('').focus();
    form.find('input[name="submit"]').addClass('wdk-edit-action');
    //scroll
    scrollThis_WDK(form);
    getCommentText_WDK(post_id, comment_id);
  });

  //ELIMINAR COMENTARIOS
  $(document).delegate('.wdk-delete-link', 'click', function (e) {
    e.preventDefault();
    var linkVars = getUrlVars_WDK($(this).attr('href'));
    var comment_id = linkVars.comment_id;
    var post_id = linkVars.post_id;
    if (confirm(WDK_WP.textMsgDeleteComment)) {
      deleteComment_WDK(post_id, comment_id);
    }
  });

  $('input, textarea').focus(function (event) {
    $(this).removeClass('wdk-error');
    $(this).siblings('.wdk-error-info').hide();
  });

  // ENVIAR COMENTARIO
  $(document).on('submit', '.wdk-container-form form', function (event) {
    event.preventDefault();
    $(this).find(':submit').attr('disabled', 'disabled');
    $('input, textarea').removeClass('wdk-error');
    var formID = $(this).attr('id');
    var post_id = formID.replace('commentform-', '');
    var form = $('#commentform-' + post_id);
    var link_show_comments = $('#wdk-link-' + post_id);
    var num_comments = link_show_comments.attr('href').split('=')[2];
    var form_ok = true;

    // VALIDAR COMENTARIO
    var $content = form.find('textarea').val().replace(/\s+/g, ' ');
    //Si el comentario tiene menos de 2 caracteres no se enviará
    if ($content.length < 2) {
      form.find('.wdk-textarea').addClass('wdk-error');
      form.find('.wdk-error-info-text').show();
      setTimeout(function () {
        form.find('.wdk-error-info-text').fadeOut(500);
      }, 2500);
      $(this).find(':submit').removeAttr('disabled');
      return false;
    } else {
      // VALIDAR CAMPOS DE TEXTO
      if ($(this).find('input#author').length) {
        var $author = $(this).find('input#author');
        var $authorVal = $author.val().replace(/\s+/g, ' ');
        var $authorRegEx = /^[^?%$=\/]{1,30}$/i;

        if ($authorVal == ' ' || !$authorRegEx.test($authorVal)) {
          $author.addClass('wdk-error');
          form.find('.wdk-error-info-name').show();
          setTimeout(function () {
            form.find('.wdk-error-info-name').fadeOut(500);
          }, 3000);
          form_ok = false;
        }
      }
      if ($(this).find('input#email').length) {
        var $emailRegEx = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;
        var $email = $(this).find('input#email');
        var $emailVal = $email.val().replace(/\s+/g, '');
        $email.val($emailVal);

        if (!$emailRegEx.test($emailVal)) {
          $email.addClass('wdk-error');
          form.find('.wdk-error-info-email').show();
          setTimeout(function () {
            form.find('.wdk-error-info-email').fadeOut(500);
          }, 3000);
          form_ok = false;
        }
      }
      if (!form_ok) {
        $(this).find(':submit').removeAttr('disabled');
        return false;
      }

      // VALIDAR CAPTCHA
      if ($('.wdk-captcha').length) {
        var captcha = $('#wdk-captcha-value-' + post_id);
        form_ok = true;
        if (captcha.val() != captchaValues.n1 + captchaValues.n2) {
          form_ok = false;
          captcha.addClass('wdk-error');
        }
        captchaValues = captcha_WDK(9);
        $('.wdk-captcha-text').html(
          captchaValues.n1 + ' &#43; ' + captchaValues.n2 + ' = '
        );
        captcha.val('');
      }

      //Si el formulario está validado
      if (form_ok === true) {
        //Si no existe campo lo creamos
        if (!form.find('input[name="comment_press"]').length) {
          form
            .find('input[name="submit"]')
            .after('<input type="hidden" name="comment_press" value="true">');
        }
        comment_id = form.find('[name="comment_parent"]').val();
        //Insertamos un nuevo comentario
        if (form.find('input[name="submit"]').hasClass('wdk-edit-action')) {
          editComment_WDK(post_id, comment_id);
        } else if (
          form.find('input[name="submit"]').hasClass('wdk-reply-action')
        ) {
          insertCommentReply_WDK(post_id, comment_id, num_comments);
        } else {
          insertComment_WDK(post_id, num_comments);
        }
        cancelCommentAction_WDK(post_id);
      }
      $(this).find(':submit').removeAttr('disabled');
    }
    return false;
  }); //end submit

  function getComments_WDK(
    post_id,
    num_comments,
    num_get_comments,
    order_comments
  ) {
    var status = $('#wdk-comment-status-' + post_id);
    var $container_comments = $('ul#wdk-container-comment-' + post_id);
    if (num_comments > 0) {
      jQuery.ajax({
        type: 'POST',
        dataType: 'html', // tipo de información que se espera de respuesta
        url: WDK.ajaxurl,
        data: {
          action: 'get_comments',
          post_id: post_id,
          get: num_get_comments,
          order: order_comments,
          nonce: WDK.nonce,
        },
        beforeSend: function () {
          status
            .addClass('wdk-loading')
            .html('<span class="lfo-loading"></span>')
            .show();
        },
        success: function (data) {
          status.removeClass('wdk-loading').html('').hide();
          $container_comments.html(data);
          highlightPopularComments_WDK(post_id, $container_comments);
          $container_comments.show(); //Mostramos los Comentarios
          //Insertamos Paginación de Comentarios
          jPages_WDK(post_id, WDK.numPerPage);
          toggleMoreComments($container_comments);
        },
        error: function (jqXHR, textStatus, errorThrown) {
          clog('ajax error');
          clog('jqXHR');
          clog(jqXHR);
          clog('errorThrown');
          clog(errorThrown);
        },
        complete: function (jqXHR, textStatus) {},
      }); //end jQuery.ajax
    } //end if
    return false;
  } //end function

  function highlightPopularComments_WDK(post_id, $container_comments) {
    var order = $container_comments.data('order');
    if (
      order == 'likes' &&
      $container_comments.hasClass('wdk-multiple-comments wdk-has-likes')
    ) {
      var top_likes = $container_comments
        .find('>.wdk-item-comment')
        .eq(0)
        .data('likes');
      var temp = false;
      $container_comments
        .find('>.wdk-item-comment')
        .each(function (index, comment) {
          if (!temp && $(comment).data('likes') == top_likes) {
            $(comment).addClass(WDK.classPopularComment);
            temp = true;
          }
        });
    }
  }

  function jQFormSerializeArrToJson(formSerializeArr) {
    var jsonObj = {};
    jQuery.map(formSerializeArr, function (n, i) {
      jsonObj[n.name] = n.value;
    });

    return jsonObj;
  }

  function insertComment_WDK(post_id, num_comments) {
    var link_show_comments = $('#wdk-link-' + post_id);
    var comment_form = $('#commentform-' + post_id);
    var status = $('#wdk-comment-status-' + post_id);
    var form_data = comment_form.serialize(); //obtenemos los datos

    $.ajax({
      type: 'post',
      method: 'post',
      url: comment_form.attr('action'),
      data: form_data,
      dataType: 'html',
      beforeSend: function () {
        status
          .addClass('wdk-loading')
          .html('<span class="lfo-loading"></span>')
          .show();
      },
      success: function (data, textStatus) {
        cc('success data', data);
        status.removeClass('wdk-loading').html('');
        if (data != 'error') {
          status.html(
            '<p class="wdk-ajax-success">' + WDK.thanksComment + '</p>'
          );
          if (link_show_comments.find('span').length) {
            num_comments = String(parseInt(num_comments, 10) + 1);
            link_show_comments.find('span').html(num_comments);
          }
        } else {
          status.html(
            '<p class="wdk-ajax-error">Error processing your form</p>'
          );
        }
        //Agregamos el nuevo comentario a la lista
        $('ul#wdk-container-comment-' + post_id)
          .prepend(data)
          .show();
        //Actualizamos el Paginador
        jPages_WDK(post_id, WDK.numPerPage, true);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        status
          .removeClass('wdk-loading')
          .html('<p class="wdk-ajax-error" >' + WDK.duplicateComment + '</p>');
      },
      complete: function (jqXHR, textStatus) {
        setTimeout(function () {
          status.removeClass('wdk-loading').fadeOut(600);
        }, 2500);
      },
    }); //end ajax
    return false;
  }

  function insertCommentReply_WDK(post_id, comment_id, num_comments) {
    var link_show_comments = $('#wdk-link-' + post_id);
    var comment_form = $('#commentform-' + post_id);
    var status = $('#wdk-comment-status-' + post_id);
    var item_comment = $('#wdk-item-comment-' + comment_id);
    var form_data = comment_form.serialize(); //obtenemos los datos

    $.ajax({
      type: 'post',
      method: 'post',
      url: comment_form.attr('action'),
      data: form_data,
      beforeSend: function () {
        status
          .addClass('wdk-loading')
          .html('<span class="lfo-loading"></span>')
          .show();
      },
      success: function (data, textStatus) {
        cc('success data', data);
        status.removeClass('wdk-loading').html('');
        if (data != 'error') {
          status.html(
            '<p class="wdk-ajax-success">' + WDK.thanksReplyComment + '</p>'
          );
          if (link_show_comments.find('span').length) {
            num_comments = parseInt(num_comments, 10) + 1;
            link_show_comments.find('span').html(num_comments);
          }
          if (!item_comment.find('ul').length) {
            item_comment.append('<ul class="children"></ul>');
          }
          //Agregamos el nuevo comentario a la lista
          item_comment.find('ul').append(data);

          //scroll
          setTimeout(function () {
            scrollThis_WDK(item_comment.find('ul li').last());
          }, 1000);
        } else {
          status.html(
            '<p class="wdk-ajax-error">Error in processing your form.</p>'
          );
        }
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        status.html(
          '<p class="wdk-ajax-error" >' + WDK.duplicateComment + '</p>'
        );
      },
      complete: function (jqXHR, textStatus) {
        setTimeout(function () {
          status.removeClass('wdk-loading').fadeOut(600);
        }, 2500);
      },
    }); //end ajax
    return false;
  }

  function editComment_WDK(post_id, comment_id) {
    var form = $('#commentform-' + post_id);
    var status = $('#wdk-comment-status-' + post_id);
    jQuery.ajax({
      type: 'POST',
      //dataType: "html",
      url: WDK.ajaxurl,
      data: {
        action: 'edit_comment_wdk',
        post_id: post_id,
        comment_id: comment_id,
        comment_content: form.find('.wdk-textarea').val(),
        nonce: WDK.nonce,
      },
      beforeSend: function () {
        status
          .addClass('wdk-loading')
          .html('<span class="lfo-loading"></span>')
          .show();
      },
      success: function (result) {
        status.removeClass('wdk-loading').html('');
        var data = jQuery.parseJSON(result);
        if (data.ok === true) {
          $('#wdk-comment-' + comment_id)
            .find('.wdk-comment-text')
            .html(data.comment_text);
          //scroll
          setTimeout(function () {
            scrollThis_WDK($('#wdk-comment-' + comment_id));
          }, 1000);
        } else {
          console.log('Errors: ' + data.error);
        }
      }, //end success
      complete: function (jqXHR, textStatus) {
        setTimeout(function () {
          status.removeClass('wdk-loading').fadeOut(600);
        }, 2500);
      },
    }); //end jQuery.ajax
    return false;
  }

  function getCommentText_WDK(post_id, comment_id) {
    var form = $('#commentform-' + post_id);
    var status = $('#wdk-comment-status-' + post_id);
    jQuery.ajax({
      type: 'POST',
      dataType: 'html',
      url: WDK.ajaxurl,
      data: {
        action: 'get_comment_text_wdk',
        post_id: post_id,
        comment_id: comment_id,
        nonce: WDK.nonce,
      },
      beforeSend: function () {
        //status.addClass('wdk-loading').html('<span class="lfo-loading"></span>').show();
      },
      success: function (data) {
        //status.removeClass('wdk-loading').html('');
        if (data !== 'wdk-error') {
          $('#wdk-textarea-' + post_id).val(data);
          autosize.update($('#wdk-textarea-' + post_id));
          //$('#commentform-'+post_id).find('input[name="submit"]').hide();
          $('#commentform-' + post_id)
            .find('input.wdk-cancel-btn')
            .show();
        } else {
        }
      }, //end success
      complete: function (jqXHR, textStatus) {},
    }); //end jQuery.ajax
    return false;
  } //end function

  function deleteComment_WDK(post_id, comment_id) {
    jQuery.ajax({
      type: 'POST',
      dataType: 'html',
      url: WDK.ajaxurl,
      data: {
        action: 'delete_comment_wdk',
        post_id: post_id,
        comment_id: comment_id,
        nonce: WDK.nonce,
      },
      beforeSend: function () {},
      success: function (data) {
        if (data === 'ok') {
          $('#wdk-item-comment-' + comment_id).remove();
        }
      }, //end success
    }); //end jQuery.ajax
    return false;
  } //end function

  //MOSTRAR/OCULTAR MÁS COMENTARIOS
  function toggleMoreComments($container_comments) {
    //console.log("======================= toggleMoreComments ", $container_comments.attr('id'));
    var liComments = $container_comments.find('>li.depth-1.wdk-item-comment');
    liComments.each(function (index, element) {
      var ulChildren = $(this).find('> ul.children');
      if (ulChildren.length && ulChildren.find('li').length > 3) {
        ulChildren.find('li:gt(2)').css('display', 'none');
        ulChildren.append(
          '<a href="#" class="wdk-load-more-comments">' +
            WDK_WP.textLoadMore +
            '</a>'
        );
      }
    });
  }

  $(document).delegate('a.wdk-load-more-comments', 'click', function (e) {
    e.preventDefault();
    $(this).parent().find('li.wdk-item-comment').fadeIn('slow');
    $(this).remove();
  });

  $(document).delegate('.wdk-media-btns a', 'click', function (e) {
    e.preventDefault();
    var post_id = $(this).attr('href').split('=')[1].replace('&action', '');
    var $action = $(this).attr('href').split('=')[2];
    $('body').append('<div id="wdk-overlay"></div>');
    $('body').append('<div id="wdk-modal"></div>');
    $modalHtml =
      '<div id="wdk-modal-wrap"><span id="wdk-modal-close"></span><div id="wdk-modal-header"><h3 id="wdk-modal-title">Título</h3></div><div id="wdk-modal-content"><p>Hola</p></div><div id="wdk-modal-footer"><a id="wdk-modal-ok-' +
      post_id +
      '" class="wdk-modal-ok wdk-modal-btn" href="#">' +
      WDK.accept +
      '</a><a class="wdk-modal-cancel wdk-modal-btn" href="#">' +
      WDK.cancel +
      '</a></div></div>';
    $('#wdk-modal').append($modalHtml).fadeIn(250);

    switch ($action) {
      case 'url':
        $('#wdk-modal').removeClass().addClass('wdk-modal-url');
        $('#wdk-modal-title').html(WDK.insertLink);
        $('#wdk-modal-content').html(
          '<input type="text" id="wdk-modal-url-link" class="wdk-modal-input" placeholder="' +
            WDK_WP.textUrlLink +
            '"/><input type="text" id="wdk-modal-text-link" class="wdk-modal-input" placeholder="' +
            WDK_WP.textToDisplay +
            '"/>'
        );
        break;

      case 'image':
        $('#wdk-modal').removeClass().addClass('wdk-modal-image');
        $('#wdk-modal-title').html(WDK.insertImage);
        $('#wdk-modal-content').html(
          '<input type="text" id="wdk-modal-url-image" class="wdk-modal-input" placeholder="' +
            WDK_WP.textUrlImage +
            '"/><div id="wdk-modal-preview"></div>'
        );
        break;

      case 'video':
        $('#wdk-modal').removeClass().addClass('wdk-modal-video');
        $('#wdk-modal-title').html(WDK.insertVideo);
        $('#wdk-modal-content').html(
          '<input type="text" id="wdk-modal-url-video" class="wdk-modal-input" placeholder="' +
            WDK_WP.textUrlVideo +
            '"/><div id="wdk-modal-preview"></div>'
        );
        $('#wdk-modal-footer').prepend(
          '<a id="wdk-modal-verifique-video" class="wdk-modal-verifique wdk-modal-btn" href="#">' +
            WDK.checkVideo +
            '</a>'
        );
        break;
    }
  }); //
  //acción Ok
  $(document).delegate('.wdk-modal-ok', 'click', function (e) {
    e.preventDefault();
    $('#wdk-modal input, #wdk-modal textarea').removeClass('wdk-error');
    var $action = $('#wdk-modal').attr('class');
    var post_id = $(this).attr('id').replace('wdk-modal-ok-', '');
    switch ($action) {
      case 'wdk-modal-url':
        processUrl_WDK(post_id);
        break;
      case 'wdk-modal-image':
        processImage_WDK(post_id);
        break;
      case 'wdk-modal-video':
        processVideo_WDK(post_id);
        break;
    }
    autosize.update($('.wdk-textarea'));
    closeModal_WDK();
    return false;
  });
  //eliminamos errores
  $(document).delegate(
    '#wdk-modal input, #wdk-modal textarea',
    'focus',
    function (e) {
      $(this).removeClass('wdk-error');
    }
  );

  function processUrl_WDK(post_id) {
    var $ok = true;
    var $urlField = $('#wdk-modal-url-link');
    var $textField = $('#wdk-modal-text-link');
    if ($urlField.val().length < 1) {
      $ok = false;
      $urlField.addClass('wdk-error');
    }
    if ($textField.val().length < 1) {
      $ok = false;
      $textField.addClass('wdk-error');
    }
    if ($ok) {
      var $urlVal = $urlField.val().replace(/https?:\/\//gi, '');
      var link_show_comments =
        '<a href="http://' +
        $urlVal +
        '" title="' +
        $textField.val() +
        '" rel="nofollow" target="_blank">' +
        $textField.val() +
        '</a>';
      insertInTextArea_WDK(post_id, link_show_comments);
    }
    return false;
  }

  function processImage_WDK(post_id) {
    var $ok = true;
    var $urlField = $('#wdk-modal-url-image');
    if ($urlField.val().length < 1) {
      $ok = false;
      $urlField.addClass('wdk-error');
    }
    if ($ok) {
      var $urlVal = $urlField.val();
      var $image = '<img src="' + $urlVal + '" />';
      insertInTextArea_WDK(post_id, $image);
    }
    return false;
  }

  //vista previa de imagen
  $(document).delegate('#wdk-modal-url-image', 'change', function (e) {
    setTimeout(function () {
      $('#wdk-modal-preview').html(
        '<img src="' + $('#wdk-modal-url-image').val() + '" />'
      );
    }, 200);
  });

  function processVideo_WDK(post_id) {
    var $ok = true;
    var $urlField = $('#wdk-modal-url-video');
    if (!$('#wdk-modal-preview').find('iframe').length) {
      $ok = false;
      $('#wdk-modal-preview').html(
        '<p class="wdk-modal-error">Please check the video url</p>'
      );
    }
    if ($ok) {
      var $video =
        '<p>' +
        $('#wdk-modal-preview').find('input[type="hidden"]').val() +
        '</p>';
      insertInTextArea_WDK(post_id, $video);
    }
    return false;
  }

  //vista previa de video
  $(document).delegate('#wdk-modal-verifique-video', 'click', function (e) {
    e.preventDefault();
    var $urlVideo = $('#wdk-modal-url-video');
    var $urlVideoVal = $urlVideo.val().replace(/\s+/g, '');
    $urlVideo.removeClass('wdk-error');
    $(this).attr('id', ''); //desactivamos el enlace

    if ($urlVideoVal.length < 1) {
      $urlVideo.addClass('wdk-error');
      $('.wdk-modal-video')
        .find('a.wdk-modal-verifique')
        .attr('id', 'wdk-modal-verifique-video'); //activamos el enlace
      return false;
    }

    var data = 'url_video=' + $urlVideoVal;
    $.ajax({
      url: WDK.ajaxurl,
      data: data + '&action=verificar_video_WDK',
      type: 'POST',
      dataType: 'html',
      beforeSend: function () {
        $('#wdk-modal-preview').html(
          '<div class="wdk-loading wdk-loading-2"></div>'
        );
      },
      success: function (data) {
        if (data != 'error') {
          $('#wdk-modal-preview').html(data);
        } else {
          $('#wdk-modal-preview').html(
            '<p class="wdk-modal-error">Invalid video url</p>'
          );
        }
      },
      error: function (xhr) {
        $('#wdk-modal-preview').html(
          '<p class="wdk-modal-error">Failed to process, try again</p>'
        );
      },
      complete: function (jqXHR, textStatus) {
        $('.wdk-modal-video')
          .find('a.wdk-modal-verifique')
          .attr('id', 'wdk-modal-verifique-video'); //activamos el enlace
      },
    }); //end ajax
  });

  function closeModal_WDK() {
    $('#wdk-overlay, #wdk-modal').remove();
    return false;
  }

  //acción cancelar
  $(document).delegate(
    '#wdk-modal-close, .wdk-modal-cancel',
    'click',
    function (e) {
      e.preventDefault();
      closeModal_WDK();
      return false;
    }
  );

  function jPages_WDK(post_id, $numPerPage, $destroy) {
    //Si existe el plugin jPages y está activado
    if (typeof jQuery.fn.jPages == 'function' && WDK.jpages == 'true') {
      var $idList = 'wdk-container-comment-' + post_id;
      var $holder = 'div.wdk-holder-' + post_id;
      var num_comments = jQuery('#' + $idList + ' > li').length;
      if (num_comments > $numPerPage) {
        if ($destroy) {
          jQuery('#' + $idList)
            .children()
            .removeClass('animated jp-hidden');
        }
        jQuery($holder).jPages({
          containerID: $idList,
          previous: '← ' + WDK_WP.textNavPrev,
          next: WDK_WP.textNavNext + ' →',
          perPage: parseInt($numPerPage, 10),
          minHeight: false,
          keyBrowse: true,
          direction: 'forward',
          animation: 'fadeIn',
        });
      } //end if
    } //end if
    return false;
  }

  function captcha_WDK($max) {
    if (!$max) $max = 5;
    return {
      n1: Math.floor(Math.random() * $max + 1),
      n2: Math.floor(Math.random() * $max + 1),
    };
  }

  function scrollThis_WDK($this) {
    if ($this.length) {
      var $position = $this.offset().top;
      var $scrollThis = Math.abs($position - 200);
      $('html,body').animate({ scrollTop: $scrollThis }, 'slow');
    }
    return false;
  }

  function getUrlVars_WDK(url) {
    var query = url.substring(url.indexOf('?') + 1);
    var parts = query.split('&');
    var params = {};
    for (var i = 0; i < parts.length; i++) {
      var pair = parts[i].split('=');
      params[pair[0]] = pair[1];
    }
    return params;
  }

  function cancelCommentAction_WDK(post_id) {
    $('form#commentform-' + post_id)
      .find('[name="comment_parent"]')
      .val('0');
    $('form#commentform-' + post_id)
      .find('.wdk-textarea')
      .val('')
      .attr('placeholder', WDK.textWriteComment);
    $('form#commentform-' + post_id)
      .find('input[name="submit"]')
      .removeClass();
    $('form#commentform-' + post_id)
      .find('input.wdk-cancel-btn')
      .hide();
    autosize.update($('#wdk-textarea-' + post_id));
    $('input, textarea').removeClass('wdk-error');
    captchaValues = captcha_WDK(9);
    $('.wdk-captcha-text').html(
      captchaValues.n1 + ' &#43; ' + captchaValues.n2 + ' = '
    );
  }

  function restoreIframeHeight(wrapper) {
    var widthWrapper = WDK.widthWrap
      ? parseInt(WDK.widthWrap, 10)
      : wrapper.outerWidth();
  }

  function rezizeBoxComments_WDK(wrapper) {
    var widthWrapper = WDK.widthWrap
      ? parseInt(WDK.widthWrap, 10)
      : wrapper.outerWidth();
    if (widthWrapper <= 480) {
      wrapper.addClass('wdk-full');
    } else {
      wrapper.removeClass('wdk-full');
    }
  }

  function insertInTextArea_WDK(post_id, $value) {
    //Get textArea HTML control
    var $fieldID = document.getElementById('wdk-textarea-' + post_id);

    //IE
    if (document.selection) {
      $fieldID.focus();
      var sel = document.selection.createRange();
      sel.text = $value;
      return;
    }
    //Firefox, chrome, mozilla
    else if ($fieldID.selectionStart || $fieldID.selectionStart == '0') {
      var startPos = $fieldID.selectionStart;
      var endPos = $fieldID.selectionEnd;
      var scrollTop = $fieldID.scrollTop;
      $fieldID.value =
        $fieldID.value.substring(0, startPos) +
        $value +
        $fieldID.value.substring(endPos, $fieldID.value.length);
      $fieldID.focus();
      $fieldID.selectionStart = startPos + $value.length;
      $fieldID.selectionEnd = startPos + $value.length;
      $fieldID.scrollTop = scrollTop;
    } else {
      $fieldID.value += textArea.value;
      $fieldID.focus();
    }
  }

  // LIKE COMMENTS
  $(document).delegate('a.wdk-rating-link', 'click', function (e) {
    e.preventDefault();
    var comment_id = $(this).attr('href').split('=')[1].replace('&method', '');
    var $method = $(this).attr('href').split('=')[2];
    commentRating_WDK(comment_id, $method);
    return false;
  });

  function commentRating_WDK(comment_id, $method) {
    var $ratingCount = $('#wdk-comment-' + comment_id).find(
      '.wdk-rating-count'
    );
    var $currentLikes = $ratingCount.text();
    jQuery.ajax({
      type: 'POST',
      url: WDK.ajaxurl,
      data: {
        action: 'comment_rating',
        comment_id: comment_id,
        method: $method,
        nonce: WDK.nonce,
      },
      beforeSend: function () {
        $ratingCount.html('').addClass('lfo-loading');
      },
      success: function (result) {
        var data = $.parseJSON(result);
        if (data.success === true) {
          $ratingCount
            .html(data.likes)
            .attr('title', data.likes + ' ' + WDK_WP.textLikes);
          if (data.likes < 0) {
            $ratingCount
              .removeClass()
              .addClass('wdk-rating-count wdk-rating-negative');
          } else if (data.likes > 0) {
            $ratingCount
              .removeClass()
              .addClass('wdk-rating-count wdk-rating-positive');
          } else {
            $ratingCount
              .removeClass()
              .addClass('wdk-rating-count wdk-rating-neutral');
          }
        } else {
          $ratingCount.html($currentLikes);
        }
      },
      error: function (xhr) {
        $ratingCount.html($currentLikes);
      },
      complete: function (data) {
        $ratingCount.removeClass('lfo-loading');
      }, //end success
    }); //end jQuery.ajax
  }

  function clog(msg) {
    console.log(msg);
  }

  function cc(msg, msg2) {
    console.log(msg, msg2);
  }

  // show and hide note
  $(document).delegate('a.wdk_note_button', 'click', function (e) {
    e.preventDefault();
    var note_area = $(this)
      .closest('.wdk-select-attending')
      .find('.wdk_note_texarea');
    note_area.toggleClass('active');
  });
}); //end ready

function gotoTop() {
  var elmnt = document.getElementById('wdk-box');
  elmnt.scrollTop = 0;
}

jQuery('document').ready(function () {
  jQuery('.wdk-container-comments li.comment').addClass('jp-show');
});
