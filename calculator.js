$(document).ready(function() {
    let numOrphanedBrackets = 0;
    let justReset = false
    $("button").click(function () {

        if ($("#current-values").text() === "Infinity"
            || $("#current-values").text() === "Error") {
            $("#current-values").text("")
        }

        let lastChar = $("#current-values").text().slice(-1).trim()
        if(lastChar === "") {
            if (["*", "+", "-", "/"].includes($(this).text()))
            {
                return
            }
        }

        // Don't allow any non-arthmetic chars if the last char is a decimal sign
        if (lastChar === ".") {
            let val = $(this).text()
            if(isNaN(val) && !val.includes("C")) {
                return
            }
        }

        if(justReset) {
            justReset = false
            if (!isNaN(lastChar)) {
                $("#current-values").text("")
            }
        }

        if ($(this).is("#left-parentheses")) {
            if ([")"].includes(lastChar) || (lastChar !== "" && !isNaN(lastChar))) {
                // Add a * if needed for arthmetic
                $("#current-values").text(function (i, origText) {
                    return origText + "*"
                })
            }
            numOrphanedBrackets++;
        }

        if($(this).is("#equal")) {
            try {
                for(let i = numOrphanedBrackets; i > 0; i--)
                {
                    $("#current-values").text(function (i, origText) {
                        return origText + ")"
                    })
                }
                result = eval($("#current-values").text())
                $("#prev-values").text($("#current-values").text())
                $("#current-values").text(result)
                numOrphanedBrackets = 0
                justReset = true
            }
            catch(e) {
                $("#current-values").text("Error")
            }
        } else if ($(this).is("#right-parentheses")) {
            if(numOrphanedBrackets > 0) {
                var char = $(this).text()
                if($("#current-values").text().slice(-1) !== "(") {
                    $("#current-values").text(function (i, origText) {
                        return origText + char
                    })
                    numOrphanedBrackets--;
                }
            }
        } else if ($(this).is("#C")) {
            $("#current-values").text("")
            $("#prev-values").text("")
            numOrphanedBrackets = 0
        } else if($(this).is("#CE")) {
            let backspacedString = $("#current-values").text()
            // Check last char if it was a paranthesis
            if(backspacedString.slice(-1) === "(") {
                numOrphanedBrackets--;
            }
            if (backspacedString.slice(-1) === ")") {
                numOrphanedBrackets++;
            }

            backspacedString = backspacedString.substring(0, backspacedString.length - 1)

            $("#current-values").text(backspacedString)
        } else {
            var char = $(this).text()
            $("#current-values").text(function (i, origText) {
                return origText + char
            })
        }
    });
});