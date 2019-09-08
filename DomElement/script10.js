document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    const DomElement = function(selector, height, width, bg, fontSize) {
        this.selector = selector;
        this.height = height;
        this.width = width;
        this.bg = bg;
        this.fontSize = fontSize;
    };
    DomElement.prototype.createEl = function() {
        let firstChar = this.selector.charAt(0);
        let newElem = '';
        if (firstChar === '.') {
            newElem = document.createElement('div');
        } else {
            newElem = document.createElement('p');
        }
        newElem.style.cssText= "height: " + this.height + ";" + "width: " + this.width + ";" + "background-color: " + this.bg + ";" + "font-size: " + this.fontSize + ";";
        newElem.textContent = 'Привет, я новый элемент!';
        let script = document.querySelector('script[src="script10.js"]');
        document.querySelector('body').insertBefore(newElem, script);
    };
    const elem = new DomElement('.div', '100px', '100px', 'yellow', '14px');
    elem.createEl();
    let newElemPage = document.querySelector('body').children[0];
    newElemPage.style.cssText += "position: absolute;";
    let x = 0;
    let y = 0;
    document.addEventListener('keydown', function(e){
        if (e.keyCode > 36 && e.keyCode < 41) {            
          switch(e.keyCode) {
            case 37:          
                x -= 10;
                newElemPage.style.left = x + 'px'; // влево
                break;
            case 38:
                y -= 10;
                newElemPage.style.top = y + 'px';// вверх
                break;
            case 39:
                x += 10;
                newElemPage.style.left = x + 'px';//вправо
                break;
            case 40:
                y += 10;
                newElemPage.style.top = y + 'px';//вниз
                break;
          }

        } 
    });
       
});