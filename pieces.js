import { ajoutListenersAvis,ajoutListenerEnvoyerAvis,afficherAvis,afficherGraphiqueAvis} from "./avis.js";
let pieces = window.localStorage.getItem('pieces');

if(pieces === null){
    // Récuperer des pièces depuis le fichier depuis le fichier JSON
    const reponse = await fetch("http://localhost:8081/pieces/");
    const pieces = await reponse.json();
    // Transformation des pièces en JSON:
    const valeurPieces = JSON.stringify(pieces);
    // Stockage des informations dans le localStorage
    window.localStorage.setItem('pieces',valeurPieces);
}else{
    pieces =JSON.parse(pieces);
}    
// Appel de la fonction pour ajouter le listener au formulaire:
ajoutListenerEnvoyerAvis()


// AFFICHER TOUT LES PIECES
function genererPieces(pieces){ 
    for (let i = 0;i<pieces.length;i++){
        //Creation de balise avec createElement:
        const article =pieces[i];
        //element "img":
        //récupération de l'élement du DOM qui accueillera les fiches:
        const sectionFiches = document.querySelector(".fiches");

        //Création d'une balise dédiée à une pièce automobile:
        const pieceElement = document.createElement("article");
        // Création des balise : img|h2|p
        const imageElement = document.createElement("img");
        imageElement.src = article.image;
        //element h2:
        const nomElement = document.createElement("h2");
        nomElement.innerText = article.nom;
        //element prix :
        const prixElement=document.createElement("p");
        prixElement.innerText = `Prix: ${article.prix} € (${article.prix < 35 ? "€" : "€€€"})`;
        // element parag(p):
        const categorieElement = document.createElement("p");
        categorieElement.innerText = article.categorie ?? "(aucune catégories)";
        //Création des élements de paragraphe:
        const descriptionElement = document.createElement("p");
        descriptionElement.innerText = article.description ?? "(aucune description)";
        // Création des éléments pour la présence (true or false) -pièce auto :Disp
        const dispoElement = document.createElement("p");
        dispoElement.innerText = article.disponibilite ? "En Stock":"(No-Stock)";
        // BOUTON AVIS
        const btnAvisElement = document.createElement('button');
        // Recupere les éléement parents auxquels ajouter les avis + tard:
        btnAvisElement.dataset.id = article.id;
        btnAvisElement.textContent = "Afficher les avis";



    //AFFICHAGE -- >
    //On rattache la balise article à la section Fiches
    sectionFiches.appendChild(pieceElement);
    //On attache l'image à pieceElement (la balise article)
    pieceElement.appendChild(imageElement);
    //Idem pour la catégories,prix,nom :
    pieceElement.appendChild(nomElement);
    pieceElement.appendChild(prixElement);
    pieceElement.appendChild(categorieElement);
    //Ajout les élement au DOM :
    pieceElement.appendChild(descriptionElement);
    pieceElement.appendChild(dispoElement);
    pieceElement.appendChild(btnAvisElement);
    }
     // Apport fonction -- avis (avis.js)
    ajoutListenersAvis();  
}
genererPieces(pieces);

// Boucle qui parcours toutes les pièces :
for(let i = 0;i<pieces.length;i++){
    const id = pieces[i].id;
    const avisJSON = window.localStorage.getItem(`avis-place-${id}`);
    const avis = JSON.parse(avisJSON);

    if(avis !== null){
        const pieceElement = document.querySelector(`article[data-id="${id}"`);
        afficherAvis(pieceElement,avis)
    }
}



//réordonnez les fiches produits grâces à la fonction sort:
const boutonTrier = document.querySelector(".btn-trier");
boutonTrier.addEventListener('click',function(){
    //copier la liste d'origine 
    const pieceOrdonnes = Array.from(pieces);
    pieceOrdonnes.sort((a, b) =>{
        // si le résultat de a-b est négatif b sera devant b et vise vers ça 
        return a.prix - b.prix
    });
    //afficher - si le trie à bien été effectuer
    console.log(pieceOrdonnes)
});

