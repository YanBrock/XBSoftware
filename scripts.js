let container = getTagContainerObject("#mainContainer");

function getTagContainerObject(queryContainer)
{
    let tagContainer = 
    {
        container: null,
        tagsArea: null,
        currentBtn: null,
        historyBtn: null,
        clearBtn: null,
        historyTags: [],
        currentTags: [],    

        clearAllContent(event)
        {
            if(event.currentTarget == this.clearBtn)
            {
                localStorage.clear();
                document.location.reload();                
            }
        },
        
        loagStoredHistoryTags()
        {
            if(localStorage.getItem("history") != null)
            {
                this.historyTags = localStorage.getItem("history").split(",");
            }
        },

        loagStoredCurrentTags()
        {
            if(localStorage.getItem("current") != null)
            {
                this.currentTags = localStorage.getItem("current").split(","); 
                this.putCurrentTagsToArea();
            }
        },

        storeTagsInHistory()
        {
            if(localStorage.getItem("history") == null)
            {
                localStorage.setItem("history", "");
            }

            let history = localStorage.getItem("history").split(',');
            let current = this.currentTags;

            for(let i = 0; i < current.length; i++)
            {
                if(!history.includes(current[i]))
                {
                    history.push(current[i]);
                }
            }
            localStorage.setItem("history", history);
            this.historyTags = history;
        },                                            

        addNewTag(tagName)
        {
            let arrTagName = tagName.trim();
            arrTagName = arrTagName.split(" ");
            console.log(": " + arrTagName + ", " + arrTagName.length);
            if(arrTagName.length > 1)
            {
                this.removeNotReadonlyTags();
            }

            for(let i = 0; i < arrTagName.length; i++)
            {
                if(!this.currentTags.includes(arrTagName[i]))
                {   
                    this.currentTags.push(arrTagName[i]);                                              
                }  
            }   
            this.storeCurrentTags();
            this.storeTagsInHistory();
            this.putCurrentTagsToArea();
        },

        getHistoryToCurrent(event)
        {
            let name = event.currentTarget.innerText;
            if(!this.currentTags.includes(name))
            {
                this.addNewTag(name);
                this.currentBtn.classList.add("active_selector");
                this.historyBtn.classList.remove("active_selector");
            }
        },

        storeCurrentTags()
        {
            localStorage.setItem("current", this.currentTags);
        },

        closeTag(event)
        {
            let name = event.currentTarget.parentNode.innerText;
            event.currentTarget.parentNode.remove();

            this.currentTags.splice(this.currentTags.indexOf(name), 1);

            this.storeCurrentTags();
        },

        removeNotReadonlyTags()
        {
            let notReadonly = this.tagsArea.querySelectorAll(".tag:not(.readonly)");
            
            for(let i = 0; i < notReadonly.length; i++)
            {
                notReadonly[i].remove(); 
                this.currentTags.splice(this.currentTags.indexOf(notReadonly[i].innerText), 1);
            }
        },

        readonlyTag(event)
        {
            let addReadOnly = event.currentTarget;

            if(addReadOnly.classList.contains("readonly"))
            {
                addReadOnly.classList.remove("readonly");
            } 
            else
            {
                addReadOnly.classList.add("readonly");
            } 
        },

        addTagsEvent()
        {
            let tags = this.tagsArea.querySelectorAll(".tag");
            for(let i = 0; i < tags.length; i++)
            {
                tags[i].addEventListener("dblclick", this.readonlyTag.bind(this));
            }

            let allTags = this.tagsArea.querySelectorAll(".tag a"); 
            for(let i = 0; i < allTags.length; i++)
            {
                allTags[i].addEventListener("click", this.closeTag.bind(this));
            }

            let allTagsHistory = this.tagsArea.querySelectorAll(".history_area");
            for(let i = 0; i < allTagsHistory.length; i++)
            {
                allTagsHistory[i].addEventListener("click", this.getHistoryToCurrent.bind(this));                
            }
        },

        insertTagsToArea(arr, addClassName)
        {
            if(addClassName == null)
            {
                addClassName = "";
            }

            this.tagsArea.innerHTML = "";

            let tagsHtml = "";
            for(let i = 0; i < arr.length; i++)
            {
                if(arr[i] != "")
                {
                    tagsHtml += `<div class="tag ${addClassName}" title="double click to readonly">${arr[i]}
                                    <a href="#"></a>
                                </div>`;
                }           
            }                            

            this.tagsArea.insertAdjacentHTML("afterbegin", tagsHtml);
        },

        putHistoryTagsToArea()
        {
            this.insertTagsToArea(this.historyTags, "history_area"); 
            this.addTagsEvent();
        },

        putCurrentTagsToArea()
        {
            this.insertTagsToArea(this.currentTags); 
            this.addTagsEvent();
        },

        switchArea(event)
        {            
            if(!event.currentTarget.classList.contains("active_selector"))
            {   
                if(event.currentTarget == this.currentBtn)
                {      
                    this.putCurrentTagsToArea();
                    
                    this.historyBtn.classList.remove("active_selector");
                    this.currentBtn.classList.add("active_selector");
                }
                else if(event.currentTarget == this.historyBtn)
                {        
                    this.putHistoryTagsToArea();

                    this.currentBtn.classList.remove("active_selector");
                    this.historyBtn.classList.add("active_selector");
                }
            }
        },

        disableContainer(disabled)
        {
            let input = document.querySelector("#input");
            let addBtn = document.querySelector("#btnAdd");
            if(disabled)
            {
                input.disabled = true;
                input.classList.add("blocked");

                addBtn.disabled = true;
                addBtn.classList.add("blocked");

                this.clearBtn.disabled = true;
                this.clearBtn.classList.add("blocked");

                this.tagsArea.classList.add("blocked"); 
            }
            else
            {
                input.disabled = false;
                input.classList.remove("blocked");

                addBtn.disabled = false;
                addBtn.classList.remove("blocked");

                this.clearBtn.disabled = false;
                this.clearBtn.classList.remove("blocked");

                this.tagsArea.classList.remove("blocked");
            }
        },

        addBtnEvents()
        {
            this.currentBtn.addEventListener("click", this.switchArea.bind(this));
            this.historyBtn.addEventListener("click", this.switchArea.bind(this)); 
            this.clearBtn.addEventListener("click", this.clearAllContent.bind(this));            
        },

        init(queryContainer)
        {
            this.container = document.querySelector(queryContainer);   
            this.tagsArea = this.container.querySelector(".tags_area");            
            this.currentBtn = this.container.querySelector(".tab1");            
            this.historyBtn = this.container.querySelector(".tab2"); 
            this.clearBtn = this.container.querySelector(".tab3");  

            this.addBtnEvents();

            this.loagStoredCurrentTags();
            this.loagStoredHistoryTags();            

            return this;
        }
    };
    
    return tagContainer.init(queryContainer);
}


let btnReadonlyOn = document.querySelector("#btnReadonlyOn");
btnReadonlyOn.addEventListener("click", readonlyUi);

let btnReadonlyOff = document.querySelector("#btnReadonlyOff");
btnReadonlyOff.addEventListener("click", readonlyUi);

function readonlyUi()
{ 
    if(!this.classList.contains("active"))
    {   
        if(this == btnReadonlyOn)
        {
            btnReadonlyOff.classList.remove("active");
            btnReadonlyOn.classList.add("active");

            container.disableContainer(true);
        }
        else if(this == btnReadonlyOff)
        {
            btnReadonlyOn.classList.remove("active");
            btnReadonlyOff.classList.add("active");
            
            container.disableContainer(false);
        }
    }
}

let addBtn = document.querySelector("#btnAdd");
addBtn.addEventListener("click", addTag);

function addTag()
{
    if(input.value != "")
    {
        container.addNewTag(input.value);
        input.value = "";
    }
}

let input = document.querySelector("#input");
input.addEventListener("keyup", function(event) 
{
    if (event.keyCode === 13)
    {
        addBtn.click();                                                              
    }
});