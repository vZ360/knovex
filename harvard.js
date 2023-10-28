document.getElementById("essay").addEventListener("mouseup", function(event) {
    var selection = getSelectedText();

    if (selection) {
        var mark = document.createElement("span");
        mark.className = "highlight";
        mark.textContent = selection;

        var range = window.getSelection().getRangeAt(0);
        range.deleteContents();
        range.insertNode(mark);
    }
});

function getSelectedText() {
    if (window.getSelection) {
        return window.getSelection().toString();
    } else if (document.selection && document.selection.type !== "Control") {
        return document.selection.createRange().text;
    }
    return null;
}


$(document).ready(function() {
    $('#sub2').click(function() {
        // Extract author names and years using regular expression
        var authorYearExp = /([^0-9]+)\b(\d{4})\b/g;
        var refInput = $('#pastedRef').text();
        var authors = [];
        var match;

        while ((match = authorYearExp.exec(refInput)) !== null) {
            var author = match[1].trim(); // Remove leading and trailing spaces
            var year = match[2];
            // Remove dot if it appears at the beginning of the author's name
            author = author.replace(/^\./, '');
            authors.push(author + year);
        }

        // Combine author names and years into a single string for further processing
        var nameInput = authors.join(' ');
        
        // Define regular expressions to remove initials, commas, and the word "and"
        var InitialRegex = /([A-Z]\.)/g; // Regular expression for matching initials
        var CommaRegex = /(\s,)/g; // Regular expression for matching commas
        var AndRegex = /\band\b/g; // Regular expression for identifying "and"

        // Apply the regular expressions to the nameInput string
        var removedInitial = nameInput.replace(InitialRegex, '');
        var removeComma = removedInitial.replace(CommaRegex, '');
        var andRemoval = removeComma.replace(AndRegex, '');
        var yearPattern = /(\d{4})/g
        var result = andRemoval.replace(yearPattern,function(match){
            return match + '*'
        })
        var starpattern = /\*/g
        resultModified = result.split(starpattern)
        resultModified.forEach(function(data){
            $('#removeInitials').append(data + '<br>')
        })

        var extractWords = []
        for(i=0;i<resultModified.length-1;i++){
            var arrayRegex = /([\wÀ-ÿ \s* \-*]+)/g;
            var matches = resultModified[i].match(arrayRegex)
            if(matches){
                matches = matches.map(function (element) {
                    return element.trim();
                  });
                extractWords.push(matches)
            }
        }
        console.log(extractWords)
        
        var spanis = document.querySelectorAll(".highlight");
        for (var i = 0; i <spanis.length; i++) {
            var span = spanis[i];
            var messageContainer = document.createElement("span");
            messageContainer.className = "message";
            var len = extractWords[i].length
            var dotRegex = /([\wÀ-ÿ \s* \-*]+\.)/g;
            var nextElement = span.nextSibling.textContent.charAt(0)
            console.log(nextElement)
            if (nextElement == '.') {

                if(len == 2){
                    extractWords[i] = ' (' + extractWords[i][0] + ',' + extractWords[i][1] + ')'
                }
                else if(len == 3){
                    extractWords[i] = ' (' + extractWords[i][0] + " and " + extractWords[i][1] + ', ' + extractWords[i][2] + ')'
                }
                else if(len>=4){
                    var yearIndex = len - 1
                    extractWords[i] = ' (' + extractWords[i][0] + " et al., " + extractWords[i][yearIndex] + ')'
                }
            }
            else{

                if(len == 2){
                    extractWords[i] = ' ' + extractWords[i][0] + ' ('+ extractWords[i][1] + ')' + ', '
                }
                else if(len == 3){
                    extractWords[i] = ' ' + extractWords[i][0] + " and " + extractWords[i][1] + ' ('+ extractWords[i][2] + ')' + ', '
                }
                else if(len>=4){
                    var yearIndex = len - 1
                    extractWords[i] = ' ' + extractWords[i][0] + " et al. " + '(' + extractWords[i][yearIndex] + ')' + ', '
                }
            }
            var message = extractWords[i]
            messageContainer.textContent = message;
            span.parentNode.insertBefore(messageContainer, span.nextSibling);
        }

        var refInput = $('#pastedRef').html();
        var refexp = /(\S+)\s*,\s*(\b\d{4}\b)\./g; // Corrected the regular expression pattern

        var result = refInput.replace(refexp, function(match, precedingChar, year) {
            return precedingChar + ' (' + year + ')';
        });

        $('#pastedRef').html(result);    
    });
});


