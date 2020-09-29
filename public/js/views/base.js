export const elements = {
  navbar: document.querySelector('.header-alt'),
  body: document.querySelector('body'),
  popup: document.querySelector('.popup'),
  popupContent: document.querySelector('.popup__content'),
  activityItems: Array.from(document.querySelectorAll('.activity-item')),
  loginForm: document.querySelector('.login'),
  logOutBtn: document.getElementById('logout'),
  userDataForm: document.querySelector('.form-user-data'),
  userPasswordForm: document.querySelector('.form-password'),
};

export const popup = {
  box: document.querySelector('.popup__box'),
  content: document.querySelector('.popup__content'),
  rightButton: document.querySelector('.popup__button--right'),
  leftButton: document.querySelector('.popup__button--left'),
  closeButton: document.querySelector('.popup__button--close'),
};

export const elementStrings = {
  loader: 'loader',
};

export const renderLoader = (parent) => {
  const loader = `
      <div class="${elementStrings.loader}">
          <svg>
              <use xlink:href="img/sprite.svg#icon-refresh"></use>
          </svg>
      </div>
  `;
  parent.insertAdjacentHTML('afterbegin', loader);
};

export const clearLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
};
