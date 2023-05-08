/**
 * HTML to file
 *
 * File.export();
 * @param {string} element.
 * @param {string} filename.
 * @param {string} type.
 * @param {string} sheet name for excel.
 * @return file.
 *
 * HTML custom
 * background: #cccccc;
 * border: .5pt solid black;
 * font-weight: 700;
 * text-align: center;
 * font-style: italic;
 * width:60pt; width max a4 ~ 480pt
 * vertical-align: middle;
 * mso-number-format:'\@' format cell text;
 * <table style="font-family: 'Times New Roman'">
 */
var HTE = {
    uri: 'data:application/vnd.ms-excel;base64,',
    template: '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" ' +
        'xmlns="http://www.w3.org/TR/REC-html40"><meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8"><head>' +
        '<!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->' +
        '</head><body>{content}</body></html>',
    classRemove: ['export-hidden'],
    base64: function (s) {
        return window.btoa(unescape(encodeURIComponent(s)))
    },
    format: function (s, c) {
        return s.replace(/{(\w+)}/g, function (m, p) {
            return c[p];
        })
    },
    getContent: function (element) {
        let selector = document.getElementById(element);
        let content = selector.innerHTML;

        //Remove tag with class
        this.classRemove.forEach(function (classRemove) {
            let tagClass = document.querySelectorAll('.' + classRemove);
            tagClass.forEach(function (tag) {
                content = content.replace(tag.outerHTML, '');
            });
        });
        return content;
    },
    export: function (element, filename, type, worksheet) {
        type = type || 'xls';
        worksheet = worksheet || 'worksheet';
        let content = this.getContent(element);
        let ctx = {worksheet: worksheet, content: content};
        let link = document.createElement("a");
        if (link.download !== undefined) {
            link.setAttribute("href", this.uri + this.base64(this.format(this.template, ctx)));
            link.setAttribute("download", filename + '.' + type);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('Export file only works in Chrome, Firefox, and Opera!');
        }
    }
};