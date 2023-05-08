new Vue({
    el: '#app',
    data: {
        cards: [],
        content: ''
    },
    methods: {
        fileSelect: function (event) {
            let fileReader = new FileReader();
            fileReader.readAsText(event.target.files[0]);
            fileReader.onload = () => {
                this.content = fileReader.result;
            };
        },
        parseContent: function () {
            let temp;
            temp = this.content;
            temp = temp.replace(/;/gim, '');
            temp = temp.replace(/^BEGIN:VCARD/gim, '');
            temp = temp.replace(/^N.*/gim, '');
            temp = temp.replace(/^END:VCARD/gim, '|');
            temp = temp.replace(/^VERSION:.*/gim, '');
            temp = temp.replace(/CHARSET=.*:/gim, ':');
            temp = temp.replace(/:/gim, ': ');
            temp = temp.replace(/^PHOTO.*/gim, '');
            temp = temp.replace(/^ .*\n/gim, '');
            let arr = temp.match(/(=..=.*=..$|%..%.*%..$)/gim);
            if (arr !== null) {
                let length = arr.length;
                for (let x = 0; x < length; x++) {
                    arr[x] = arr[x].replace(/={1}/g, '%');
                }
                for (let x = 0; x < length; x++) {
                    arr[x] = decodeURI(arr[x]);
                }
                for (let x = 0; x < length; x++) {
                    temp = temp.replace(/(=..=.*=..$|%..%.*%..$)/m, arr[x]);
                }
            }
            let cardStringArr = temp.split("|");
            this.cards = [];
            cardStringArr.forEach((cardString) => {
                cardString = cardString.replace(/FN:/g, '"FN":"');
                cardString = cardString.replace(/TELCELL:/g, '","TELCELL":"');
                cardString = cardString.replace(/TELHOME:/g, '","TELHOME":"');
                cardString = cardString.replace(/\r?\n|\r/g, '');
                if (cardString) {
                    cardString = cardString + '"';
                    cardString = "{" + cardString + "}";
                    cardString = cardString.replace(/:" /g, ':"');
                    let card = JSON.parse(cardString);
                    this.cards.push(card);
                }
            })
        },
        del: function (index) {
            this.cards.splice(index, 1);
        }
    }
})
;