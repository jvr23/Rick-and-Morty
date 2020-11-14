let state = {
  lastUrl : '',
  searching :false,
  isFirstTime: true,
  urlSearch:''
};

function handleError(err){
  console.log(err);
}

function showModal(info){
  document.querySelector('.modalLayer').classList.remove('hide');
    document.querySelector('body').classList.add('modalShow');
    // state.id = this.parentElement.parentElement.parentElement.getAttribute('data-charId');
    // state.searching = true;
    // console.log(state.id);
    // document.querySelector('.modalLayer').classList.remove('hide');
    // document.querySelector('body').classList.add('modalShow');
}

function apiCall(data){
  // const endpoint = 
  // console.log(endpoint);
  if(data.lastUrl === null){
    alert('That\'s all');
  }

 fetch((data.searching || data.isFirstTime) ? `https://rickandmortyapi.com/api/character/${data.searching ? data.id : ''}` : `${data.lastUrl}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
    if(data.searching){
      console.log(data);
      let imgEl =  document.querySelector('.modalCharImg');
      document.querySelector('.characterName').textContent = myJson.name;
      imgEl.setAttribute('src', myJson.image);
      document.querySelector('.status').textContent = myJson.status;
      document.querySelector('.species').textContent = myJson.species;
      document.querySelector('.status').classList.remove('alive', 'dead', 'unknown');
      (myJson.status === 'Alive') ? document.querySelector('.status').classList.add('alive') : (myJson.status === 'Dead') ? document.querySelector('.status').classList.add('dead') : document.querySelector('.status').classList.add('unknown');
      document.querySelector('.gender').textContent = myJson.gender;
      document.querySelector('.origin').textContent = myJson.origin.name;
      document.querySelector('.location').textContent = myJson.location.name;
      showModal();
    }else{
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
    if(data.isFirstTime) createLoader();
  }
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

let links = document.querySelectorAll('.linkMenu');

links.forEach(link => link.addEventListener('click', function(e){
  e.preventDefault();
  const container = document.querySelector('.bodyContainer');
  container.innerHTML= '';
  state.lastUrl = '';
  state.searching = e.currentTarget.dataset.search;
  appiCall(state);
  }));

  

document.addEventListener('DOMContentLoaded', () => {
  apiCall(state);
  // createLoader();
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