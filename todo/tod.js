const inputBox=document.getElementById("input-box");
const Listcont=document.getElementById("list-con");
function addtask(){
    if(inputBox.value ==='')
    {
        alert('You must write something');
    }
    else{
        let li=document.createElement("li");
        li.innerHTML=inputBox.value;
        Listcont.appendChild(li);
        let span=document.createElement("span");
        span.innerHTML='\u00d7';
        li.appendChild(span);   
    }
    inputBox.value="";
    saveData();
}
Listcont.addEventListener("click",function(e){
    if(e.target.tagName==="LI")
    {
        e.target.classList.toggle("checked");
        saveData();
    }
    else if(e.target.tagName==="SPAN"){
        e.target.parentElement.remove();
        saveData();
    }
}, false);
function saveData(){
        localStorage.setItem("data",Listcont.innerHTML);
}
function showTask(){
    Listcont.innerHTML=localStorage.getItem("data");
}
showTask();