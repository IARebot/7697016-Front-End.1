// Intéragir avec l'API -- AVIS CLIENT
/* global Chart */
export function ajoutListenersAvis() {

    const piecesElements = document.querySelectorAll(".fiches article button");
 
    for (let i = 0; i < piecesElements.length; i++) {
 
    piecesElements[i].addEventListener("click",async function (event) {
 
        const id = event.target.dataset.id;
        //Stock la réponse de l'API dans une constant en format JSON 
        const reponse = await fetch("http://localhost:8081/pieces/"+id+"/avis");
        const avis = await reponse.json();
        window.localStorage.setItem(`avis-piece-${id}`,JSON.stringify(avis))
        // Récuperer les éléments 
        const pieceElement = event.target.parentElement;
        afficherAvis(pieceElement,avis)
    });
    }
}
//--------------------------------------------------
export function afficherAvis(pieceElement,avis){
    //crée l'élément p - paragraphe des avis
    const avisElement = document.createElement("p");
        for(let i = 0;i<avis.length;i++){
            // Afficher les commentaire et les avis 
            avisElement.innerHTML += `<b>${avis[i].utilisateur}:</b> ${avis[i].commentaire}<br>`;
            }
            //ratache à l'élement parents !
            pieceElement.appendChild(avisElement);

}
//--------------------------------------------------
export function ajoutListenerEnvoyerAvis(){
    const formulaireAvis = document.querySelector('.formulaire-avis');
    formulaireAvis.addEventListener("submit",function(event){
    //Bloquer l'évent normal du navigateur:
    event.preventDefault();
    //Charge utile avec les 3 propriétés
    const avis = {    
        pieceId: parseInt(event.target.querySelector("[name=piece-id]").value),
        utilisateur: event.target.querySelector("[name=utilisateur]").value,
        commentaire: event.target.querySelector("[name=commentaire]").value,
        nbEtoiles: parseInt(event.target.querySelector("[name=nbEtoiles]").value)
    };
    // Création de la charge utilse au format JSON:
    const chargeUtile = JSON.stringify(avis);
    // Appel de la fonction fetch avec toutes les infos nécessaires
    fetch("http://localhost:8081/avis",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: chargeUtile
    }); 
    });
}
//--------------------------------------------------------------------
export async function afficherGraphiqueAvis(){
    // Calcule du nombre total de commentaire par quantité d'étoiles attribués
    const avis = await fetch("http://localhost:8081/avis").then(avis => avis.json());
    // Tableau de 5 éléments initialisé à zero
    const nb_commentaires = [0,0,0,0,0];
    // Parcourir la liste des commentaites :
    for (let commentaire of avis){
        // -1 car le comptage commence à ZERO
        nb_commentaires[commentaire.nbEtoiles -1]++ ;
        }
    // Légende qui s'affichera sur la gauche à côté de la barre horizontale
    const labels = ["5","4","3","2","1"];
    //Données et personalisation du graphique
    const data = {
        labels:labels,
        datasets:[{
            label:"Etoiles attribuées",
            data:nb_commentaires.reverse(), // d'abord afficher le commentaire à 5 étoils -> 4 3 2 etc..
            backgroundColor:"rgba(255,230, 0, 1)", // couleur jaune
        }],
    };
    // Object de configuration finale:
    const config = {
        type:'bar',
        data:data,
        options:{
            indexAxis:"y",
            },
        };
    // Rendu du graphique dans l'élément canvas
    new Chart(
        document.querySelector("#graphique-avis"),
        config,
    );
    // Récupération des piéces depuis le localStorage
    const pieceJSON = window.localStorage.getItem("pieces");
    const pieces = JSON.parse(pieceJSON)
    // Calcul du nombre de commentaires
    let compteurCommentaire=0;
    let compteurNonCom =0;

    for (let i = 0;i<avis.length;i++){
        const piece = pieces.find(p => p.id === avis[i].pieceId);

        if(piece){
            if (piece.disponibilite){
                compteurCommentaire++;
            }else{
                compteurNonCom ++;
            }
        }
    }
    //Légende qui s'affichera sur la gauche à côté de la barre horizontale
    const labelDispo = ["Disponibles","Non dispo"];

    // Données et personnalisation du graphique
    const dataDispo = {
        labels :labelDispo,
        datasets:[{
            label:"Nombre de commentaires",
            data:[compteurCommentaire,compteurNonCom],//nombre de commentaires
            backgroundColor:"rgba(0,230,255,1)", // turquoise
        }],
    };
    // Object de configuration finale:
    const configDispo = {
        type:'bar',
        data:dataDispo};
    console.log(dataDispo);
    //Rendu graphique dans l'élément canvaS
    new Chart(
        document.querySelector("#graphique-dispo"),
        configDispo,
    );
}
