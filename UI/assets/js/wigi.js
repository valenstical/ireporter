
function Wigi(selector) {
  this.elements = typeof selector === 'string' ? document.querySelectorAll(selector) : [selector];
  this.instance = this;

  /**
   * Gets or sets the value of a form element
   * @param {string} text - If the provided the text to set, else the the value is returned.
   */
  this.val = (text) => {
    let result = null;
    this.loop((element) => {
      if (typeof text === 'string') {
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
      if (typeof text === 'string') {
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
      if (typeof value === 'string') {
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
    return Wigi(parent);
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
   * Scroll the page into the view of the first matched element
   */
  this.scroll = () => {
    this.elements[0].scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
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
   * Returns the next element of the first matched element
   */
  this.next = () => Wigi(this.elements[0].nextElementSibling);

  /**
   * Returns the previous element of the first matched element
   */
  this.prev = () => Wigi(this.elements[0].previousElementSibling);
  return this;
}
