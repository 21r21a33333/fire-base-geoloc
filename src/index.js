import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, onSnapshot,getDocs,
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  updateDoc,GeoPoint
} from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBYCa1xNYXrWhLZ7K0Ccu8HVgi5hK3OD0Q",
    authDomain: "fire-tut-pro.firebaseapp.com",
    projectId: "fire-tut-pro",
    storageBucket: "fire-tut-pro.appspot.com",
    messagingSenderId: "474222794382",
    appId: "1:474222794382:web:63a6ba934c66d1f72cdbdf"
  };

// init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()

// collection ref
const colRef = collection(db, 'drivers')

// queries
//const q = query(colRef, where("driver_name", "==", "driver1"))

// realtime collection data
onSnapshot(colRef, (snapshot) =>{
  let drivers = []
  snapshot.docs.forEach(doc => {
    drivers.push({ ...doc.data(), id: doc.id })
  })
  console.log(drivers)
})

// adding docs
let busno;
const addBookForm = document.querySelector('.add')
addBookForm.addEventListener('submit', (e) => {
  e.preventDefault()
  let lat,lng;
  if (navigator.geolocation) {
     navigator.geolocation.getCurrentPosition((position)=> {
        lat=Number(position.coords.latitude);
        lng=Number(position.coords.longitude);
        console.log(
            `latitiue=${lat} ,
            longitude=${lng}`
        ) 
        busno=addBookForm.busnumber.value;
        addDoc(colRef, {
            busno:  addBookForm.busnumber.value,
            driver_name: addBookForm. drivername.value,
            driver_ph_no: addBookForm. phno.value,
            location:new GeoPoint(lat, lng),
          })
          .then(() => {
              sharelocation(busno);
              addBookForm.reset()
          })
      });
  } else { 
    console.log("Geolocation is not supported by this browser.");
  }  
})


// share location
function sharelocation(busno){
    console.log("here")
    const q = query(colRef, where("busno", "==", busno));
    console.log("complete")
    let id;
    getDocs(q)
    .then(snapshot => {
        snapshot.docs.forEach(doc => {
            id=doc.id;
            todo(id);
        })
  }) 
  .catch(err => {
    console.log(err.message)
  })
  
    
}

function todo(id){
    let docRef = doc(db, 'drivers', id)
    setInterval(function () {
        let lat,lng;
        navigator.geolocation.getCurrentPosition((position)=> {
            lat=Number(position.coords.latitude);
            lng=Number(position.coords.longitude);
            console.log(
                "updated coord "+
                `latitiue=${lat} ,
                longitude=${lng}`
            ) 
            updateDoc(docRef, {
                location:new GeoPoint(lat, lng)
            })
            .then(() => {
                console.log("updated");
            })
        });
        
            
    }, 30000);
}