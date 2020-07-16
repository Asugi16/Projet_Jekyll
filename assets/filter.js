const urlParams = new URLSearchParams(window.location.search);
const search = urlParams.get('search');

function isRelevant(elt){
    return hasCategory(elt) || hasTags(elt) || hasTitle(elt) || hasAuthor(elt);
}
function hasCategory(elt){
    return elt.categorie == search;
}
function hasTags(elt){
    return (elt.tags || []).indexOf(search) >= 0;
}
function hasTitle(elt){
    return elt.title.indexOf(search) >= 0;
}
function hasAuthor(elt){
    return elt.author == search;
}


// Récupération asynchrone des données json
fetch('/search.json')
    .then(res => res.json())
    .then((data) => {
        console.log(data)
        const allPosts = data.posts.concat(data.codes);
        const filtered = allPosts.filter(isRelevant);
        console.log(filtered)

        // Le reste du code va ici
        // ...

        const $content = document.getElementById("dynamic-content");
        $content.innerHTML = generateHtml();

        function generateHtml(){

            let html="";
            for(let datum of filtered){
                html +=`
                <div class="col-12 postlist alternative text-center">
                <a href="${ datum.url }" class="url-title"><h2>${ datum.title }</h2></a>
                
                
                    <p class="row ">
                        <div class="col">
                         <img class=" w-25 " src="${ datum.image }" alt="${ datum.title }"> 
                        </div>
                    </p>
                    <br/>
                ${ datum.content }
                <br/>
                ${ datum.author }
                <br/>
                    ${
                        datum.tags.split(',').map(function(tag){
                            return `
                            <a href="/tag.html?tag=${ tag }">
                                ${ tag }
                            </a>
                            `;
                        }).join('')
                    }
                </div>
                
                `
            }

            return html;
        }function generateHtml(){

            let html="";
            for(let datum of filtered){
                html +=`
                <div class="col-12 postlist alternative text-center">
                <a href="${ datum.url }" class="url-title"><h2>${ datum.title }</h2></a>
                
                
                    <p class="row ">
                        <div class="col">
                         <img class=" w-25 " src="${ datum.image }" alt="${ datum.title }"> 
                        </div>
                    </p>
                    <br/>
                ${ datum.content }
                <br/>
                ${ datum.author }
                <br/>
                `;

                for(let tag of datum.tags.split(',')){
                    html += `
                            <a href="/tag.html?tag=${ tag }">
                                ${ tag }
                            </a>
                            `;
                }

                html += "</div>";
            }

            return html;
        }
    })