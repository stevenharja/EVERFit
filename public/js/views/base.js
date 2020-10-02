export const elements = {
  navbar: document.querySelector('.header-alt'),
  body: document.querySelector('body'),
  popup: document.querySelector('.popup'),
  popupContent: document.querySelector('.popup__content'),
  activityItems: Array.from(document.querySelectorAll('.activity-item')),
  loginForm: document.getElementById('login'),
  signupForm: document.getElementById('signup'),
  logOutBtn: document.getElementById('logout'),
  userDataForm: document.querySelector('.form-user-data'),
  userPasswordForm: document.querySelector('.form-password'),
  dropdownBoxes: Array.from(document.querySelectorAll('.dropdown-box')),
  editModelForm: document.getElementById('form-edit'),
};

export const popup = {
  box: document.querySelector('.popup__box'),
  content: document.querySelector('.popup__content'),
  rightButton: document.querySelector('.popup__button--right'),
  leftButton: document.querySelector('.popup__button--left'),
  closeButton: document.querySelector('.popup__button--close'),
};

export const formElement = {
  name: document.getElementById('name'),
  summary: document.getElementById('summary'),
  category: document.getElementById('category'),
  imageCover: document.getElementById('imageCover'),
  description: document.getElementById('description'),
};

export const elementStrings = {
  loader: 'loader',
};

export const renderLoader = (parent, beginAt = 'afterbegin') => {
  const loader = `
      <div class="${elementStrings.loader}">
          <svg>
              <use xlink:href="img/sprite.svg#icon-refresh"></use>
          </svg>
      </div>
  `;
  parent.insertAdjacentHTML(beginAt, loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
};
