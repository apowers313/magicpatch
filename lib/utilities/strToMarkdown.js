function strToMarkdown(str) {
    // TODO: use a library like: https://www.npmjs.com/package/html-entities
    return str
        // replace & with &amp;
        .replace(/&/gm, "&amp;")
        // preserve spacing at start of string
        // TODO: this is kinda ugly, it'd be nice if a unicode character worked here
        .replace(/^ +/gm, (match) => `${match.replace(/ /g, "&nbsp;")}`)
        // replace < with &lt;
        .replace(/</gm, "&lt;")
        // replace > with &gt;
        .replace(/>/gm, "&gt;")
        // replace newline with HTML <br>
        .replace(/\n/g, "<br>\n");
}

module.exports = {
    strToMarkdown,
};
