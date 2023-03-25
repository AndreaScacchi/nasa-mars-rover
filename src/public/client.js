// Main data storage object, uses Immutable for the rover list
let store = {
    pickedRover: '',
    data: '',
    rovers: Immutable.List(['Spirit', 'Opportunity', 'Curiosity'])
};


// add our markup to the page
const root = document.getElementById('root');

const updateStore = (newState) => {
    store = Object.assign(store, newState);
    render(root, store);
};

const render = async (root, state) => {
    if (state !== null) {
        root.innerHTML = App(state);
    }
};


// create content
const App = (state) => {

    return `
        <header>
            <h1>Mars Rovers</h1>
        </header>
        <main>
            <section>
                ${RoverData(state)}
            </section>
        </main>
        <div class="para">
            <p>Project created by: Andrea Scacchi</p>
        </div>
    `
};

window.addEventListener('load', () => {
    render(root, store)
});


/* Shwo the data of the rovers */
const RoverData = (state) => {

    // If no rover is selected in state, create the rover card HTML with 
    // wrapInDivFunction and return
    if (!state.pickedRover) {
        return (`
            ${roverContainerFunction(state, 'rover-container', connectDataFunction,
            state.rovers, roverCardFunction)}
        `)
    };

     // If a rover is selected but there's no data yet, call the API with
    // getRoverData and return
    // getRoverData will call the updateStore function, which calls this
    // function again, so returning immediately after prevents errors in
    // console with undefined data
    if (!state.data) {
        getRoverData(state);
        return '';
    };

    // Array of photos from the rover
    let photos;
    if (state.pickedRover === 'Curiosity') {
        photos = state.data.results.latest_photos;
    } else {
        photos = state.data.results.photos;
    };

    // All photos will be from the same date, so use photo[0]
    const photoDate = photos[0].earth_date;

    // Map the photo array to get the URLs of the photos
    const photoURL = photos.map(photo => photo.img_src);

    // Get the required mission data
    const { name, launch_date, landing_date, status } = photos[0].rover;

     // Makes the information HTML and calls wrapInDivFunction to start the
    // production of the photo array
    return (`
        <ul class="information-container">
            <li>Rover name: ${name}</li>
            <li>Launched from Earth on: ${launch_date}</li>
            <li>Landed on Mars on: ${landing_date}</li>
            <li>Mission status: ${status}</li>
            <li>Photos taken on: ${photoDate}</li>
        </ul>
        <button onclick="updateStore({pickedRover: '', data: ''})" class="button">Back</button>
        ${roverContainerFunction(state, 'photo-container', connectDataFunction, photoURL, photoFunction)}
        <button onclick="updateStore({pickedRover: '', data: ''})" class="button">Back</button>
    `)
};


/* Higher order functions */
const roverContainerFunction = (state, divClass, dataFunction, marsData, elementFunction) => {
    return (`
    <div class="${divClass}">
        ${dataFunction(state, marsData, elementFunction)}
    </div >
    `);
};

const connectDataFunction = (state, marsData, elementFunction) => {
    return (`
        ${marsData.map(x => elementFunction(state, x)).join('')}
    `);
};

const roverCardFunction = (state, rover) => {
    return (`
    <button class="rover-card"
    onclick="setTimeout(updateStore, 3000, {pickedRover: '${rover}'})">
    <h2 class="card-title">${rover}</h2>
    </button>
    `);
};

const photoFunction = (state, url) => {
    return (`
    <img class="photo" src="${url}" alt="Photos taken on Mars by 
    ${state.pickedRover}"/>
    `);
};


/* Api call */
const getRoverData = (state) => {
    const { pickedRover } = state

    fetch(`/${pickedRover}`)
        .then(res => res.json())
        .then(data => updateStore({ data }))
};


/* Build the navbar */
const navbarFunction = () => {
    let nav = document.getElementById('myLinks');
    if (nav.style.display === 'block') {
        nav.style.display = 'none';
    } else {
        nav.style.display = 'block';
    }
};