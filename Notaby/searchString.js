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
			
			getDocStats(currentBook);

			//remove line breaks and replace with a <br>
			currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');
			document.getElementById("fileContent").innerHTML = currentBook;
			
			
			var elmnt = document.getElementById("fileContent");
			elmnt.schrollTop = 0;	
		}
	};	
}


//Perform search - Clear previous mark and make new mark according arround search text
performMark = function(){
	var keyword = document.getElementById("keyword").value;
	var book = document.getElementById("fileContent");

	//Clear all old marks
	let marks = document.querySelectorAll("mark");
	for (var i = 0; i < marks.length; i++){
		marks[i].outerHTML = marks[i].innerHTML;
	}

	//Mark new keywords
	var reg = new RegExp(keyword, "gi");
	var bookContent = book.innerHTML.replace(reg, "<mark>"+keyword+"</mark>");
	book.innerHTML = bookContent;

	//Reset match count
	var count = (bookContent.match(reg) || []).length;
	document.getElementById("searchstat").innerHTML = count + " matches found."

	//Scroll the first search result into view
	if(count > 0) {
		document.getElementsByTagName("mark")[0].scrollIntoView();
	}
}


//get the stats of the book
function getDocStats(fileContent){
	//Doc stats
	let text = fileContent.toLowerCase();
	let wordArray = text.match(/\b\S+\b/g);
	document.getElementById("docLength").innerText = "Document Length : " + text.length;
	document.getElementById("wordCount").innerText = "Word Count : " + wordArray.length;

	//Word Stas - most and list used words
	let wordDic = {};
	let STOPWORDS = getStopWords();

	for (let word in wordArray){
		let wordValue = wordArray[word];
		if(!STOPWORDS.includes(wordValue))
			if (wordDic[wordValue] > 0){
				wordDic[wordValue] += 1;
			}else{
				wordDic[wordValue] = 1;
			}
	}
	//sort and slice
	let wordList = sortDictionary(wordDic);
	var top5Words = wordList.slice(0,5);
	var least5Words = wordList.slice(-5,wordList.length);

	//Write stats elments to template - inflate ul with li's
	ULTemplate(top5Words, document.getElementById("mostUsed"));
	ULTemplate(least5Words, document.getElementById("leastUsed"));
}

//Implement template 
function ULTemplate(items, element){
	let rowTemplate = document.getElementById('template-ul-items');
	//identify template "<li>...</li>""
	let templateHTML = rowTemplate.innerHTML;
	let resultsHTML = "";

	for(i = 0; i < items.length; i++){
		resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + " time(s)");
	}

	element.innerHTML = resultsHTML
}

//sort map - convert to array and sort on value
function sortDictionary(obj){
	//convert the object to an array
	//{"apple":3.56, "pear":2.12} -- (["apple":3.56], ["pear":2.12])
	let arr = Object.keys(obj).map((key) => [key, obj[key]]);
	
	//sort array
	arr.sort(function(first, second){
		return second[1] - first[1];
	});
	return arr;
}

//English stop words
function getStopWords() {
	//http://xpo6.com/list-of-english-stop-words/
	return ["a", "about", "above", "above", "across", "after", "afterwards", "again", "against", "all", "almost", "alone", "along", "already", "also","although","always","am","among", "amongst", "amoungst", "amount",  "an", "and", "another", "any","anyhow","anyone","anything","anyway", "anywhere", "are", "around", "as",  "at", "back","be","became", "because","become","becomes", "becoming", "been", "before", "beforehand", "behind", "being", "below", "beside", "besides", "between", "beyond", "bill", "both", "bottom","but", "by", "call", "can", "cannot", "cant", "co", "con", "could", "couldnt", "cry", "de", "describe", "detail", "do", "done", "down", "due", "during", "each", "eg", "eight", "either", "eleven","else", "elsewhere", "empty", "enough", "etc", "even", "ever", "every", "everyone", "everything", "everywhere", "except", "few", "fifteen", "fify", "fill", "find", "fire", "first", "five", "for", "former", "formerly", "forty", "found", "four", "from", "front", "full", "further", "get", "give", "go", "had", "has", "hasnt", "have", "he", "hence", "her", "here", "hereafter", "hereby", "herein", "hereupon", "hers", "herself", "him", "himself", "his", "how", "however", "hundred", "i", "ie", "if", "in", "inc", "indeed", "interest", "into", "is", "it", "its", "itself", "keep", "last", "latter", "latterly", "least", "less", "ltd", "made", "many", "may", "me", "meanwhile", "might", "mill", "mine", "more", "moreover", "most", "mostly", "move", "much", "must", "my", "myself", "name", "namely", "neither", "never", "nevertheless", "next", "nine", "no", "nobody", "none", "noone", "nor", "not", "nothing", "now", "nowhere", "of", "off", "often", "on", "once", "one", "only", "onto", "or", "other", "others", "otherwise", "our", "ours", "ourselves", "out", "over", "own","part", "per", "perhaps", "please", "put", "rather", "re", "same", "see", "seem", "seemed", "seeming", "seems", "serious", "several", "she", "should", "show", "side", "since", "sincere", "six", "sixty", "so", "some", "somehow", "someone", "something", "sometime", "sometimes", "somewhere", "still", "such", "system", "take", "ten", "than", "that", "the", "their", "them", "themselves", "then", "thence", "there", "thereafter", "thereby", "therefore", "therein", "thereupon", "these", "they", "thick", "thin", "third", "this", "those", "though", "three", "through", "throughout", "thru", "thus", "to", "together", "too", "top", "toward", "towards", "twelve", "twenty", "two", "un", "under", "until", "up", "upon", "us", "very", "via", "was", "we", "well", "were", "what", "whatever", "when", "whence", "whenever", "where", "whereafter", "whereas", "whereby", "wherein", "whereupon", "wherever", "whether", "which", "while", "whither", "who", "whoever", "whole", "whom", "whose", "why", "will", "with", "within", "without", "would", "yet", "you", "your", "yours", "yourself", "yourselves", "the"];
}