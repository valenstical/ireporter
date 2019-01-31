/* eslint-disable no-param-reassign */

function Wigi(selector) {
  if (Array.isArray(selector)) {
    this.elements = selector;
  } else {
    this.elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
  }
  this.instance = this;

  /**
   * Gets or sets the value of a form element
   * @param {string} text - If the provided the text to set, else the the value is returned.
   */
  this.val = (text) => {
    let result = null;
    this.loop((element) => {
      if (typeof text !== 'undefined') {
        element.value = text;
      } else {
        result = element.value;
      }
    });
    return result || this.instance;
  };

  /**
   * Gets or sets the value of an html element
   * @param {string} text - If the provided the text to set, else the the value is returned.
   */
  this.html = (text) => {
    let result = null;
    this.loop((element) => {
      if (typeof text !== 'undefined') {
        element.innerHTML = text;
      } else {
        result = element.innerHTML;
      }
    });
    return result || this.instance;
  };
  /**
   * Add the class to the selected elements
   * @param {string} className - The class to add
   */
  this.addClass = (className) => {
    this.loop((element) => {
      element.className = element.className.split(className).join(' ').concat(` ${className}`);
    });
    return this.instance;
  };
  /**
   * Removes the class from the selected elements
   * @param {string} className - The class to remove
   */
  this.removeClass = (className) => {
    this.loop((element) => {
      element.className = element.className.split(className).join(' ');
    });
    return this.instance;
  };
  /**
   * Adds or Removes the class from the selected elements
   * @param {string} className - The class to add or remove
   */
  this.toggleClass = (className) => {
    this.loop((element) => {
      if (element.className.split(' ').indexOf(className) >= 0) {
        element.className = element.className.split(className).join(' ');
      } else {
        element.className = element.className.split(className).join(' ').concat(` ${className}`);
      }
    });
    return this.instance;
  };
  /**
   * Checks whether the first matching element has the given class
   * @param {string} className - The class name to check
   */
  this.hasClass = className => this.elements[0].className.split(' ').indexOf(className) >= 0;
  /**
   * Empty the value of a form element
   */
  this.clear = () => {
    this.val('');
    return this.instance;
  };
  /**
   * Removes all elements
   */
  this.empty = () => {
    this.html('');
    return this.instance;
  };

  /**
   * Sets or returns the attribute of the elements that match the selector
   * @param {string} attribute - The attribute name
   * @param {string} value - The new value
   */
  this.prop = (attribute, value) => {
    let result = null;
    this.loop((element) => {
      if (typeof value !== 'undefined') {
        const attr = document.createAttribute(attribute);
        attr.value = value;
        element.attributes.setNamedItem(attr);
      } else {
        const item = element.attributes.getNamedItem(attribute);
        result = item ? item.value : '';
      }
    });
    return value ? this.instance : result;
  };
  /**
   * Removes the attribute of the elements that match the selector
   * @param {string} attribute - The attribute name
   */
  this.removeProp = (attribute) => {
    this.loop((element) => {
      element.attributes.removeNamedItem(attribute);
    });
    return this.instance;
  };
  /**
   * Sets or removes the attribute of the elements that match the selector
   * @param {string} attribute - The attribute name
   * @param {string} value - The value of the attribute
   */
  this.toggleProp = (attribute, value) => {
    this.loop((element) => {
      if (element.attributes.getNamedItem(attribute)) {
        element.attributes.removeNamedItem(attribute);
      } else {
        const attr = document.createAttribute(attribute);
        attr.value = value;
        element.attributes.setNamedItem(attr);
      }
    });
    return this.instance;
  };
  /**
   * Helper function to loop through the nodelist
   * @param {function} callback - Function to execute for each iteration
   */
  this.loop = (callback) => {
    this.elements.forEach((current) => {
      callback(current);
    });
  };
  /**
   * Returns the immediate parent node of the first matched element
   */
  this.parent = () => {
    const parent = this.elements[0].parentNode;
    return new Wigi(parent);
  };

  /**
   * Serialize the values of all elements in the first matched form element
   */
  this.serialize = () => {
    const result = [];
    [...this.elements[0].elements].forEach((element) => {
      result.push(`${element.name}=${window.encodeURIComponent(element.value)}`);
    });
    return result.join('&');
  };
  /**
   * Scroll the page smoothly to the top of the page
   */
  this.scroll = () => {
    this.elements[0].scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    return this.instance;
  };

  /**
   * Scroll the page into the view of the first matched element
   */
  this.scrollToElement = (smooth = true) => {
    const rTop = this.elements[0].getBoundingClientRect().top;
    const sTop = document.documentElement.scrollTop || document.body.scrollTop;
    const eTop = rTop + sTop;
    window.scrollTo({
      behavior: smooth ? 'smooth' : 'auto',
      top: eTop - 70,
    });
    return this.instance;
  };
  /**
 * Adds or triggers the click event to the selected elements
 * @param {function} callback - The function to execute
 */
  this.click = (callback) => {
    this.loop((element) => {
      if (callback) {
        element.addEventListener('click', (e) => {
          callback(e);
        }, false);
      } else {
        element.dispatchEvent(new Event('click'));
      }
    });
    return this.instance;
  };

  /**
 * Adds or triggers the any event to the selected elements
 * @param {function} callback - The function to execute
 */
  this.on = (event, callback) => {
    this.loop((element) => {
      if (callback) {
        element.addEventListener(event, (e) => {
          callback(e);
        }, false);
      } else {
        element.dispatchEvent(new Event(event));
      }
    });
    return this.instance;
  };

  /**
   * Returns the next element of the first matched elements
   */
  this.next = () => new Wigi(this.elements[0].nextElementSibling);

  /**
   * Returns the previous element of the first matched elements
   */
  this.prev = () => new Wigi(this.elements[0].previousElementSibling);

  /**
   * Sets or retrieves the width including padding of the matched elements
   */
  this.width = (width) => {
    let result = null;
    this.loop((element) => {
      if (width) {
        element.style.width = `${width}px`;
      } else {
        result = element.offsetWidth;
      }
    });
    return result || this.instance;
  };

  /**
   * Sets or retrieves the height including padding of the matched elements
   */
  this.height = (height) => {
    let result = null;
    this.loop((element) => {
      if (height) {
        element.style.height = `${height}px`;
      } else {
        result = element.offsetHeight;
      }
    });
    return result || this.instance;
  };

  /**
   * Adds a new element to the end of each matched elements
   * @param {string} value - The html element to add
   */
  this.append = (value) => {
    this.loop((element) => {
      if (typeof value === 'string') {
        element.innerHTML = `${element.innerHTML}${value}`;
      } else {
        element.appendChild(value);
      }
    });
    return this.instance;
  };
  /**
   * Adds a new element to the start of each matched elements
   * @param {string} value - The html element to add
   */
  this.prepend = (value) => {
    this.loop((element) => {
      element.innerHTML = `${value}${element.innerHTML}`;
    });
    return this.instance;
  };
  /**
     * Returns the last child of the first matched element
     */
  this.lastChild = () => new Wigi(this.elements[0].lastElementChild);
  /**
     * Returns the first child of the first matched element
     */
  this.firstChild = () => new Wigi(this.elements[0].firstElementChild);
  /**
     * Returns the number of elements in the first matched element
     */
  this.childCount = () => this.elements[0].childElementCount;
  /**
     * Returns the number of matched elements
     */
  this.count = () => this.elements.length;
  /**
 * Creates a new Wigi element from the given string
 * @param {string} html - The html formated string
 */
  this.from = (html) => {
    const node = document.createElement('div');
    node.innerHTML = html;
    return new Wigi(node.firstElementChild);
  };

  /**
   * Returns the first child of the first matched element
   * @param {string} filter - The css selector
   */
  this.child = filter => new Wigi(this.elements[0].querySelector(filter));

  /**
   * Returns all children of the first matched element
   * @param {string} filter - The css selector
   */
  this.children = filter => new Wigi([...this.elements[0].querySelectorAll(filter || '*')]);

  this.forEach = (callback) => {
    this.loop((element) => {
      if (typeof callback === 'function') {
        callback(new Wigi(element));
      }
    });
    return this.instance;
  };

  this.remove = () => {
    this.loop((element) => {
      element.parentNode.removeChild(element);
    });
    return this.instance;
  };

  return this;
}

/**
 * Creates an instance of wigi object. Why did I choose that name? For fun.
 * @param {string, object} selector - Any valid css selector or DOM object
 */
function Select(selector) {
  return new Wigi(selector);
}
