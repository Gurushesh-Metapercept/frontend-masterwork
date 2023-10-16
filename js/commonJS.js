document.addEventListener("DOMContentLoaded", () => {
      // Favicon
  const linkElements = document.head.querySelectorAll('link[rel="stylesheet"]');

  linkElements.forEach((linkElement) => {
    
    const hrefAttribute = linkElement.getAttribute("href");
    
    if(hrefAttribute.split("/")[hrefAttribute.split("/").length - 1] === "common-extended.css"){
 
      const newFavicon = document.getElementById('favicon');
  
      newFavicon.href = hrefAttribute.split("css")[0] + "images/favicon.png";
    }
  });
})

 

// xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
 // ============================================================ Algolia and Search Modal
 
 document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const nosearch = document.getElementById('nosearch');
    const headerSearchBox = document.getElementById('headerSearchBox');
  
    const client = algoliasearch('QX9MQYMQ4D', 'edc43cd3cc2ceddc90b7eb276b3ccf1e');
    const indexName = "output-frontend"


    // const client = algoliasearch('MXP5XEK5FN', 'b455d5113e8705f4366e086076658a1b');
    // const indexName = "aurigohtml5"

    function clearSearchInput() {
      searchInput.value = '';
      searchResults.innerHTML = '';
      nosearch.innerHTML = ""
      nosearch.style.display = 'none';
    }

    function focusSearchInput() {
        searchInput.focus();
    }
  
    searchInput.addEventListener('input', async (event) => {
      const query = event.target.value;
      if (query.length > 0) {
        nosearch.style.display = 'none';
        const index = client.initIndex(indexName);
        const { hits } = await index.search(query);
    
        searchResults.innerHTML = '';

        function decodeHtmlEntities(text) {
          const parser = new DOMParser();
          const decodedString = parser.parseFromString(text, 'text/html').body.textContent;
          return decodedString;
        }

        if(hits.length === 0){
          nosearch.style.display = 'block';
          nosearch.innerHTML = `No results for <b>\"${query}\"</b>`
        }
       
      
        hits.forEach((hit) => {
          const resultItem = document.createElement('a');
          resultItem.classList.add('card');
          console.log(hit)

          const cardBody = document.createElement('div');
          cardBody.classList.add('card-body');

          cardBody.style.whiteSpace = 'normal'; // Allow text to wrap
          cardBody.style.overflow = 'hidden'; // Hide any overflow
          cardBody.style.textOverflow = 'ellipsis'; // Add ellipsis if text overflows
          cardBody.style.width = '100%';
          
          resultItem.href = hit.url;
          // cardBody.textContent = decodeHtmlEntities(hit._highlightResult.hierarchy.lvl1.value); 

          
          if (hit._snippetResult && hit._snippetResult.content) {
            const highlightedContent = hit._snippetResult.content.value;
            cardBody.innerHTML = highlightedContent;
          } else {          
            cardBody.textContent = decodeHtmlEntities(hit._highlightResult.hierarchy.lvl1.value); 
          }

    
          resultItem.appendChild(cardBody);

          resultItem.addEventListener('click', () => {
            modal.hide();
          });
          searchResults.appendChild(resultItem);
        });
      } else {
        searchResults.innerHTML = ''; 

        nosearch.style.display = 'block';
        nosearch.innerHTML = "No recent searches"
        
      }
    });
     
  
   
    const modal = new bootstrap.Modal(document.getElementById('searchBoxModal'));
    modal._element.addEventListener('hidden.bs.modal', clearSearchInput);

     modal._element.addEventListener('shown.bs.modal', () => {
      headerSearchBox.blur(); 
      focusSearchInput();
    });
  });
  



// ========================================================================= Download Function 

window.onload = function() {
  document.getElementById('download-btn').addEventListener('click', function() {
    window.scrollTo(0, 0);

    setTimeout(async function() {
      const headerElement = document.querySelector('#mainHeader').cloneNode(true);
      const articleElement = document.querySelector('article').cloneNode(true);

      // let logo = document.querySelector(".navbar-brand")

      const elementsToIgnore = articleElement.querySelectorAll('.ignore-this');
      elementsToIgnore.forEach(function(element) {
        element.remove();
      });

      const headerElementsToIgnore = headerElement.querySelectorAll('.ignore-this');
      headerElementsToIgnore.forEach(function(element) {
        element.remove();
      });

      const combinedElement = document.createElement('div');
      combinedElement.appendChild(headerElement);
      combinedElement.appendChild(articleElement);

      const imageTypes = ['png', 'jpeg', 'webp']; 
      const options = {
        margin: 10, 
        filename: 'page.pdf',
        image: { type: imageTypes, quality: 0.98 }, 
        html2canvas: { scale: 2 }, 
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } 
      };

      try {
        await html2pdf().from(combinedElement).set(options).save('page.pdf');
        console.log('PDF generated and saved successfully.');

        // Any additional code you want to execute after the PDF is generated and saved

      } catch (error) {
        console.error('An error occurred while generating or saving the PDF:', error);
      }
    }, 1000);
  });
};



  // ========================================================================= Print Function 
function printPage() {

  window.scrollTo(0, 0);

  setTimeout(() => {

  let elementsToHide = document.querySelectorAll('.no-print');
  elementsToHide.forEach(function(element) {
    element.style.display = 'none';
  });


  // let style = document.createElement('style');
  // style.innerHTML = '@page { size: auto; margin-top: 5mm; margin-bottom: 5mm; }';
  // document.head.appendChild(style);


  window.print();
  // style.remove();

  elementsToHide.forEach(function(element) {
    element.style.display = '';
  });
  }, 500)
}
