function toggleSearchbox() {

  const togglebutton = document.getElementById('toggleSearchbar');
  const searchBar = document.getElementById('searchBar');
  const hideSearchbar = document.getElementById('hideSearchbar');
  const sideBar = document.getElementById('sideBar');

  togglebutton.addEventListener('click', function () {
    searchBar.style.top = '10px';
    searchBar.style.opacity = '1';
    searchBar.style.zIndex = '2000';
    togglebutton.style.position = 'absolute';
    togglebutton.style.top = '100%';
    togglebutton.style.zIndex = '-10';
    sideBar.style.paddingTop = '0px';
    sideBar.style.marginTop = '55px';
  });

  hideSearchbar.addEventListener('click', function () {
    searchBar.style.top = '-70px';
    searchBar.style.opacity = '0';
    searchBar.style.zIndex = '-10';
    togglebutton.style.position = 'static';
    togglebutton.style.top = 'unset';
    togglebutton.style.zIndex = '1';
    sideBar.style.paddingTop = '60px';
    sideBar.style.marginTop = '0px';
  });

}
toggleSearchbox();

document.addEventListener('DOMContentLoaded', function () {
  let sidebar = document.getElementById('sideBar');
  let toggleSidebar = document.getElementById('toggleSideBar');
  let mainContent = document.getElementById('sideBar');

  let startX;

  document.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
  });

  document.addEventListener('touchmove', function (e) {
    let touch = e.touches[0];
    let change = touch.clientX - startX;

    if (change < -50) { // Swipe right
      sidebar.classList.add('active');
      toggleSidebar.classList.add('active');

    } else if (change > 50) { // Swipe left
      sidebar.classList.remove('active');
      toggleSidebar.classList.remove('active');
    }
  });
});

function resizeContent() {
  let sidebar = document.getElementById('sideBar');
  let toggleSidebar = document.getElementById('toggleSideBar');
  let mainContent = document.getElementById('sideBar');
  let content = document.getElementById('content');
  let bottomContainer = document.getElementById('bottomContainer');
  let footer = document.getElementById('footer');
  let savedCities = document.querySelector('.main-saved-cities-container');

  let startX;

  document.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
  });

  document.addEventListener('touchmove', function (e) {
    let touch = e.touches[0];
    let change = touch.clientX - startX;

    if (change < -50) { // Swipe right
      sidebar.classList.add('active');
      toggleSidebar.classList.add('active');
      content.classList.add('active');
      bottomContainer.classList.add('active');
      footer.classList.add('active');
      savedCities.style.left = '-310px';
    } else if (change > 50) { // Swipe left
      sidebar.classList.remove('active');
      toggleSidebar.classList.remove('active');
      content.classList.remove('active');
      bottomContainer.classList.remove('active');
      footer.classList.remove('active');
    }
  });
}
resizeContent();

window.addEventListener('scroll', function () {
  const header = document.querySelector('header');
  let sidebar = document.getElementById('sideBar');
  let toggleSidebar = document.getElementById('toggleSideBar');
  let mainContent = document.getElementById('sideBar');
  let content = document.getElementById('content');
  let bottomContainer = document.getElementById('bottomContainer');
  let savedCities = document.querySelector('.main-saved-cities-container');
  let footer = document.getElementById('footer');

  if (window.scrollY > 20) {
    sidebar.classList.add('active');
    toggleSidebar.classList.add('active');
    sidebar.classList.add('active');
    toggleSidebar.classList.add('active');
    content.classList.add('active');
    bottomContainer.classList.add('active');
    footer.classList.add('active');
  } else {
    sidebar.classList.remove('active');
    toggleSidebar.classList.remove('active');
    sidebar.classList.remove('active');
    toggleSidebar.classList.remove('active');
    content.classList.remove('active');
    bottomContainer.classList.remove('active');
    footer.classList.remove('active');
  }

  if (window.matchMedia('(max-width: 768px)').matches) {
    savedCities.style.left = '-310px';
  }
});






function showSavedCities() {
  const savedCitiesContainer = document.querySelector('.main-saved-cities-container');
  const showSavedCitiesButton = document.getElementById('viewSavedCitiesButton');

  showSavedCitiesButton.addEventListener('click', function () {
    savedCitiesContainer.style.left = '0px';
  })

}
showSavedCities();

function hideSavedCities() {
  const savedCitiesContainer = document.querySelector('.main-saved-cities-container');
  const hideSavedCitiesButton = document.getElementById('hideSavedCitiesButton');

  hideSavedCitiesButton.addEventListener('click', function () {
    savedCitiesContainer.style.left = '-310px';
  })

}
hideSavedCities();
