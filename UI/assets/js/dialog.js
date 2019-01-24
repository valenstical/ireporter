function closeNotification(element, callback) {
  const parent = Select(element).parent();
  parent.addClass('dialog-hidden');
  if (Select('.dialog-parent .dialog-hidden').count() === Select('.dialog-parent').childCount()) {
    Select('.dialog-parent').empty();
  }
  setTimeout(() => {
    if (typeof callback === 'function') {
      callback();
    }
  }, 300);
}
function closePop(callback) {
  Select('.pop .pop-inner').removeClass('pop-showing');
  setTimeout(() => {
    Select('body').removeClass('pop-shown');
    if (typeof callback === 'function') {
      callback();
    }
  }, 250);
}

function Notification(text, danger, callback) {
  this.element = null;
  this.parent = Select('.dialog-parent');
  this.callback = callback;
  this.text = text;
  this.danger = danger;
  this.id = `d${new Date().getTime()}`;
  Select('.dialog-parent .dialog-hidden').addClass('hidden');
  this.show = () => {
    this.parent.append(`
    <div id = "${this.id}" class="dialog dialog-hidden${this.danger ? '' : ' dialog success'}">
      <a onclick ="closeNotification(this)" class="close">&times;</a>
      <p>${this.text}</p>
    </div>`);
    setTimeout(() => {
      Select(`#${this.id}`).removeClass('dialog-hidden');
    }, 200);
    setTimeout(() => {
      closeNotification(`#${this.id} a.close`, callback);
    }, 5000);
  };
}

class Pop {
  constructor(data) {
    this.title = data.title || '';
    this.message = data.message || '';
    this.type = data.type || 'info';
    this.negetiveButton = data.negetiveButton;
    this.negetiveButtonText = data.negetiveButtonText || 'Cancel';
    this.postiveButtonText = data.postiveButtonText || 'Ok';
    this.disposable = data.disposable;
    this.onsuccess = data.onsuccess;
    this.oncancel = data.oncancel;
    this.ondisposed = data.ondisposed;
    switch (this.type) {
      case 'question':
        this.icon = 'fa-question-circle-o';
        break;
      case 'success':
        this.icon = 'fa-check';
        break;
      case 'error':
        this.icon = 'fa-times-circle-o';
        break;
      default:
        this.icon = 'fa-info-circle';
    }
    if (Array.isArray(this.message)) {
      this.message = '';
      data.message.forEach((item) => {
        this.message = `${this.message}
      <li>
        <i class="fa fa-li fa-remove"></i>
        <span>${item}</span>
      </li>`;
      });
      this.message = `<ul class="fa-ul">${this.message}</ul>`;
    }
    this.disposeAction = this.disposable ? `onclick="closePop(${this.ondisposed})"` : '';
    this.template = `
    <div class="pop-backdrop" ${this.disposeAction}></div>
    <div class="pop-inner ${this.type}">
      <div class="pop-circle"></div>
      <i class="fa ${this.icon}"></i>
      <h2 class="pop-title">${this.title}</h2>
      <p class="pop-text">${this.message}</p>
      <div class="pop-footer">
        <button onclick ="closePop(${this.oncancel})" class="btn-brand btn-secondary${this.negetiveButton ? '' : ' hidden'}">${this.negetiveButtonText}</button>
        <button class="btn-brand" onclick ="closePop(${this.onsuccess})">${this.postiveButtonText}</button>
      </div>
  </div>`;
  }

  show() {
    Select('.pop').html(this.template);
    Select('body').addClass('pop-shown');
    setTimeout(() => {
      Select('.pop .pop-inner').addClass('pop-showing');
    }, 100);
  }
}

class Dialog {
  static init() {
    Select('body').append(`
    <aside class="dialog-parent"></aside>
    <aside class="pop"></aside>
    `);
  }

  static showNotification(text, success = true, callback) {
    const notification = new Notification(text, success, callback);
    notification.show();
  }

  static showMessageDialog(title, message, type = 'info', disposable = true, postiveButtonText = 'Ok', onsuccess = null) {
    const pop = new Pop({
      title, message, disposable, type, postiveButtonText, onsuccess,
    });
    pop.show();
  }

  static showConfirmDialog(title, message, onsuccess, type = 'question', disposable = true) {
    const pop = new Pop({
      title,
      message,
      disposable,
      type,
      negetiveButton: true,
      negetiveButtonText: 'Cancel',
      postiveButtonText: 'Yes',
      onsuccess,
    });
    pop.show();
  }

  static showDialog(data) {
    new Pop(data).show();
  }
}

Dialog.init();
