let links = document.querySelectorAll('.linkMenu');
let state = {
  lastUrl : '',
  searching :false,
  isFirstTime: true,
  searchFor: '',
  createLoader: true
};

function handleError(err){
  console.dir(err);
}

function showModal(info){
  document.querySelector('.modalLayer').classList.remove('hide');
  document.querySelector('body').classList.add('modalShow');
}


function updateModal(myJson){
  const status = document.querySelector('.status');

  document.querySelector('.characterName').textContent = myJson.name;
  document.querySelector('.modalCharImg').setAttribute('src', myJson.image);
  status.textContent = myJson.status;
  document.querySelector('.species').textContent = myJson.species;
  status.classList.remove('alive', 'dead', 'unknown');
  (myJson.status === 'Alive') ? status.classList.add('alive') : (myJson.status === 'Dead') ? status.classList.add('dead') : status.classList.add('unknown');
  document.querySelector('.gender').textContent = myJson.gender;
  document.querySelector('.origin').textContent = myJson.origin.name;
  document.querySelector('.location').textContent = myJson.location.name;
  showModal();  
}

function createCards(myJson){
  if(state.searchFor === 'input'){
    document.querySelector('.bodyContainer').textContent = '';
    state.searchFor = '';
  }
  const cardElements = 5;
  myJson.results.forEach(item => {
    for(let i = 0; i < cardElements; i++){
      const div = document.createElement('div');
      const container = document.querySelector('.bodyContainer');
      switch(i){
        case 0:
          div.classList.add('card');
          div.setAttribute('data-charId', item.id);
          container.appendChild(div);
          break;
        case 1:
          div.classList.add('imgCard');
          div.style.backgroundImage = `url(${item.image})`;
          container.lastElementChild.appendChild(div);
          break;
        case 2:
          div.classList.add('nameContainer');
          container.lastElementChild.appendChild(div);
          break;
        case 3:
          div.classList.add('cardName');
          container.lastElementChild.querySelector('.nameContainer').appendChild(div);
          break;
        case 4:
          const span = document.createElement('span');
          const link = document.createElement('a');
          span.classList.add('nameChar');
          link.classList.add('details');
          span.textContent = item.name;
          link.textContent = 'View Details';
          link.addEventListener('click', function(){
            state.id = this.parentElement.parentElement.parentElement.getAttribute('data-charId');
            state.searching = true;
            state.searchFor = 'modal';
            console.log(state.id);
            apiCall(state);
          }, true)
          container.lastElementChild.querySelector('.cardName').appendChild(span);
          container.lastElementChild.querySelector('.cardName').appendChild(link);
          break;
      }
    }
  });
  state.lastUrl = myJson.info.next;
}

function removeLoader(){
  if(document.querySelector('.newElements')){
  let loader = document.querySelector('.newElements');
  loader.parentElement.removeChild(loader);
  }
}

function notFound(){
  let loading = document.querySelector('.newElements');
  document.querySelector('body').removeChild(loading);
  document.querySelector('.bodyContainer').textContent = '';
  document.querySelector('.bodyContainer').innerHTML = '<div><h3>oops... we can\'t find anything<h3></div>';
  state.searching=false;
  state.searchFor = '';
  state.lastUrl = '';
  debounce(()=>apiCall(state), 3000);

}

function apiCall(data){
  console.log(data);
let endpoint = 'https://rickandmortyapi.com/api/character/';
      // (data.searching || data.isFirstTime) ?
      // `https://rickandmortyapi.com/api/character/${data.searching ? data.id : ''}` : `${data.lastUrl}`;

    if(data.searching || data.isFirstTime){
     endpoint += (data.searching) ? data.searchFor === 'modal' ? data.id : `?name=${data.charName}` : '';
    }else{
      if(data.lastUrl === null){
        removeLoader();
        alert('That\'s all');
        return;
      }
      endpoint = data.lastUrl;
    }
 fetch(endpoint)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
    if(data.searchFor === 'modal'){
      updateModal(myJson);
    }else if(myJson.error){
        notFound();
    }else{
      createCards(myJson);
    }
   if(data.isFirstTime) createLoader();
  })
  .catch(handleError);
}

function createLoader(){
  const html = '<div class="newElements"></div>';
  const container = document.querySelector('.bodyContainer');
  container.insertAdjacentHTML('afterend', html);

  const loadMore = (entries) => {
    console.log(entries);
    if(entries[0].isIntersecting){
      state.searching = false;
      apiCall(state);
    }
  }
  const options = {
    // root:,
    rootMargin:'200px',
    threshold: 0.1
  };
  const obs = new IntersectionObserver(loadMore, options);
  obs.observe(document.querySelector('.newElements'));
  state.isFirstTime = false;
}



links.forEach(link => link.addEventListener('click', function(e){
  e.preventDefault();
  const container = document.querySelector('.bodyContainer');
  container.innerHTML= '';
  appiCall(state);
  }));

  

document.addEventListener('DOMContentLoaded', () => {
  apiCall(state);
});

document.querySelector('.closeBtn').addEventListener('click', (e)=>{
  e.preventDefault();
  document.querySelector('.modalLayer').classList.add('hide')
  document.querySelector('body').classList.remove('modalShow');
});

document.querySelector('.searchLabel').addEventListener('click', function(e){
  e.currentTarget.classList.add('hiding');
  document.querySelector('.searchText').classList.remove('hiding');
  document.querySelector('.closeInput').classList.remove('hiding');
});

document.querySelector('.closeInput').addEventListener('click', function(e){
  e.currentTarget.classList.add('hiding');
  document.querySelector('.searchText').classList.add('hiding');
  document.querySelector('.searchLabel').classList.remove('hiding');
});

function debounce(func, time){
  let wait;
  return function(...args){
    const context = this;
    clearTimeout(wait);
    console.log(wait);
    wait = setTimeout(() => func.apply(context, args), time);
    console.log(wait);

  } 
}

let searchFromInput = debounce(function(){
  console.log('entre');
  state.searchFor = 'input';
  state.searching = true;
  state.lastUrl = '';
  state.charName = document.querySelector('.searchText').value;
  apiCall(state);
}, 1200);

document.querySelector('.searchText').addEventListener('keyup', (e)=>{
  console.log(document.querySelector('.searchText').value.length);
  if(document.querySelector('.searchText').value.length >= 3){
    searchFromInput();
  }else if(document.querySelector('.searchText').value.length == 0 && e.key === 'Backspace' || e.key === 'Delete'){
    console.log('empty input');
    state.searching=false;
    state.searchFor = '';
    state.lastUrl = '';
    state.charName ='';
    state.isFirstTime = true;
    document.querySelector('.bodyContainer').textContent = '';
    removeLoader();
    apiCall(state);
  }
});
