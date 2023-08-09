// Intéragir avec l'API -- AVIS CLIENT

export function ajoutListenersAvis() {

    const piecesElements = document.querySelectorAll(".fiches article button");
 
    for (let i = 0; i < piecesElements.length; i++) {
 
     piecesElements[i].addEventListener("click",async function (event) {
 
        const id = event.target.dataset.id;
        //Stock la réponse de l'API dans une constant en format JSON 
        const reponse = await fetch("http://localhost:8081/pieces/"+id+"/avis");
        const avis = await reponse.json();
        // Récuperer les éléments 
        const pieceElement = event.target.parentElement;

        //crée l'élément p 
        const avisElement = document.createElement("p");
        for(let i = 0;i<avis.length;i++){
            // Afficher les commentaire et les avis 
            avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire}<br>`;
        }
        //ratache à l'élement parents !
        pieceElement.appendChild(avisElement);
     });
    }
 }