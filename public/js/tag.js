const ul = document.querySelector("ul")
const tagInput = document.getElementById("tags")
const tagUl = document.getElementById("tagsUl")
const tagCounterLimit = document.querySelector(".details span")
const titleData = document.getElementById('titleData')
const form = document.querySelector("form")

let counterLimit = 5
let tags = []


tagCounter()

function tagCounter(){
     tagCounterLimit.innerText = counterLimit - tags.length
}

const createTag = () => {
     tagUl.querySelectorAll("li").forEach(li => li.remove())

     tags.slice().reverse().forEach(tag => {
        let tagElement = `<li>${tag} <i class="fa-solid fa-xmark" onclick="remove(this, '${tag}')"></i></li>`
        tagUl.insertAdjacentHTML("afterbegin", tagElement)
     })
     tagCounter()
}

function remove(element, tag){
     let index = tags.indexOf(tag)
     tags = [...tags.slice(0, index), ...tags.slice(index + 1)]
     element.parentElement.remove()
     tagCounter()
}

function tagAdd(e){
     if(e.key == "Enter"){
          let tag = e.target.value.replace(/\s+/g, ' ')
          if(tag.length > 1 && !tags.includes(tag)){
               if(tags.length < 5){
                    tag.split(',').forEach(tag => {
                         tags.push(tag)
                         createTag()
                    })
               }
          }
          e.target.value = ''
     }
}

tagInput.addEventListener("keyup", tagAdd)

let titleValue = ''
const addInput =  (e) => {
     titleValue = e.target.value
}

form.addEventListener("submit", async (e) =>{
     e.preventDefault()

     var contentValue = tinymce.get("textareaEditor").getContent()

     if(tags.length > 1 && titleValue.length > 5){
          // http://localhost:3000/post/addPost
         // https://nodejs-blog-rouge.vercel.app/
         const url = "http://localhost:3000/post/addPost"
          await fetch(url, {
              method: 'POST',
              headers: { 
               'Accept': 'application/json',
               'Content-Type': 'application/json'
              },
              body: JSON.stringify({ newTags: tags, title: titleValue, content: contentValue })
             
         })
         .then(res => res.json())
         .then((data) => {
               if(data){
                    var url = "http://localhost:3000/"
                    window.location.href = url
               }
         })
         .catch(error => console.error(error))
     } 
 })

titleData.addEventListener('keyup', addInput)




