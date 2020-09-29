/* eslint-disable */
import '@babel/polyfill';
import { elements, popup, renderLoader, clearLoader } from './views/base.js';
import { login, logout } from './login';
import { changeProfile } from './changeProfile';

//////BACK END/////////
if (elements.loginForm) {
  elements.loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (elements.logOutBtn) {
  elements.logOutBtn.addEventListener('click', logout);
}

if (elements.userDataForm) {
  elements.userDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('user-name').value);
    form.append('email', document.getElementById('user-email').value);
    form.append('photo', document.getElementById('photo').files[0]);
    changeProfile(form, 'data');
  });
}

if (elements.userPasswordForm) {
  elements.userPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    // document.querySelector('.btn-password').textContent = 'Updating...';
    const passwordCurrent = document.getElementById('current-password').value;
    const password = document.getElementById('new-password').value;
    const passwordConfirm = document.getElementById('confirm-password').value;
    await changeProfile(
      { passwordCurrent, password, passwordConfirm },
      'password'
    );
    // document.querySelector('.btn-password').textContent = 'Change Password';
    document.getElementById('current-password').value = '';
    document.getElementById('new-password').value = '';
    document.getElementById('confirm-password').value = '';
  });
}

//////FRONT END////////

if (elements.navbar) {
  // When the user scrolls the page, execute myFunction
  window.onscroll = function () {
    stickyHeader();
  };

  // Get the offset position of the navbar
  const sticky = elements.navbar.offsetTop;

  // Add the sticky class to the navbar when you reach its scroll position. Remove "sticky" when you leave the scroll position
  const stickyHeader = () => {
    if (window.pageYOffset >= sticky) {
      elements.navbar.classList.add('sticky');
    } else {
      elements.navbar.classList.remove('sticky');
    }
  };
}

window.addEventListener('click', (e) => {
  if (
    e.target === elements.popup ||
    e.target.closest('.popup__button--close')
  ) {
    elements.popup.style.display = 'none';
    elements.body.classList.toggle('show-popup');
    popup.content.innerHTML = '';
  }
});

if (elements.activityItems.length > 0) {
  console.log('There is activity item here.');
  const modifyPopup = (data) => {
    // renderLoader(popup.box);
    popup.content.innerHTML = '';
    const imageMarkup = `<img src="${data[0].src}" alt="${data[0].alt}" class="popup__media" />`;
    const textMarkup = `<div class="popup__text">
                          <div class="popup__title">${data[1].innerText}</div>
                          <div class="popup__summary">${data[2].innerText}</div>
                        </div>`;
    const descriptionMarkup = `<div class="popup__description">
    Lorem ipsum dolor sit amet consectetur adipisicing elit. Porro vel
    eius, saepe necessitatibus dolor atque doloribus corporis voluptatem
    neque in? Lorem ipsum dolor sit amet consectetur adipisicing elit.
    Cupiditate repellat aut atque ad aliquam quaerat rem facilis minima
    eligendi fugit, explicabo officia voluptates eveniet dolorem
    obcaecati soluta. Dolore molestias animi quis quia, est temporibus
    quam beatae harum placeat magni ipsa. </div>`;
    const fullMarkup = `${imageMarkup} ${textMarkup} ${descriptionMarkup}`;
    popup.content.insertAdjacentHTML('afterbegin', fullMarkup);

    // clearLoader();
  };

  const showContent = (n) => {
    return () => {
      modifyPopup(elements.activityItems[n].children);
      //If it is at the start of the array.
      if (n == 0) {
        popup.leftButton.style.display = 'none';
      } else {
        popup.leftButton.style.display = 'block';
        popup.leftButton.onclick = showContent(n - 1);
      }

      //If it is at the end of array.
      if (n >= elements.activityItems.length - 1) {
        popup.rightButton.style.display = 'none';
      } else {
        popup.rightButton.style.display = 'block';
        popup.rightButton.onclick = showContent(n + 1);
      }
    };
  };

  elements.activityItems.forEach((item, index) => {
    item.dataset.id = index;
    item.addEventListener('click', () => {
      elements.popup.style.display = 'block';
      elements.body.classList.toggle('show-popup');
      showContent(index)();
    });
  });
}