// Filtrer les différents éléments
const boutonFiltrer = document.querySelector(".btn-filtrer"); 
boutonFiltrer.addEventListener("click",function(){
    const pieceFiltres = pieces.filter(function(piece){
        return piece.prix <=35;
    });
    console.log(pieceFiltres);
});

// Trie par prix décroissant
const boutonDecroissant = document.querySelector(".btn-decroissant");
boutonDecroissant.addEventListener("click", function () {
    //créer une copie de la liste des pièces
    const piecesOrdonnees = Array.from(pieces);
    piecesOrdonnees.sort(function (a, b) {
        return b.prix - a.prix;
     });
     console.log(piecesOrdonnees);
});

//Filtrer sans description
const buttonNoDescrip = document.querySelector(".btn-nodesc")
buttonNoDescrip.addEventListener("click",function(){
    const pieceFiltrees = pieces.filter(function(piece){
        return piece.description
    })
    console.log(pieceFiltrees);
});
//<---------------------------------------------------------->
// Liste -OBJETS-
//Création d'une liste avec les noms des objets:
//Récuperer tout les "noms" du fichier JSON:
const noms = pieces.map(piece => piece.nom);
//Boucle des pièces abordables càd dont le prix est inf à 35euros:
// Suppression des élements dont le prix est sup à 35euros
for(let i = pieces.length -1;i>=0;i--){
    if(pieces[i].prix>35){
        noms.splice(i,1);
    }
}
console.log(noms)
//Création de l'en-tête
const pElement = document.createElement('p')
pElement.innerHTML="Les Pieces abordables";
// Création de la liste des pièce abordables:
const abordablesElements = document.createElement('ul');
//Ajout de chaque "noms" à la liste
for (let i=0 ;i<noms.length;++i ){
    const nomElement = document.createElement('li');
    nomElement.innerText = noms[i];
    abordablesElements.appendChild(nomElement);
}

//Affichage -- Ajout de l'en-tête puis de la liste au bloc résultatq filtres
document.querySelector(".abordables")
    // ajouter en tete - piece abordables
    .appendChild(pElement)
    .appendChild(abordablesElements);


//Création d'une liste avec les prix et nom des pièces dispo:
const pricesDispo = pieces.map(piece => piece.prix);
const nomDipo = pieces.map(piece => piece.nom);

// Boucle parcourir la liste de la fin vers le début 
for(let i = pieces.length -1;i>=0;i--){
    if(pieces[i].disponibilite === false){
        nomDipo.splice(i,1); // supprimer le nom si dispo = false
        pricesDispo.splice(i,1); // supprimer le prix si dispo = false
    }
}

const dispoElement = document.createElement("ul");

for(let i = 0;i< nomDipo.length;i++){
    const nomElement = document.createElement('li');
    nomElement.innerText = `${pricesDispo[i]}€ - ${nomDipo[i]}euros`
    dispoElement.appendChild(nomElement);
}

const pElementDisponible = document.createElement('p')
pElementDisponible.innerText = "Pièce disponibles:";

document.querySelector(".dispo")
    // ajouter en tete - disponibilité
    .appendChild(pElementDisponible)
    .appendChild(dispoElement);

const inputPrixMax = document.querySelector("#prix-max")
inputPrixMax.addEventListener('change', ()=>{
    const pieceFiltrees = pieces.filter(function(piece){
        return piece.prix <= inputPrixMax.value;
    });
    document.querySelector(".fiches").innerHTML="";
    genererPieces(pieceFiltrees);
});

// Ajoute du listener pour mettre à jour des données du localStorage
const boutonMettreAJour = document.querySelector(".btn-maj");
boutonMettreAJour.addEventListener('click', function(){
    window.localStorage.removeItem("pieces");
});

await afficherGraphiqueAvis();







