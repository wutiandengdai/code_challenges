//load a book from disk
function loadBook(filename, displayName) {
	let currentBook = "";
	let url = "resources/books/" + filename;
	
	//reset UI
	document.getElementById("fileName").innerHTML = displayName;
	document.getElementById("searchstat").innerHTML = "";
	document.getElementById("keyword").value="";
	
	//create a server request to load book
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.send();
	
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4 && xhr.status == 200){
			currentBook = xhr.responseText;
			
			//remove line breaks and replace with a <br>
			currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');
			document.getElementById("fileContent").innerHTML = currentBook;
			
			
			var elmnt = document.getElementById("fileContent");
			elmnt.schrollTop = 0;	
		}
	};	
}
